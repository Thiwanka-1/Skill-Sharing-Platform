// src/dto/RecipeResponse.java
package com.example.cookingapp.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class RecipeResponse {
    public Long id;
    public String topic;
    public String description;
    public String photoUrl;
    public String videoUrl;
    public int likeCount;
    public Set<String> likedBy;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    // — new uploader fields —
    public Long uploaderId;
    public String uploaderUsername;
    public String uploaderProfilePicUrl;
    public List<CommentResponse> comments;
}
