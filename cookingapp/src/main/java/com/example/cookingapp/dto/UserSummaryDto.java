// src/main/java/com/example/cookingapp/dto/UserSummaryDto.java
package com.example.cookingapp.dto;

public class UserSummaryDto {
    private Long id;
    private String username;
    private String profilePicUrl;

    public UserSummaryDto(Long id, String username, String profilePicUrl) {
        this.id = id;
        this.username = username;
        this.profilePicUrl = profilePicUrl;
    }
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getProfilePicUrl() { return profilePicUrl; }
}
