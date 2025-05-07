package com.example.cookingapp.repository;

import com.example.cookingapp.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByUploadedBy(String uploadedBy);
}
