// src/dto/CommentResponse.java
package com.example.cookingapp.dto;

import java.time.LocalDateTime;

public class CommentResponse {
    public Long id;
    public String commentText;
    public Long commenterId;
    public String commenterUsername;
    public String commenterProfilePicUrl;
    public LocalDateTime commentedAt;
}
