// src/main/java/com/example/cookingapp/dto/RecipeDto.java
package com.example.cookingapp.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class RecipeDto {
    private Long id;
    private String topic;
    private String description;
    private UserSummaryDto uploader;
    private String photoUrl;
    private String videoUrl;
    private Set<String> likedBy;
    private List<CommentDto> comments;
    private LocalDateTime createdAt;

    public RecipeDto(Long id,
                     String topic,
                     String description,
                     UserSummaryDto uploader,
                     String photoUrl,
                     String videoUrl,
                     Set<String> likedBy,
                     List<CommentDto> comments,
                     LocalDateTime createdAt) {
        this.id = id;
        this.topic = topic;
        this.description = description;
        this.uploader = uploader;
        this.photoUrl = photoUrl;
        this.videoUrl = videoUrl;
        this.likedBy = likedBy;
        this.comments = comments;
        this.createdAt = createdAt;
    }

    // getters...
    public Long getId() { return id; }
    public String getTopic() { return topic; }
    public String getDescription() { return description; }
    public UserSummaryDto getUploader() { return uploader; }
    public String getPhotoUrl() { return photoUrl; }
    public String getVideoUrl() { return videoUrl; }
    public Set<String> getLikedBy() { return likedBy; }
    public List<CommentDto> getComments() { return comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
