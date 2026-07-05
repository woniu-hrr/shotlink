package com.shotlink.service;

import com.shotlink.model.dto.request.LoginRequest;
import com.shotlink.model.dto.request.RegisterRequest;
import com.shotlink.model.dto.response.AuthResponse;
import com.shotlink.model.entity.PhotographerProfile;
import com.shotlink.model.entity.RefreshToken;
import com.shotlink.model.entity.User;
import com.shotlink.model.enums.UserRole;
import com.shotlink.repository.PhotographerProfileRepository;
import com.shotlink.repository.RefreshTokenRepository;
import com.shotlink.repository.UserRepository;
import com.shotlink.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PhotographerProfileRepository photographerProfileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("邮箱已被注册");
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .phone(request.getPhone())
                .city(request.getCity())
                .province(request.getProvince())
                .role(request.getRole())
                .build();
        user = userRepository.save(user);

        // If photographer, create a pending profile
        if (request.getRole() == UserRole.PHOTOGRAPHER) {
            PhotographerProfile profile = PhotographerProfile.builder()
                    .user(user)
                    .build();
            photographerProfileRepository.save(profile);
        }

        // Generate tokens
        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("邮箱或密码错误"));

        if (!user.getEnabled()) {
            throw new RuntimeException("账户已被禁用");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("邮箱或密码错误");
        }

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenStr) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("无效的刷新令牌"));

        if (storedToken.getRevoked()) {
            throw new RuntimeException("刷新令牌已被撤销");
        }

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("刷新令牌已过期");
        }

        // Revoke old token & generate new ones
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        User user = storedToken.getUser();
        return generateAuthResponse(user);
    }

    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken();

        // Store refresh token
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshTokenStr)
                .expiresAt(LocalDateTime.now().plus(jwtTokenProvider.getRefreshTokenExpiration(), ChronoUnit.MILLIS))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .userId(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .tokenType("Bearer")
                .build();
    }
}
