package com.example.cookingapp.security;

import com.example.cookingapp.model.Role;
import com.example.cookingapp.model.User;
import com.example.cookingapp.repository.UserRepository;
import com.example.cookingapp.security.JwtUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collections;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.frontend.url}")
    private String frontendUrl;   // e.g. http://localhost:5173

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public OAuth2AuthenticationSuccessHandler(JwtUtils jwtUtils, UserRepository userRepository) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req,
                                        HttpServletResponse resp,
                                        Authentication authentication)
            throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name  = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        // 1. Find-or-create local User
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setUsername(name);
            u.setRoles(Collections.singleton(Role.ROLE_USER));
            u.setProfilePicUrl(picture);
            return userRepository.save(u);
        });

        // 2. Generate JWT
        String token = jwtUtils.generateJwtToken(user.getEmail());

        // 3. Build redirect to React, passing token
        String targetUrl = UriComponentsBuilder
                .fromUriString(frontendUrl + "/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(req, resp, targetUrl);
    }
}
