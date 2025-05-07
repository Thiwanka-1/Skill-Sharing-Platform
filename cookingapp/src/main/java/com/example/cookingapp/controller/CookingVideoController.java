package com.example.cookingapp.controller;

import com.example.cookingapp.model.*;
import com.example.cookingapp.repository.CookingVideoRepository;
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
@RequestMapping("/api/videos")
public class CookingVideoController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CookingVideoRepository cookingVideoRepository;

    @Autowired
    private FirebaseStorageService firebaseStorageService;

    @PostMapping
    public ResponseEntity<?> createVideo(@RequestParam String title,
                                         @RequestParam String description,
                                         @RequestParam("video") MultipartFile video) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        CookingVideo cookingVideo = new CookingVideo();
        cookingVideo.setTitle(title);
        cookingVideo.setDescription(description);
        cookingVideo.setUploadedBy(currentUser.getEmail());

        if (video != null && !video.isEmpty()) {
            String videoUrl = firebaseStorageService.uploadFile(video.getBytes(), "videos/" + video.getOriginalFilename(), video.getContentType());
            cookingVideo.setVideoUrl(videoUrl);
        }

        cookingVideoRepository.save(cookingVideo);
        return ResponseEntity.ok(cookingVideo);
    }

    @GetMapping
    public ResponseEntity<?> getAllVideos() {
        return ResponseEntity.ok(cookingVideoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVideo(@PathVariable Long id) {
        Optional<CookingVideo> videoOpt = cookingVideoRepository.findById(id);
        if (videoOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found");
        return ResponseEntity.ok(videoOpt.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVideo(@PathVariable Long id,
                                         @RequestParam String title,
                                         @RequestParam String description,
                                         @RequestParam(value = "video", required = false) MultipartFile video) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<CookingVideo> videoOpt = cookingVideoRepository.findById(id);
        if (videoOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found");

        CookingVideo cookingVideo = videoOpt.get();

        if (!cookingVideo.getUploadedBy().equals(currentUser.getEmail()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");

        cookingVideo.setTitle(title);
        cookingVideo.setDescription(description);

        if (video != null && !video.isEmpty()) {
            String videoUrl = firebaseStorageService.uploadFile(video.getBytes(), "videos/" + video.getOriginalFilename(), video.getContentType());
            cookingVideo.setVideoUrl(videoUrl);
        }

        cookingVideoRepository.save(cookingVideo);
        return ResponseEntity.ok(cookingVideo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        Optional<CookingVideo> videoOpt = cookingVideoRepository.findById(id);
        if (videoOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found");

        CookingVideo cookingVideo = videoOpt.get();

        if (!cookingVideo.getUploadedBy().equals(currentUser.getEmail()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");

        cookingVideoRepository.delete(cookingVideo);
        return ResponseEntity.ok("Video deleted successfully");
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        Optional<CookingVideo> videoOpt = cookingVideoRepository.findById(id);
        if (videoOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found");

        CookingVideo video = videoOpt.get();
        String email = currentUser.getEmail();
        boolean added = false;
        if (video.getLikedBy().contains(email))
            video.getLikedBy().remove(email);
        else {
            video.getLikedBy().add(email);
            added = true;
        }
        cookingVideoRepository.save(video);

        // Notify video owner when a like is added
        if (added && !video.getUploadedBy().equals(currentUser.getEmail())) {
            notificationService.createNotification(
                    NotificationType.LIKE,
                    video.getUploadedBy(),
                    currentUser.getEmail(),
                    currentUser.getUsername() + " liked your video.",
                    video.getId(),
                    "VIDEO"
            );
        }
        return ResponseEntity.ok(video);
    }


    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id,
                                        @RequestParam("commentText") String commentText) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        Optional<CookingVideo> videoOpt = cookingVideoRepository.findById(id);
        if (videoOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found");

        CookingVideo video = videoOpt.get();
        CommentCookingVideo comment = new CommentCookingVideo();
        comment.setCommentText(commentText);
        comment.setCommenter(currentUser.getEmail());
        comment.setCookingVideo(video);

        video.getComments().add(comment);
        cookingVideoRepository.save(video);

        // Notify video owner if commenter is not the owner
        if (!video.getUploadedBy().equals(currentUser.getEmail())) {
            notificationService.createNotification(
                    NotificationType.COMMENT,
                    video.getUploadedBy(),
                    currentUser.getEmail(),
                    currentUser.getUsername() + " commented on your video.",
                    video.getId(),
                    "VIDEO"
            );
        }
        return ResponseEntity.ok(video);
    }


    @GetMapping("/mine")
    public ResponseEntity<?> getMyVideos() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        List<CookingVideo> myVideos = cookingVideoRepository.findByUploadedBy(currentUser.getEmail());
        return ResponseEntity.ok(myVideos);
    }
}
