package com.example.andah_ganesh_puja.controller;

import com.example.andah_ganesh_puja.entity.Year;
import com.example.andah_ganesh_puja.repository.YearRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/superadmin")
public class SuperAdminController {

    private final YearRepository yearRepository;

    public SuperAdminController(YearRepository yearRepository) {
        this.yearRepository = yearRepository;
    }

    @GetMapping("/years")
    public ResponseEntity<List<Year>> getYears() {
        return ResponseEntity.ok(yearRepository.findAllByOrderByLabelDesc());
    }

    @GetMapping("/years/{id}")
    public ResponseEntity<Year> getYear(@PathVariable Long id) {
        return yearRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/years")
    public ResponseEntity<Year> createYear(@RequestBody Year year) {
        if (year.getLabel() == null || year.getLabel().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Year saved = yearRepository.save(year);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/years/{id}")
    public ResponseEntity<Year> updateYear(@PathVariable Long id, @RequestBody Year updatedYear) {
        return yearRepository.findById(id)
                .map(existing -> {
                    existing.setLabel(updatedYear.getLabel());
                    existing.setActive(updatedYear.isActive());
                    return ResponseEntity.ok(yearRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/years/{id}")
    public ResponseEntity<Void> deleteYear(@PathVariable Long id) {
        if (!yearRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        yearRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
