package com.example.cookingapp.controller;

import com.example.cookingapp.model.*;
import com.example.cookingapp.repository.ArticleRepository;
import com.example.cookingapp.service.FirebaseStorageService;
import com.example.cookingapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private FirebaseStorageService firebaseStorageService;

    @PostMapping
    public ResponseEntity<?> createArticle(@RequestParam String title,
                                           @RequestParam String description,
                                           @RequestParam("photo") MultipartFile photo) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Article article = new Article();
        article.setTitle(title);
        article.setDescription(description);
        article.setUploadedBy(currentUser.getEmail());

        if (photo != null && !photo.isEmpty()) {
            String photoUrl = firebaseStorageService.uploadFile(photo.getBytes(), "articles/" + photo.getOriginalFilename(), photo.getContentType());
            article.setPhotoUrl(photoUrl);
        }

        articleRepository.save(article);
        return ResponseEntity.ok(article);
    }

    @GetMapping
    public ResponseEntity<?> getAllArticles() {
        return ResponseEntity.ok(articleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticle(@PathVariable Long id) {
        return articleRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Article not found"));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id,
                                        @RequestParam("commentText") String commentText) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        Optional<Article> articleOpt = articleRepository.findById(id);
        if (articleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Article not found");
        }
        Article article = articleOpt.get();

        CommentArticle comment = new CommentArticle();
        comment.setCommentText(commentText);
        comment.setCommenter(currentUser.getEmail());
        comment.setArticle(article);

        article.getComments().add(comment);
        articleRepository.save(article);

        // Notify the owner if the commenter is not the owner.
        if (!article.getUploadedBy().equals(currentUser.getEmail())) {
            notificationService.createNotification(
                    NotificationType.COMMENT,
                    article.getUploadedBy(),
                    currentUser.getEmail(),
                    currentUser.getUsername() + " commented on your article.",
                    article.getId(),
                    "ARTICLE"
            );
        }

        return ResponseEntity.ok(article);
    }

    @GetMapping("/mine")
    public ResponseEntity<?> getMyArticles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        List<Article> myArticles = articleRepository.findByUploadedBy(currentUser.getEmail());
        return ResponseEntity.ok(myArticles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id,
                                           @RequestParam String title,
                                           @RequestParam String description,
                                           @RequestParam(value = "photo", required = false) MultipartFile photo) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<Article> optArticle = articleRepository.findById(id);
        if (optArticle.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");

        Article article = optArticle.get();

        if (!article.getUploadedBy().equals(currentUser.getEmail()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");

        article.setTitle(title);
        article.setDescription(description);

        if (photo != null && !photo.isEmpty()) {
            String photoUrl = firebaseStorageService.uploadFile(photo.getBytes(), "articles/" + photo.getOriginalFilename(), photo.getContentType());
            article.setPhotoUrl(photoUrl);
        }

        articleRepository.save(article);
        return ResponseEntity.ok(article);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        return articleRepository.findById(id).map(article -> {
            if (!article.getUploadedBy().equals(currentUser.getEmail()))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");

            articleRepository.delete(article);
            return ResponseEntity.ok("Deleted successfully");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found"));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Article not found");
        }

        String email = currentUser.getEmail();
        boolean added = false;
        if (article.getLikedBy().contains(email)) {
            article.getLikedBy().remove(email);
        } else {
            article.getLikedBy().add(email);
            added = true;
        }
        articleRepository.save(article);

        // Notify article owner when a like is added by someone else
        if (added && !article.getUploadedBy().equals(currentUser.getEmail())) {
            notificationService.createNotification(
                    NotificationType.LIKE,
                    article.getUploadedBy(),
                    currentUser.getEmail(),
                    currentUser.getUsername() + " liked your article.",
                    article.getId(),
                    "ARTICLE"
            );
        }

        return ResponseEntity.ok(article);
    }

}
