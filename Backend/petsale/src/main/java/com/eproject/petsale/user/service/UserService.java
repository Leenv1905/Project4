package com.eproject.petsale.user.service;

import com.eproject.petsale.common.mapper.UserMapper;
import com.eproject.petsale.user.dto.UpdateProfileRequest;
import com.eproject.petsale.user.dto.UserProfileResponse;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Value("${app.avatar.base-url}")
    private String baseUrl;

    public UserProfileResponse getMyProfile(){

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        UserProfileResponse res =
                userMapper.toProfileResponse(user);

        if(user.getAvatarPath() != null){
            res.setAvatarUrl(baseUrl + user.getAvatarPath());
        }

        return res;
    }

    public UserProfileResponse updateMyProfile(UpdateProfileRequest request){

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        userMapper.updateProfile(request, user);

        userRepository.save(user);

        UserProfileResponse res =
                userMapper.toProfileResponse(user);

        if(user.getAvatarPath() != null){
            res.setAvatarUrl(baseUrl + user.getAvatarPath());
        }

        return res;
    }
}