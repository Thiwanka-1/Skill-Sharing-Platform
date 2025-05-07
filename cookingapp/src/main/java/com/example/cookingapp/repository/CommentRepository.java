package com.example.cookingapp.repository;

import com.example.cookingapp.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCommenter(String commenter);
}
