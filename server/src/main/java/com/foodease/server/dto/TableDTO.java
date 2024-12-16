package com.foodease.server.dto;

import lombok.Data;

@Data
public class TableDTO {
    private String tableNumber;
    private String restaurantId; // Reference to the restaurant
}
