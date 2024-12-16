package com.foodease.server.repositories;

import com.foodease.server.models.Dish;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DishRepository extends MongoRepository<Dish, String> {
    List<Dish> findByRestaurantId(String restaurantId);
}
