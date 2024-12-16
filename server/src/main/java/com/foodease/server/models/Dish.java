package com.foodease.server.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "dishes")
public class Dish {
    @Id
    private String id;
    private String restaurantId; // Reference to the Restaurant
    private String name;
    private String description;
    private double price;
}
