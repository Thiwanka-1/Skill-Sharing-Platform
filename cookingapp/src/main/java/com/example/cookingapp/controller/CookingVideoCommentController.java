package com.example.cookingapp.controller;

import com.example.cookingapp.model.CommentCookingVideo;
import com.example.cookingapp.model.User;
import com.example.cookingapp.repository.CommentCookingVideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/video-comments")
public class CookingVideoCommentController {

    @Autowired
    private CommentCookingVideoRepository commentCookingVideoRepository;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestParam String commentText) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<CommentCookingVideo> commentOpt = commentCookingVideoRepository.findById(id);
        if (commentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
        }

        CommentCookingVideo comment = commentOpt.get();
        if (!comment.getCommenter().equals(currentUser.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own comments");
        }

        comment.setCommentText(commentText);
        commentCookingVideoRepository.save(comment);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<CommentCookingVideo> commentOpt = commentCookingVideoRepository.findById(id);
        if (commentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
        }

        CommentCookingVideo comment = commentOpt.get();
        if (!comment.getCommenter().equals(currentUser.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own comments");
        }

        commentCookingVideoRepository.delete(comment);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}
