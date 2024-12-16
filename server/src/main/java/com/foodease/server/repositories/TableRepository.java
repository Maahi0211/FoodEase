package com.foodease.server.repositories;

import com.foodease.server.models.Table;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TableRepository extends MongoRepository<Table, String> {
    List<Table> findByRestaurantId(String restaurantId);
}
