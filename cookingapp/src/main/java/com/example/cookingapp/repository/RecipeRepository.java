package com.example.cookingapp.repository;

import com.example.cookingapp.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByUploadedBy(String uploadedBy);

}
