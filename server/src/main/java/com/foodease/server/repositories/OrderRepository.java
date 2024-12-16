package com.foodease.server.repositories;

import com.foodease.server.models.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByRestaurantIdAndStatus(String restaurantId, String status);
    List<Order> findByTableId(String tableId);
}
