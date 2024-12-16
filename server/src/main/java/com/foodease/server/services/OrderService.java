package com.foodease.server.services;

import com.foodease.server.dto.OrderRequestDTO;
import com.foodease.server.models.Order;
import com.foodease.server.models.OrderItem;
import com.foodease.server.repositories.DishRepository;
import com.foodease.server.repositories.OrderRepository;
import com.foodease.server.repositories.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private DishRepository dishRepository;

    public Order createOrder(OrderRequestDTO orderRequestDTO){
        var table = tableRepository.findById(orderRequestDTO.getTableId()).orElseThrow(() -> new IllegalArgumentException("table not found"));
        List<OrderItem> list = new ArrayList<>();
        for(var itemDTO : orderRequestDTO.getItems()) {
            var dish = dishRepository.findById(itemDTO.getDishId()).orElseThrow(() -> new IllegalArgumentException("dish not found"));
            OrderItem orderItem = new OrderItem();
            orderItem.setDishId(dish.getId());
            orderItem.setName(dish.getName());
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(dish.getPrice());
            list.add(orderItem);
        }
        Order order = new Order();
        order.setTableId(orderRequestDTO.getTableId());
        order.setRestaurantId(table.getRestaurantId());
        order.setCustomerName(orderRequestDTO.getCustomerName());
        order.setCustomerPhone(orderRequestDTO.getCustomerPhone());
        order.setItems(list);
        order.setStatus("PENDING");
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByRestaurantId(String restaurantId){
        return orderRepository.findByRestaurantIdAndStatus(restaurantId, "PENDING");
    }

    public Order updateOrderStatus(String orderId, String status){
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public List<Order> getOrderByTable(String tableId){
        return orderRepository.findByTableId(tableId);
    }
}
