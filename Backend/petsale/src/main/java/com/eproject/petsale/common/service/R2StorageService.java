package com.eproject.petsale.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class R2StorageService {

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket-name}")
    private String bucketName;

    @Value("${cloudflare.r2.public-url}")
    private String publicUrl;

    public R2StorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    
    public PetImageUploadResult uploadFile(MultipartFile file, Long petId) throws IOException {
        String extension = getFileExtension(file.getOriginalFilename());
        String objectKey = "pets/" + petId + "/" + UUID.randomUUID().toString() + extension;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, 
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        String completeImageUrl = publicUrl + "/" + objectKey;
        return new PetImageUploadResult(objectKey, completeImageUrl);
    }

   
    public void deleteFile(String objectKey) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }

    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.lastIndexOf(".") > 0) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return "";
    }

    public static class PetImageUploadResult {
        public final String objectKey;
        public final String imageUrl;

        public PetImageUploadResult(String objectKey, String imageUrl) {
            this.objectKey = objectKey;
            this.imageUrl = imageUrl;
        }
    }
}
