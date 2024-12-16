package com.foodease.server.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tables")
public class Table {
    @Id
    private String id;
    private String tableNumber;
    private String restaurantId; // Reference to the Restaurant
}