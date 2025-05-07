package com.example.cookingapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    // The user to be notified (target)
    private String targetUserEmail;

    // The user who triggered the event (source)
    private String sourceUserEmail;

    // A descriptive message for the notification
    @Column(columnDefinition = "TEXT")
    private String message;

    // Optional: ID reference to the content (e.g., recipe, article, or video)
    private Long referenceId;

    // Optional: content type string ("RECIPE", "ARTICLE", "VIDEO")
    private String contentType;

    private LocalDateTime createdAt;

    // Indicates if the notification has been read
    private Boolean isRead = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public String getTargetUserEmail() {
        return targetUserEmail;
    }

    public void setTargetUserEmail(String targetUserEmail) {
        this.targetUserEmail = targetUserEmail;
    }

    public String getSourceUserEmail() {
        return sourceUserEmail;
    }

    public void setSourceUserEmail(String sourceUserEmail) {
        this.sourceUserEmail = sourceUserEmail;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
