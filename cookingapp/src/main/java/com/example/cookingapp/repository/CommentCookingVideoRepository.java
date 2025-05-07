package com.example.cookingapp.repository;

import com.example.cookingapp.model.CommentCookingVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentCookingVideoRepository extends JpaRepository<CommentCookingVideo, Long> {
    List<CommentCookingVideo> findByCommenter(String commenter);
}
