// src/main/java/com/example/cookingapp/payload/JwtResponse.java
package com.example.cookingapp.payload;

import com.example.cookingapp.model.Role;
import java.util.Set;

public class JwtResponse {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String profilePicUrl;
    private Set<Role> roles;

    public JwtResponse(String token,
                       Long id,
                       String username,
                       String email,
                       String profilePicUrl,
                       Set<Role> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.profilePicUrl = profilePicUrl;
        this.roles = roles;
    }

    // getters only
    public String getToken() { return token; }
    public Long   getId()    { return id; }
    public String getUsername() { return username; }
    public String getEmail()    { return email; }
    public String getProfilePicUrl() { return profilePicUrl; }
    public Set<Role> getRoles() { return roles; }
}
