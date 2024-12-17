package com.foodease.server.controllers;

import com.foodease.server.dto.RestaurantDTO;
import com.foodease.server.models.Restaurant;
import com.foodease.server.services.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/restaurant")
@CrossOrigin("*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/details")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RestaurantDTO> getRestaurant (){
        try{
            RestaurantDTO restaurant = restaurantService.getRestaurant();
            return ResponseEntity.ok(restaurant);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
