package com.eproject.petsale.common.mapper;


import com.eproject.petsale.user.dto.RegisterSellerRequest;
import com.eproject.petsale.user.dto.SellerProfileResponse;
import com.eproject.petsale.user.entity.SellerProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SellerMapper {

    // Ánh xạ từ Request sang Entity để lưu DB
    @Mapping(target = "displayName", source = "displayName")
    @Mapping(target = "user", ignore = true) // Sẽ set thủ công trong Service
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    SellerProfile toEntity(RegisterSellerRequest request);

    // Ánh xạ từ Entity sang Response trả về Client
    @Mapping(target = "shopName", source = "displayName")
    @Mapping(target = "address", source = "user.address") // Lấy địa chỉ từ thực thể User liên kết
    @Mapping(target = "userId", source = "userId")
    SellerProfileResponse toResponse(SellerProfile entity);
}