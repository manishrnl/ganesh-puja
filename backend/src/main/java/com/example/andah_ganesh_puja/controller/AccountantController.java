package com.example.andah_ganesh_puja.controller;

import com.example.andah_ganesh_puja.entity.Donation;
import com.example.andah_ganesh_puja.entity.Expense;
import com.example.andah_ganesh_puja.entity.Year;
import com.example.andah_ganesh_puja.repository.DonationRepository;
import com.example.andah_ganesh_puja.repository.ExpenseRepository;
import com.example.andah_ganesh_puja.repository.YearRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accountant")
public class AccountantController {

    private final DonationRepository donationRepository;
    private final ExpenseRepository expenseRepository;
    private final YearRepository yearRepository;

    public AccountantController(DonationRepository donationRepository,
                               ExpenseRepository expenseRepository,
                               YearRepository yearRepository) {
        this.donationRepository = donationRepository;
        this.expenseRepository = expenseRepository;
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

        return ResponseEntity.status(HttpStatus.CREATED).body(yearRepository.save(year));
    }

    @PutMapping("/years/{id}")
    public ResponseEntity<Year> updateYear(@PathVariable Long id, @RequestBody Year year) {
        return yearRepository.findById(id)
                .map(existing -> {
                    existing.setLabel(year.getLabel());
                    existing.setActive(year.isActive());
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

    @GetMapping("/donations")
    public ResponseEntity<List<Donation>> getDonations(@RequestParam String year) {
        return ResponseEntity.ok(donationRepository.findByYear(year));
    }

    @PostMapping("/donations")
    public ResponseEntity<Donation> saveDonation(@RequestBody Donation donation) {
        return ResponseEntity.ok(donationRepository.save(donation));
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getExpenses(@RequestParam String year) {
        return ResponseEntity.ok(expenseRepository.findByYear(year));
    }

    @PostMapping("/expenses")
    public ResponseEntity<Expense> saveExpense(@RequestBody Expense expense) {
        return ResponseEntity.ok(expenseRepository.save(expense));
    }
}
