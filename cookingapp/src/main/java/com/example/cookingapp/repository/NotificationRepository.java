package com.example.cookingapp.repository;

import com.example.cookingapp.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByTargetUserEmailOrderByCreatedAtDesc(String targetUserEmail);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.targetUserEmail = :email AND n.isRead = false")
    int markAllAsRead(@Param("email") String email);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id AND n.targetUserEmail = :email")
    int markOneAsRead(@Param("id") Long id, @Param("email") String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.targetUserEmail = :email")
    int deleteAllForUser(@Param("email") String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.id = :id AND n.targetUserEmail = :email")
    int deleteOneForUser(@Param("id") Long id, @Param("email") String email);
}
