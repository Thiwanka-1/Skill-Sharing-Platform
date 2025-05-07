// src/main/java/com/example/cookingapp/dto/VideoDto.java
package com.example.cookingapp.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class VideoDto {
    private Long id;
    private String title;
    private String description;
    private UserSummaryDto uploader;
    private String videoUrl;
    private Set<String> likedBy;
    private List<CommentDto> comments;
    private LocalDateTime createdAt;

    public VideoDto(Long id, String title, String description,
                    UserSummaryDto uploader, String videoUrl,
                    Set<String> likedBy, List<CommentDto> comments,
                    LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.uploader = uploader;
        this.videoUrl = videoUrl;
        this.likedBy = likedBy;
        this.comments = comments;
        this.createdAt = createdAt;
    }
    // getters...
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public UserSummaryDto getUploader() { return uploader; }
    public String getVideoUrl() { return videoUrl; }
    public Set<String> getLikedBy() { return likedBy; }
    public List<CommentDto> getComments() { return comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
