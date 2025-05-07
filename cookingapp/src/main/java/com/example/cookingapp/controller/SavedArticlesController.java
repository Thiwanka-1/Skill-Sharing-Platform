package com.example.cookingapp.controller;

import com.example.cookingapp.model.Article;
import com.example.cookingapp.model.User;
import com.example.cookingapp.repository.ArticleRepository;
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
@RequestMapping("/api/saved-articles")
public class SavedArticlesController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleRepository articleRepository;

    // Add Article to user's saved list
    @PostMapping("/add/{articleId}")
    public ResponseEntity<?> saveArticle(@PathVariable Long articleId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());
        Optional<Article> articleOpt = articleRepository.findById(articleId);

        if (userOpt.isEmpty() || articleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Article not found.");
        }

        User user = userOpt.get();
        user.getSavedArticles().add(articleOpt.get());
        userRepository.save(user);

        return ResponseEntity.ok("Article saved successfully.");
    }

    // Remove Article from user's saved list
    @PostMapping("/remove/{articleId}")
    public ResponseEntity<?> removeSavedArticle(@PathVariable Long articleId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());
        Optional<Article> articleOpt = articleRepository.findById(articleId);

        if (userOpt.isEmpty() || articleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Article not found.");
        }

        User user = userOpt.get();
        user.getSavedArticles().remove(articleOpt.get());
        userRepository.save(user);

        return ResponseEntity.ok("Article removed from saved list successfully.");
    }

    // Get current user's saved Articles
    @GetMapping
    public ResponseEntity<?> getMySavedArticles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        Set<Article> savedArticles = userOpt.get().getSavedArticles();
        return ResponseEntity.ok(savedArticles);
    }
}
