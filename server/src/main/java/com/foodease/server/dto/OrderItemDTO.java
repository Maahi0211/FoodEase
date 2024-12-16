package com.foodease.server.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
    private String dishId; // Reference to the dish
    private int quantity;
}

