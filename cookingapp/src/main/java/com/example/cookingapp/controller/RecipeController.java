package com.example.cookingapp.controller;

import com.example.cookingapp.model.Comment;
import com.example.cookingapp.model.NotificationType;
import com.example.cookingapp.model.Recipe;
import com.example.cookingapp.repository.RecipeRepository;
import com.example.cookingapp.service.FirebaseStorageService;
import com.example.cookingapp.model.User;
import com.example.cookingapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private FirebaseStorageService firebaseStorageService;

    // Create a new recipe with optional photo/video uploads
    @PostMapping
    public ResponseEntity<?> createRecipe(
            @RequestParam("topic") String topic,
            @RequestParam("description") String description,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "video", required = false) MultipartFile video) {
        // Retrieve the currently authenticated user.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // We expect the principal to be our User object.
        User currentUser = (User) auth.getPrincipal();

        Recipe recipe = new Recipe();
        recipe.setTopic(topic);
        recipe.setDescription(description);
        recipe.setUploadedBy(currentUser.getEmail());
        try {
            if (photo != null && !photo.isEmpty()) {
                String photoUrl = firebaseStorageService.uploadFile(photo.getBytes(), "photos/" + photo.getOriginalFilename(), photo.getContentType());
                recipe.setPhotoUrl(photoUrl);
            }
            if (video != null && !video.isEmpty()) {
                String videoUrl = firebaseStorageService.uploadFile(video.getBytes(), "videos/" + video.getOriginalFilename(), video.getContentType());
                recipe.setVideoUrl(videoUrl);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading files");
        }

        recipeRepository.save(recipe);
        return ResponseEntity.ok(recipe);
    }

    // Get all recipes (public endpoint)
    @GetMapping
    public ResponseEntity<?> getAllRecipes() {
        return ResponseEntity.ok(recipeRepository.findAll());
    }

    // Get a recipe by its ID (public endpoint)
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        return recipeRepository.findById(id)
                .<ResponseEntity<?>>map(recipe -> ResponseEntity.ok(recipe))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found"));
    }



    // Update a recipe (only the uploader can update it)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateRecipe(
            @PathVariable Long id,
            @RequestParam("topic") String topic,
            @RequestParam("description") String description,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "video", required = false) MultipartFile video) {

        // Retrieve the currently authenticated user.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        // Find the recipe.
        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
        if (!optionalRecipe.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found");
        }
        Recipe recipe = optionalRecipe.get();

        // Check if the current user is the owner of the recipe.
        if (!recipe.getUploadedBy().equals(currentUser.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to edit this recipe");
        }

        // Update the text fields.
        recipe.setTopic(topic);
        recipe.setDescription(description);

        // If a new photo is provided, update photo and clear video.
        if (photo != null && !photo.isEmpty()) {
            try {
                String photoUrl = firebaseStorageService.uploadFile(
                        photo.getBytes(),
                        "photos/" + photo.getOriginalFilename(),
                        photo.getContentType()
                );
                recipe.setPhotoUrl(photoUrl);
                // Clear videoUrl since we're updating to a photo-only post.
                recipe.setVideoUrl(null);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading photo");
            }
        }
        // If a new video is provided, update video and clear photo.
        else if (video != null && !video.isEmpty()) {
            try {
                String videoUrl = firebaseStorageService.uploadFile(
                        video.getBytes(),
                        "videos/" + video.getOriginalFilename(),
                        video.getContentType()
                );
                recipe.setVideoUrl(videoUrl);
                // Clear photoUrl since we're updating to a video-only post.
                recipe.setPhotoUrl(null);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading video");
            }
        }

        // Save the updated recipe.
        recipeRepository.save(recipe);
        return ResponseEntity.ok(recipe);
    }

    @GetMapping("/mine")
    public ResponseEntity<?> getMyRecipes() {
        // Retrieve the current authenticated user from the security context.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        // Use the repository method to find recipes uploaded by the current user.
        List<Recipe> myRecipes = recipeRepository.findByUploadedBy(currentUser.getEmail());

        return ResponseEntity.ok(myRecipes);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        String userEmail = currentUser.getEmail();

        boolean added = false;
        if (recipe.getLikedBy().contains(userEmail)) {
            recipe.getLikedBy().remove(userEmail);
        } else {
            recipe.getLikedBy().add(userEmail);
            added = true;
        }

        recipeRepository.save(recipe);

        // Notify recipe owner on new like
        if (added && !recipe.getUploadedBy().equals(currentUser.getEmail())) {
            notificationService.createNotification(
                    NotificationType.LIKE,
                    recipe.getUploadedBy(),
                    currentUser.getEmail(),
                    currentUser.getUsername() + " liked your recipe.",
                    recipe.getId(),
                    "RECIPE"
            );
        }

        return ResponseEntity.ok(recipe);
    }




    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id,
                                        @RequestParam("commentText") String commentText) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found");
        }

        Comment comment = new Comment();
        comment.setCommentText(commentText);
        comment.setCommenter(currentUser.getEmail());
        comment.setRecipe(recipe);

        recipe.getComments().add(comment);
        recipeRepository.save(recipe);

        // Notify recipe owner if comment is from another user
        if (!recipe.getUploadedBy().equals(currentUser.getEmail())) {
            notificationService.createNotification(
                    NotificationType.COMMENT,
                    recipe.getUploadedBy(),
                    currentUser.getEmail(),
                    currentUser.getUsername() + " commented on your recipe.",
                    recipe.getId(),
                    "RECIPE"
            );
        }

        return ResponseEntity.ok(recipe);
    }



    // Delete a recipe (only the uploader can delete it)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        return recipeRepository.findById(id).map(recipe -> {
            if (!recipe.getUploadedBy().equals(currentUser.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to delete this recipe");
            }
            recipeRepository.delete(recipe);
            return ResponseEntity.ok("Recipe deleted successfully");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found"));
    }
}
