// src/main/java/com/example/cookingapp/dto/CommentCookingVideoResponse.java
package com.example.cookingapp.dto;

import java.time.LocalDateTime;

public class CommentCookingVideoResponse {
    public Long id;
    public String commentText;
    public LocalDateTime commentedAt;
    public Long commenterId;
    public String commenterUsername;
    public String commenterProfilePicUrl;
}
