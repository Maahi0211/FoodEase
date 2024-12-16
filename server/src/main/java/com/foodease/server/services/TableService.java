package com.foodease.server.services;

import com.foodease.server.dto.TableDTO;
import com.foodease.server.models.Restaurant;
import com.foodease.server.models.Table;
import com.foodease.server.repositories.TableRepository;
import com.foodease.server.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService {

    @Autowired
    private TableRepository tableRepository;

    public Table addTable(TableDTO tableDTO) {
        Restaurant currentRestaurant = SecurityUtils.getCurrentRestaurant();
        Table table = new Table();
        table.setTableNumber(tableDTO.getTableNumber());
        table.setRestaurantId(currentRestaurant.getId());
        return tableRepository.save(table);
    }

    public List<Table> allTableForUser (String restaurantId){
        return tableRepository.findByRestaurantId(restaurantId);
    }

    public List<Table> allTableForOwner () {
        Restaurant currentRestaurant = SecurityUtils.getCurrentRestaurant();
        return tableRepository.findByRestaurantId(currentRestaurant.getId());
    }

    public void removeTable(String tableId){
        Restaurant currentRestaurant = SecurityUtils.getCurrentRestaurant();
        Table table = tableRepository.findById(tableId).orElseThrow(() -> new IllegalArgumentException("table not found"));
        if(!table.getRestaurantId().equals(currentRestaurant.getId())){
            throw new IllegalArgumentException("unauthorised");
        }
        tableRepository.deleteById(tableId);
    }
}