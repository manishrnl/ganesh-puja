package com.example.andah_ganesh_puja.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "committee_members")
@Data
@NoArgsConstructor
public class CommitteeMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String designation;

    @Column(name = "financial_year", nullable = false)
    private String year;

    @Column(nullable = false)
    private String phone;

    @Column
    private String email;

    @Column(length = 1000)
    private String bio;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private boolean founder = false;

    @Column(nullable = false)
    private Integer displayOrder = 0;
}
