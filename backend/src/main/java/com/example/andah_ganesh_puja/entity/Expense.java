package com.example.andah_ganesh_puja.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vendorName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "financial_year", nullable = false)
    private String year;

    @Column
    private String paymentMode;

    @Column
    private String paidBy;

    @Column(length = 2000)
    private String notes;

    @Column(nullable = false)
    private String status = "Pending Approval";
}
