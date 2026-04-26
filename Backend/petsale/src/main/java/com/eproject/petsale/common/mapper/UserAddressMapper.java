package com.eproject.petsale.common.mapper;

import com.eproject.petsale.user.dto.CreateAddressRequest;
import com.eproject.petsale.user.dto.UserAddressResponse;
import com.eproject.petsale.user.entity.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserAddressMapper {

    // entity -> response
    UserAddressResponse toResponse(UserAddress entity);
    List<UserAddressResponse> toResponseList(List<UserAddress> entities);

    // request -> entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    UserAddress toEntity(CreateAddressRequest request);
}