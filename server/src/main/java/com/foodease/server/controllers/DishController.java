package com.foodease.server.controllers;

import com.foodease.server.dto.DishDTO;
import com.foodease.server.models.Dish;
import com.foodease.server.services.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dish")
@CrossOrigin("*")
public class DishController {

    @Autowired
    private DishService dishService;

    @PostMapping("/add-dish")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Dish> addDish(@RequestBody DishDTO dishDTO) {
        try{
            Dish newDish = dishService.addDish(dishDTO);
            return ResponseEntity.ok(newDish);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{restaurantId}")
    public ResponseEntity<List<Dish>> getDishes(@PathVariable String restaurantId){
        try{
            List<Dish> alldishes = dishService.getDishes(restaurantId);
            return ResponseEntity.ok(alldishes);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/remove/{dishId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeDish (@PathVariable String dishId){
        try{
            dishService.removeDish(dishId);
            return ResponseEntity.ok(Map.of("message", "dish deleted successfully"));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
