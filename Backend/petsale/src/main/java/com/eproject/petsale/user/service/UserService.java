package com.eproject.petsale.user.service;

import com.eproject.petsale.common.mapper.SellerMapper;
import com.eproject.petsale.common.mapper.UserMapper;
import com.eproject.petsale.user.dto.RegisterSellerRequest;
import com.eproject.petsale.user.dto.SellerProfileResponse;
import com.eproject.petsale.user.dto.UpdateProfileRequest;
import com.eproject.petsale.user.dto.UserProfileResponse;
import com.eproject.petsale.user.entity.Role;
import com.eproject.petsale.user.entity.SellerProfile;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.RoleRepository;
import com.eproject.petsale.user.repository.SellerProfileRepository;
import com.eproject.petsale.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Value("${app.avatar.base-url}")
    private String baseUrl;

    @Autowired
    private SellerProfileRepository sellerProfileRepository;

    @Autowired
    private SellerMapper sellerMapper;
    @Autowired
    private RoleRepository roleRepository;

    public UserProfileResponse getMyProfile(){

        User user = getCurrentUser();

        UserProfileResponse res =
                userMapper.toProfileResponse(user);

        if(user.getAvatarPath() != null){
            res.setAvatarUrl(baseUrl + user.getAvatarPath());
        }

        return res;
    }

    public UserProfileResponse updateMyProfile(UpdateProfileRequest request){

        User user = getCurrentUser();

        userMapper.updateProfile(request, user);

        userRepository.save(user);

        UserProfileResponse res =
                userMapper.toProfileResponse(user);

        if(user.getAvatarPath() != null){
            res.setAvatarUrl(baseUrl + user.getAvatarPath());
        }

        return res;
    }
    public User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void updateUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enabled);
        userRepository.save(user);
    }
    @Transactional
    public SellerProfileResponse registerAsSeller(RegisterSellerRequest request) {
        // 1. Lấy email từ SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }
        String email = authentication.getName();

        // 2. Tìm User trong DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người dùng: " + email));

        // 3. Kiểm tra xem đã có SellerProfile chưa (Sử dụng ID của User theo file SQL)
        if (sellerProfileRepository.existsById(user.getId())) {
            throw new RuntimeException("Tài khoản này đã đăng ký bán hàng rồi.");
        }

        // 4. Tạo entity và thiết lập quan hệ
        SellerProfile sellerProfile = sellerMapper.toEntity(request);
        sellerProfile.setUser(user);
//        sellerProfile.setUserId(user.getId()); // Đảm bảo khớp với @MapsId

        // 5. Cấp thêm quyền SELLER (Duy trì tính song song với ROLE_BUYER)
        Role sellerRole = roleRepository.findByName("SELLER")
                .orElseThrow(() -> new RuntimeException("Hệ thống chưa cấu hình quyền ROLE_SELLER"));

        user.getRoles().add(sellerRole);

        // 6. Lưu dữ liệu
        userRepository.save(user);
        SellerProfile saved = sellerProfileRepository.save(sellerProfile);

        return sellerMapper.toResponse(saved);
    }
}