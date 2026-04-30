package com.eproject.petsale.common.mapper;

import com.eproject.petsale.personalization.dto.BuyerProfileResponse;
import com.eproject.petsale.personalization.entity.BuyerProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BuyerProfileMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.name", target = "name")
    @Mapping(source = "user.email", target = "email")
    BuyerProfileResponse toResponse(BuyerProfile entity);
}