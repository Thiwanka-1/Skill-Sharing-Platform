// src/main/java/com/example/cookingapp/dto/CommentCookingVideoDto.java
package com.example.cookingapp.dto;

import java.time.LocalDateTime;

public class CommentCookingVideoDto {
    private Long id;
    private String text;
    private String commenterUsername;
    private String commenterAvatar;
    private LocalDateTime commentedAt;

    public CommentCookingVideoDto(Long id, String text,
                                  String commenterUsername,
                                  String commenterAvatar,
                                  LocalDateTime commentedAt) {
        this.id = id;
        this.text = text;
        this.commenterUsername = commenterUsername;
        this.commenterAvatar = commenterAvatar;
        this.commentedAt = commentedAt;
    }
    // getters...
    public Long getId() { return id; }
    public String getText() { return text; }
    public String getCommenterUsername() { return commenterUsername; }
    public String getCommenterAvatar() { return commenterAvatar; }
    public LocalDateTime getCommentedAt() { return commentedAt; }
}
