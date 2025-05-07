package com.example.cookingapp.controller;

import com.example.cookingapp.model.*;
import com.example.cookingapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import com.example.cookingapp.dto.SimpleUserDto;
import com.example.cookingapp.dto.UserProfileDto;
import java.util.stream.Collectors;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CommentArticleRepository commentArticleRepository;

    @Autowired
    private CommentCookingVideoRepository commentCookingVideoRepository;
    @Autowired
    private CommentRepository commentRepository;

    private void updateUserReferences(String oldEmail, String newEmail) {
        // Recipes
        List<Recipe> recipes = recipeRepository.findByUploadedBy(oldEmail);
        for (Recipe recipe : recipes) {
            recipe.setUploadedBy(newEmail);
        }
        recipeRepository.saveAll(recipes);

        // Articles
        List<Article> articles = articleRepository.findByUploadedBy(oldEmail);
        for (Article article : articles) {
            article.setUploadedBy(newEmail);
        }
        articleRepository.saveAll(articles);

        // Recipe Comments
        List<Comment> comments = commentRepository.findByCommenter(oldEmail);
        for (Comment comment : comments) {
            comment.setCommenter(newEmail);
        }
        commentRepository.saveAll(comments);

        // Article Comments
        List<CommentArticle> articleComments = commentArticleRepository.findByCommenter(oldEmail);
        for (CommentArticle commentArticle : articleComments) {
            commentArticle.setCommenter(newEmail);
        }
        commentArticleRepository.saveAll(articleComments);

        // Cooking Video Comments
        List<CommentCookingVideo> videoComments = commentCookingVideoRepository.findByCommenter(oldEmail);
        for (CommentCookingVideo videoComment : videoComments) {
            videoComment.setCommenter(newEmail);
        }
        commentCookingVideoRepository.saveAll(videoComments);
    }



    // Get all users (ADMIN only)
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        if (!currentUser.getRoles().contains(Role.ROLE_ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin only.");
        }


        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Get user by ID (only by the user himself)
    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // map follower entities → SimpleUserDto
        var followers = u.getFollowers().stream()
                .map(f -> new SimpleUserDto(f.getId(), f.getUsername(), f.getProfilePicUrl()))
                .collect(Collectors.toList());

        // map following entities → SimpleUserDto
        var following = u.getFollowing().stream()
                .map(f -> new SimpleUserDto(f.getId(), f.getUsername(), f.getProfilePicUrl()))
                .collect(Collectors.toList());

        var profileDto = new UserProfileDto(
                u.getId(),
                u.getUsername(),
                u.getBio(),
                u.getProfilePicUrl(),
                u.getEmail(),
                followers,
                following
        );

        return ResponseEntity.ok(profileDto);
    }




    // Update user by ID (only by the user himself)
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUserData) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOpt.get();
        user.setUsername(updatedUserData.getUsername());

        String oldEmail = user.getEmail(); // Keep old email for updating references
        String newEmail = updatedUserData.getEmail();
        user.setEmail(newEmail);

        if (updatedUserData.getPassword() != null && !updatedUserData.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUserData.getPassword()));
        }
        if (updatedUserData.getBio() != null) {
            user.setBio(updatedUserData.getBio());
        }
        if (updatedUserData.getProfilePicUrl() != null) {
            user.setProfilePicUrl(updatedUserData.getProfilePicUrl());
        }

        userRepository.save(user);

        // Call method to update user details across related entities
        updateUserReferences(oldEmail, newEmail);

        return ResponseEntity.ok("User updated successfully.");
    }


    // Delete user by ID (only by the user himself)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    @Transactional(readOnly = true)
    @GetMapping("/by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        // findByEmail already exists on UserRepository
        Optional<User> uOpt = userRepository.findByEmail(email);
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User u = uOpt.get();
        u.setPassword(null);              // never leak the password
        // you may also null out sensitive collections if you like
        return ResponseEntity.ok(u);
    }



}
