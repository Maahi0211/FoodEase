package com.foodease.server.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String dishId; // Reference to the Dish
    private String name;
    private int quantity;
    private double price;
}

