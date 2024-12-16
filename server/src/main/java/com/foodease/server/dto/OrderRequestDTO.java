package com.foodease.server.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private String tableId; // Reference to the table
    private String customerName;
    private String customerPhone;
    private List<OrderItemDTO> items;
}

