package com.foodease.server.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String restaurantId; // Reference to the Restaurant
    private String tableId; // Reference to the Table
    private String customerName;
    private String customerPhone;
    private List<OrderItem> items; // List of ordered dishes
    private String status; // e.g., "Pending", "Completed"
    private String tableNumber; // Add this field
}

