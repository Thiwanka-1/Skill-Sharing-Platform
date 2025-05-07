package com.example.cookingapp.controller;

import com.example.cookingapp.model.CookingVideo;
import com.example.cookingapp.model.User;
import com.example.cookingapp.repository.CookingVideoRepository;
import com.example.cookingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/video-watchlist")
public class CookingVideoWatchlistController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CookingVideoRepository cookingVideoRepository;

    // ✅ Add video to watchlist
    @PostMapping("/add/{videoId}")
    public ResponseEntity<?> addToWatchlist(@PathVariable Long videoId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());
        Optional<CookingVideo> videoOpt = cookingVideoRepository.findById(videoId);

        if (userOpt.isEmpty() || videoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Video not found.");
        }

        User user = userOpt.get();
        user.getCookingWatchlist().add(videoOpt.get());
        userRepository.save(user);

        return ResponseEntity.ok("Video added to watchlist.");
    }

    // ✅ Remove video from watchlist
    @PostMapping("/remove/{videoId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long videoId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());
        Optional<CookingVideo> videoOpt = cookingVideoRepository.findById(videoId);

        if (userOpt.isEmpty() || videoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Video not found.");
        }

        User user = userOpt.get();
        user.getCookingWatchlist().remove(videoOpt.get());
        userRepository.save(user);

        return ResponseEntity.ok("Video removed from watchlist.");
    }

    // ✅ Get current user's cooking video watchlist
    @GetMapping
    public ResponseEntity<?> getMyWatchlist() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        Set<CookingVideo> watchlist = userOpt.get().getCookingWatchlist();
        return ResponseEntity.ok(watchlist);
    }
}
