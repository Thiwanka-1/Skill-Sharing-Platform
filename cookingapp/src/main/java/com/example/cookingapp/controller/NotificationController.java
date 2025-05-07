package com.example.cookingapp.controller;

import com.example.cookingapp.model.Notification;
import com.example.cookingapp.model.User;
import com.example.cookingapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {
        String email = ((User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getEmail();
        List<Notification> list =
                notificationRepository.findByTargetUserEmailOrderByCreatedAtDesc(email);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/mark-all-read")
    @Transactional
    public ResponseEntity<?> markAllRead() {
        String email = ((User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getEmail();
        notificationRepository.markAllAsRead(email);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/mark-read")
    @Transactional
    public ResponseEntity<?> markOneRead(@PathVariable Long id) {
        String email = ((User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getEmail();
        int updated = notificationRepository.markOneAsRead(id, email);
        if (updated == 1) return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/clear")
    @Transactional
    public ResponseEntity<?> clearAll() {
        String email = ((User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getEmail();
        notificationRepository.deleteAllForUser(email);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteOne(@PathVariable Long id) {
        String email = ((User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getEmail();
        int deleted = notificationRepository.deleteOneForUser(id, email);
        if (deleted == 1) return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }
}
