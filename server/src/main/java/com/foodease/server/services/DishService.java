package com.foodease.server.services;

import com.foodease.server.dto.DishDTO;
import com.foodease.server.models.Dish;
import com.foodease.server.models.Restaurant;
import com.foodease.server.repositories.DishRepository;
import com.foodease.server.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    public Dish addDish(DishDTO dishDTO){
        Restaurant currentRestaurant = SecurityUtils.getCurrentRestaurant();
        Dish dish = new Dish();
        dish.setName(dishDTO.getName());
        dish.setRestaurantId(currentRestaurant.getId());
        dish.setDescription(dishDTO.getDescription());
        dish.setPrice(dishDTO.getPrice());
        dish.setDishUrl(dishDTO.getDishUrl());
        return dishRepository.save(dish);
    }

    //specific restro ki saari dishes mil jygi isse... kese ? restaurantId se milegi... hehe
    public List<Dish> getDishes(String restaurantId){
        return dishRepository.findByRestaurantId(restaurantId);
    }

    public List<Dish> getDishesbyToken(){
        Restaurant currentRestaurant = SecurityUtils.getCurrentRestaurant();
        return dishRepository.findByRestaurantId(currentRestaurant.getId());
    }

    public void removeDish(String dishId) throws IllegalAccessException {
        Restaurant currentRestaurant = SecurityUtils.getCurrentRestaurant();
        Dish dish = dishRepository.findById(dishId).orElseThrow(() -> new IllegalArgumentException("dish not found"));
        if(!dish.getRestaurantId().equals(currentRestaurant.getId())){
            throw new IllegalAccessException("unauthorized");
        }
        dishRepository.deleteById(dishId);
    }
}
