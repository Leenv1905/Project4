package com.eproject.petsale.pet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetImageDTO {
    private String imageUrl;
    private String objectKey;
    private boolean isPrimary;
    private int displayOrder;

    private String originalImageUrl;

    // Trường này chính là cái bạn cần: URL kết quả sau khi AI render
    // Trong service bạn gọi getAiRenderedUrl() thì ở đây phải đặt là aiRenderedUrl
    private String aiRenderedUrl;

    // Trường này đánh dấu ảnh đã qua xử lý AI chưa (setAiProcessed)
    private boolean isAiProcessed;

    private String aiPrompt;
}