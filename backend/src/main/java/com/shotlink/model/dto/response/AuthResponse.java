package com.shotlink.model.dto.response;

import com.shotlink.model.enums.UserRole;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private Long userId;
    private String email;
    private String displayName;
    private UserRole role;
    private String tokenType;
}
