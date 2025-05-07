// src/main/java/com/example/cookingapp/dto/ArticleResponse.java
package com.example.cookingapp.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class ArticleResponse {
    public Long id;
    public String title;
    public String description;
    public String photoUrl;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public Set<String> likedBy;
    // uploader info
    public Long uploaderId;
    public String uploaderUsername;
    public String uploaderProfilePicUrl;
    // comments
    public List<CommentArticleResponse> comments;
}
