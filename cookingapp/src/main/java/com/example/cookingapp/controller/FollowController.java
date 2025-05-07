package com.example.cookingapp.controller;

import com.example.cookingapp.model.NotificationType;
import com.example.cookingapp.model.User;
import com.example.cookingapp.repository.UserRepository;
import com.example.cookingapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class FollowController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // Follow a user by ID
    @Transactional
    @PostMapping("/follow/{id}")
    public ResponseEntity<?> followUser(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long meId = ((User)auth.getPrincipal()).getId();

        // 1) reload both as managed entities
        User current = userRepository.findById(meId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found"));
        User target = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (current.getId().equals(target.getId())) {
            return ResponseEntity.badRequest().body("You cannot follow yourself");
        }
        if (current.getFollowing().contains(target)) {
            return ResponseEntity.badRequest().body("Already following");
        }

        // 2) modify collections
        current.getFollowing().add(target);
        target.getFollowers().add(current);

        // 3) save (optional—transaction will flush)
        userRepository.save(current);
        userRepository.save(target);

        // 4) notification
        notificationService.createNotification(
                NotificationType.FOLLOW,
                target.getEmail(),
                current.getEmail(),
                current.getUsername() + " started following you.",
                null,
                null
        );

        return ResponseEntity.ok("User followed successfully");
    }

    @Transactional
    @PostMapping("/unfollow/{id}")
    public ResponseEntity<?> unfollowUser(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long meId = ((User)auth.getPrincipal()).getId();

        User current = userRepository.findById(meId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found"));
        User target = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!current.getFollowing().contains(target)) {
            return ResponseEntity.badRequest().body("Not following");
        }

        current.getFollowing().remove(target);
        target.getFollowers().remove(current);
        userRepository.save(current);
        userRepository.save(target);

        notificationService.createNotification(
                NotificationType.UNFOLLOW,
                target.getEmail(),
                current.getEmail(),
                current.getUsername() + " unfollowed you.",
                null,
                null
        );

        return ResponseEntity.ok("User unfollowed successfully");
    }


    // Get list of users the given user is following
    @GetMapping("/{id}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(userOpt.get().getFollowing());
    }

    // Get list of followers for a given user
    @GetMapping("/{id}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(userOpt.get().getFollowers());
    }
}
