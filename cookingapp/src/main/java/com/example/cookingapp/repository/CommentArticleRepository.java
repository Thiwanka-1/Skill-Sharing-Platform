package com.example.cookingapp.repository;

import com.example.cookingapp.model.CommentArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentArticleRepository extends JpaRepository<CommentArticle, Long> {
    List<CommentArticle> findByCommenter(String commenter);
}
