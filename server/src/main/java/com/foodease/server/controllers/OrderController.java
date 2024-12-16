package com.foodease.server.controllers;

import com.foodease.server.dto.OrderRequestDTO;
import com.foodease.server.models.Order;
import com.foodease.server.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create-order")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequestDTO orderRequestDTO){
        try{
            Order order = orderService.createOrder(orderRequestDTO);
            return ResponseEntity.ok(order);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/get-order/{restaurantId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Order>> getOrder (@PathVariable String restaurantId){
        try{
            List<Order> list = orderService.getOrdersByRestaurantId(restaurantId);
            return ResponseEntity.ok(list);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update-order-status/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateOrderStatus (@PathVariable String orderId, @RequestBody Map<String, String> statusUpdate){
        try {
            Order order= orderService.updateOrderStatus(orderId, statusUpdate.get("status"));
            return ResponseEntity.ok(order);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/get-order-of-table/{tableId}")
    public ResponseEntity<List<Order>> getTableOrder (@PathVariable String tableId){
        try{
            List<Order> list = orderService.getOrderByTable(tableId);
            return ResponseEntity.ok(list);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
