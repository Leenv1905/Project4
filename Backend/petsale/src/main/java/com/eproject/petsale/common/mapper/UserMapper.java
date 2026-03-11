package com.eproject.petsale.common.mapper;

import com.eproject.petsale.user.dto.UpdateProfileRequest;
import com.eproject.petsale.user.dto.UserProfileResponse;
import com.eproject.petsale.user.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserProfileResponse toProfileResponse(User user);

    @BeanMapping(nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
    void updateProfile(UpdateProfileRequest request,
                       @MappingTarget User user);
}