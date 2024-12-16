package com.foodease.server.utils;

import com.foodease.server.models.Restaurant;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static Restaurant getCurrentRestaurant() {
        return (Restaurant) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}