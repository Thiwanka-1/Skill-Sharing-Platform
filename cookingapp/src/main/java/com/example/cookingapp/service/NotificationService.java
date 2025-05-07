package com.example.cookingapp.service;

import com.example.cookingapp.model.Notification;
import com.example.cookingapp.model.NotificationType;
import com.example.cookingapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Creates and saves a notification.
     *
     * @param type             the type of the notification (FOLLOW, LIKE, COMMENT, etc.)
     * @param targetUserEmail  the email of the user who should receive the notification
     * @param sourceUserEmail  the email of the user who triggered the event
     * @param message          the message to display
     * @param referenceId      an optional reference to the content (ID)
     * @param contentType      an optional description of the content type ("RECIPE", "ARTICLE", "VIDEO")
     */
    public void createNotification(NotificationType type, String targetUserEmail, String sourceUserEmail,
                                   String message, Long referenceId, String contentType) {
        Notification notification = new Notification();
        notification.setNotificationType(type);
        notification.setTargetUserEmail(targetUserEmail);
        notification.setSourceUserEmail(sourceUserEmail);
        notification.setMessage(message);
        notification.setReferenceId(referenceId);
        notification.setContentType(contentType);
        notificationRepository.save(notification);
    }
}
