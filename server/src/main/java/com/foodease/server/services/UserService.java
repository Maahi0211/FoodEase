package com.foodease.server.services;

import com.foodease.server.config.jwt.JwtUtil;
import com.foodease.server.dto.LoginDTO;
import com.foodease.server.dto.SignupDTO;
import com.foodease.server.models.Restaurant;
import com.foodease.server.repositories.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, String> signup(SignupDTO signupDTO) {
        // Validate input
        if (restaurantRepository.findByEmail(signupDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create new restaurant
        Restaurant restaurant = new Restaurant();
        restaurant.setName(signupDTO.getName());
        restaurant.setEmail(signupDTO.getEmail());
        restaurant.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
        restaurant.setPhoneNumber(signupDTO.getPhoneNumber());
        restaurant.setAddress(signupDTO.getAddress());

        // Save restaurant
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        // Generate token
        String token = jwtUtil.generateToken(savedRestaurant);

        // Return response
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "Signup successful");
        return response;
    }

    public Map<String, String> login(LoginDTO loginDTO) {
        // Find restaurant by email
        Restaurant restaurant = restaurantRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(loginDTO.getPassword(), restaurant.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate token
        String token = jwtUtil.generateToken(restaurant);

        // Return response
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "Login successful");
        return response;
    }

    public Optional<Restaurant> findById(String id) {
        return restaurantRepository.findById(id);
    }
}
