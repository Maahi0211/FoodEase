package com.foodease.server.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderResponseDTO {
    private String orderId;
    private String tableId;
    private String customerName;
    private String customerPhone;
    private List<OrderItemDTO> items;
    private String status; // "Pending", "Completed", etc.
}