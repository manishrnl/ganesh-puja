package com.example.andah_ganesh_puja.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String donorName;

    @Column
    private String phone;

    @Column
    private String email;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String paymentMode;

    @Column
    private String paymentReference;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "financial_year", nullable = false)
    private String year;

    @Column
    private String collectedBy;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private boolean showOnPublicWall = false;

    @Column(nullable = false)
    private String receiptNo;

    @Column(nullable = false)
    private String status = "Pending Approval";
}
