package com.example.cookingapp.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    @Column(columnDefinition = "TEXT")
    private String description;

    // We use the uploader's email as identifier (or username, as per your implementation)
    private String uploadedBy;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> likedBy = new HashSet<>();
    private String photoUrl;

    private String videoUrl;
    private int like_count = 0;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // A recipe can have many comments; we'll use a one-to-many relationship.
    @JsonManagedReference
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and setters (generate via IDE) ...

    // For brevity, only a few getters and setters are shown; implement all as needed.
    public Long getId() {
        return id;
    }
    public String getTopic() {
        return topic;
    }
    public Set<String> getLikedBy() {
        return likedBy;
    }
    public void setLikedBy(Set<String> likedBy) {
        this.likedBy = likedBy;
    }
    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getUploadedBy() {
        return uploadedBy;
    }
    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    public int getLikeCount() {
        return likedBy != null ? likedBy.size() : 0;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    public String getVideoUrl() {
        return videoUrl;
    }
    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
    // near your other getters

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

}
