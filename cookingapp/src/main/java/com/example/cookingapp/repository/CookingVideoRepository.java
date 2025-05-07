package com.example.cookingapp.repository;

import com.example.cookingapp.model.CookingVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CookingVideoRepository extends JpaRepository<CookingVideo, Long> {
    List<CookingVideo> findByUploadedBy(String uploadedBy);
}
