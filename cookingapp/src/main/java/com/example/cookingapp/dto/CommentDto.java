// src/main/java/com/example/cookingapp/dto/CommentDto.java
package com.example.cookingapp.dto;

import java.time.LocalDateTime;

public class CommentDto {
    private Long id;
    private String text;
    private String commenterUsername;
    private String commenterAvatar;  // URL
    private LocalDateTime commentedAt;

    public CommentDto(Long id, String text, String commenterUsername, String commenterAvatar, LocalDateTime commentedAt) {
        this.id = id;
        this.text = text;
        this.commenterUsername = commenterUsername;
        this.commenterAvatar = commenterAvatar;
        this.commentedAt = commentedAt;
    }
    public Long getId() { return id; }
    public String getText() { return text; }
    public String getCommenterUsername() { return commenterUsername; }
    public String getCommenterAvatar() { return commenterAvatar; }
    public LocalDateTime getCommentedAt() { return commentedAt; }
}
