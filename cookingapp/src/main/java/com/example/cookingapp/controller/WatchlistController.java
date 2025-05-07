package com.example.cookingapp.controller;

import com.example.cookingapp.model.Recipe;
import com.example.cookingapp.model.User;
import com.example.cookingapp.repository.RecipeRepository;
import com.example.cookingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    // Add a recipe to the watchlist
    @PostMapping("/add/{recipeId}")
    public ResponseEntity<?> addToWatchlist(@PathVariable Long recipeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());
        Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);

        if (userOpt.isEmpty() || recipeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Recipe not found.");
        }

        User user = userOpt.get();
        user.getWatchlist().add(recipeOpt.get());
        userRepository.save(user);

        return ResponseEntity.ok("Recipe added to watchlist.");
    }

    // Remove a recipe from the watchlist
    @PostMapping("/remove/{recipeId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long recipeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());
        Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);

        if (userOpt.isEmpty() || recipeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Recipe not found.");
        }

        User user = userOpt.get();
        user.getWatchlist().remove(recipeOpt.get());
        userRepository.save(user);

        return ResponseEntity.ok("Recipe removed from watchlist.");
    }

    // Get all recipes in the user's watchlist
    @GetMapping
    public ResponseEntity<Set<Recipe>> getWatchlist() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<User> userOpt = userRepository.findByEmail(currentUser.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(userOpt.get().getWatchlist());
    }
}
