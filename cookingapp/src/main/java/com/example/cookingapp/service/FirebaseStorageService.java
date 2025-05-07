package com.example.cookingapp.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.Acl.Role;
import com.google.cloud.storage.Acl.User;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Service
public class FirebaseStorageService {

    @PostConstruct
    public void initialize() {
        try {
            // Load the JSON credentials file from the classpath
            InputStream serviceAccount = new ClassPathResource("educode-3f32e-firebase-adminsdk-rddo7-d845388264.json").getInputStream();
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("educode-3f32e.appspot.com")
                    .build();
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String uploadFile(byte[] fileBytes, String fileName, String contentType) {
        var bucket = StorageClient.getInstance().bucket();
        Blob blob = bucket.create(fileName, fileBytes, contentType);
        // Make the file publicly accessible
        blob.createAcl(Acl.of(User.ofAllUsers(), Role.READER));
        // Return public URL for the uploaded file
        return String.format("https://storage.googleapis.com/%s/%s", bucket.getName(), blob.getName());
    }
}
