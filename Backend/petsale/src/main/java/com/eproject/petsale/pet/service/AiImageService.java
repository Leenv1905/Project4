package com.eproject.petsale.pet.service;

import com.eproject.petsale.common.exception.ExternalApiException;
import com.eproject.petsale.pet.entity.UserAiUsage;
import com.eproject.petsale.pet.repository.UserAiUsageRepository;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiImageService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final UserAiUsageRepository usageRepository;
    private final UserRepository userRepository;

    private static final int DAILY_LIMIT = 5;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public String renderAiPreview(MultipartFile file, String style) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        LocalDate today = LocalDate.now();
        UserAiUsage usage = usageRepository.findByUserIdAndUsageDate(user.getId(), today)
                .orElse(new UserAiUsage(user.getId(), today, 0));

        if (usage.getUsageCount() >= DAILY_LIMIT) {
            throw new RuntimeException("Bạn đã hết lượt tạo ảnh AI cho hôm nay (Tối đa " + DAILY_LIMIT + " lần).");
        }

        String imageDataUrl = callOpenAiEdits(file, style);

        usage.setUsageCount(usage.getUsageCount() + 1);
        usageRepository.save(usage);

        return imageDataUrl;
    }

    private String callOpenAiEdits(MultipartFile file, String style) {
        try {
            String apiUrl = "https://api.openai.com/v1/images/edits";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBearerAuth(apiKey);

            // Chuyển đổi và Crop ảnh sang PNG 1:1
            Resource imageResource = convertToPngResource(file);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("model", "gpt-image-1");
            body.add("prompt", buildPrompt(style));
            body.add("image", imageResource);
            body.add("n", 1);
            body.add("size", "1024x1024");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, String>> data = (List<Map<String, String>>) response.getBody().get("data");
                String b64 = data.get(0).get("b64_json");
                if (b64 != null) {
                    return "data:image/png;base64," + b64;
                }
                // fallback nếu API trả về url
                return data.get(0).get("url");
            }
        } catch (HttpClientErrorException e) {
            throw new ExternalApiException("Lỗi xác thực hoặc yêu cầu không hợp lệ (" + e.getStatusCode().value() + "): " + e.getResponseBodyAsString());
        } catch (HttpServerErrorException e) {
            throw new ExternalApiException("Dịch vụ AI tạm thời không khả dụng (lỗi " + e.getStatusCode().value() + "), vui lòng thử lại sau.");
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ExternalApiException("Không thể kết nối đến dịch vụ AI, vui lòng thử lại sau.");
        }
        return null;
    }

    private String buildPrompt(String style) {
        String base = "A high-quality product photo of a pet, preserving the original image style, clearly showing its unique features such as breed, fur color, size, and facial details, suitable for an online marketplace listing, allowing changes in pose and background while maintaining consistency with the original style";

        if (style == null || style.isBlank()) {
            return base + ", consistent with original style, natural pose, clean or context-appropriate background, professional lighting, highly detailed";
        }

        return base + ", preserving original style, allowing pose and background customization, rendered in "
                + style.trim()
                + " style without overriding the original style, professional lighting, clean or context-appropriate background, highly detailed";
    }

    private Resource convertToPngResource(MultipartFile file) throws IOException {
        // 1. Đọc dữ liệu từ file
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new RuntimeException("Định dạng file không được hỗ trợ hoặc file bị hỏng.");
        }

        // 2. Logic Crop ảnh thành hình vuông (giữ tâm ảnh)
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        int minSide = Math.min(width, height);

        BufferedImage croppedImage = originalImage.getSubimage(
                (width - minSide) / 2,
                (height - minSide) / 2,
                minSide,
                minSide
        );

        // 3. Ghi dữ liệu vào ByteArrayOutputStream dưới dạng PNG
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        boolean success = ImageIO.write(croppedImage, "png", baos);

        if (!success) {
            throw new RuntimeException("Không thể chuyển đổi ảnh sang định dạng PNG.");
        }

        // 4. Trả về ByteArrayResource
        byte[] imageBytes = baos.toByteArray();
        return new ByteArrayResource(imageBytes) {
            @Override
            public String getFilename() {
                return "pet_image.png";
            }
        };
    }
}