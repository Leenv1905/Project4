package com.eproject.petsale.admin.service;

import com.eproject.petsale.admin.dto.AdminCreateUserRequest;
import com.eproject.petsale.admin.dto.AdminUpdateUserRequest;
import com.eproject.petsale.admin.dto.AdminUserResponse;
import com.eproject.petsale.user.entity.Role;
import com.eproject.petsale.user.entity.User;
import com.eproject.petsale.user.repository.RoleRepository;
import com.eproject.petsale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<AdminUserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    public AdminUserResponse getUserById(Long id) {
        return mapToResponse(getUserEntity(id));
    }

    @Transactional
    public AdminUserResponse createUser(AdminCreateUserRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setAvatarPath(request.getAvatarUrl());
        user.setEnabled(true);
        user.setRoles(Set.of(resolveRole(request.getRole())));

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse updateUser(Long id, AdminUpdateUserRequest request) {
        User user = getUserEntity(id);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String email = request.getEmail().trim();
            if (!email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Email already exists");
            }
            user.setEmail(email);
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarPath(request.getAvatarUrl());
        }
        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRoles(Set.of(resolveRole(request.getRole())));
        }

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserEntity(id);
        userRepository.delete(user);
    }

    @Transactional
    public void updateUserStatus(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    private User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Role resolveRole(String roleName) {
        // Chuẩn hóa tên Role (mặc định là ROLE_USER nếu rỗng)
        String normalizedRole = (roleName == null || roleName.isBlank())
                ? "ROLE_USER"
                : roleName.trim().toUpperCase(Locale.ROOT);

        // Xử lý Optional từ repository
        return roleRepository.findByName(normalizedRole)
                .orElseGet(() -> {
                    // Nếu không tìm thấy trong DB, tiến hành tạo mới
                    Role newRole = new Role();
                    newRole.setName(normalizedRole);
                    return roleRepository.save(newRole);
                });
    }

    private AdminUserResponse mapToResponse(User user) {
        AdminUserResponse response = new AdminUserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setAvatarUrl(user.getAvatarPath());
        response.setEnabled(user.getEnabled() != null ? user.getEnabled() : true);
        response.setRole(user.getRoles().stream()
                .findFirst()
                .map(Role::getName)
                .map(role -> role.toLowerCase(Locale.ROOT))
                .orElse("user"));
        return response;
    }
}
