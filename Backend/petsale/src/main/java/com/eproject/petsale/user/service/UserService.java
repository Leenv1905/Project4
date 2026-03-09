package com.eproject.petsale.user.service;

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

    @Value("${app.avatar.base-url}")
    private String baseUrl;

    public UserProfileResponse getMyProfile(){

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        UserProfileResponse res = new UserProfileResponse();

        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setPhone(user.getPhone());
        res.setAddress(user.getAddress());

        if(user.getAvatarPath() != null){
            res.setAvatarUrl(baseUrl + user.getAvatarPath());
        }

        return res;
    }

    public UserProfileResponse updateMyProfile(UpdateProfileRequest request){

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        if(request.getName() != null){
            user.setName(request.getName());
        }

        if(request.getPhone() != null){
            user.setPhone(request.getPhone());
        }

        if(request.getAddress() != null){
            user.setAddress(request.getAddress());
        }

        userRepository.save(user);

        UserProfileResponse res = new UserProfileResponse();

        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setPhone(user.getPhone());
        res.setAddress(user.getAddress());

        if(user.getAvatarPath() != null){
            res.setAvatarUrl(baseUrl + user.getAvatarPath());
        }

        return res;
    }}

