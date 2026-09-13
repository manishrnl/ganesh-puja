package com.example.andah_ganesh_puja.repository;

import com.example.andah_ganesh_puja.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByYear(String year);
    List<Expense> findByVendorNameContainingIgnoreCase(String vendorName);
}
