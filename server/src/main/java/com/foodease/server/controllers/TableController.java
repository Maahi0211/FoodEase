package com.foodease.server.controllers;

import com.foodease.server.dto.TableDTO;
import com.foodease.server.models.Table;
import com.foodease.server.services.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/table")
@CrossOrigin("*")
public class TableController {

    @Autowired
    private TableService tableService;

    @PostMapping("/add-table")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Table> addTable(@RequestBody TableDTO tableDTO){
        try{
            Table newTable = tableService.addTable(tableDTO);
            return ResponseEntity.ok(newTable);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Table>> getAllTables (@PathVariable String restaurantId){
        try{
            List<Table> list = tableService.allTableForUser(restaurantId);
            return ResponseEntity.ok(list);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/restaurant/my-table")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Table>> getMyTables (){
        try{
            List<Table> list = tableService.allTableForOwner();
            return ResponseEntity.ok(list);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/restaurant/remove-table/{tableId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeTable(@PathVariable String tableId){
        try{
            tableService.removeTable(tableId);
            return ResponseEntity.ok(Map.of("message", "table deleted successfully"));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
