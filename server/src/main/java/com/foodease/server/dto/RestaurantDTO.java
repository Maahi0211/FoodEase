package com.foodease.server.dto;

import lombok.Data;

@Data
public class RestaurantDTO {

    private String id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
}
