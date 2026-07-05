package com.shotlink.model.dto.request;

import com.shotlink.model.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 64, message = "密码长度8-64位")
    private String password;

    @NotBlank(message = "用户名不能为空")
    @Size(min = 1, max = 100, message = "用户名长度1-100位")
    private String displayName;

    @NotNull(message = "角色不能为空")
    private UserRole role;

    // Optional: photographer-specific fields
    private String phone;
    private String city;
    private String province;
}
