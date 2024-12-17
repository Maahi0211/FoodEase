package com.foodease.server.services;

import com.foodease.server.dto.RestaurantDTO;
import com.foodease.server.models.Restaurant;
import com.foodease.server.repositories.RestaurantRepository;
import com.foodease.server.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

//    @Autowired
//    private RestaurantDTO restaurantDTO;

    public RestaurantDTO getRestaurant(){
        Restaurant currentRestaurant = SecurityUtils.getCurrentRestaurant();
        RestaurantDTO restaurantDTO = new RestaurantDTO();
        restaurantDTO.setId(currentRestaurant.getId());
        restaurantDTO.setName(currentRestaurant.getName());
        restaurantDTO.setAddress(currentRestaurant.getAddress());
        restaurantDTO.setEmail(currentRestaurant.getEmail());
        restaurantDTO.setPhoneNumber(currentRestaurant.getPhoneNumber());
        return restaurantDTO;
    }
}
