package com.example.cookingapp.dto;

import java.util.List;

public record UserProfileDto(
        Long id,
        String username,
        String bio,
        String profilePicUrl,
        String email,
        List<SimpleUserDto> followers,
        List<SimpleUserDto> following
) {}
