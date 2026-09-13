package com.example.andah_ganesh_puja.controller;

import com.example.andah_ganesh_puja.entity.CommitteeMember;
import com.example.andah_ganesh_puja.entity.Donation;
import com.example.andah_ganesh_puja.entity.Expense;
import com.example.andah_ganesh_puja.repository.CommitteeMemberRepository;
import com.example.andah_ganesh_puja.repository.DonationRepository;
import com.example.andah_ganesh_puja.repository.ExpenseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public")
public class PublicController {

    private final CommitteeMemberRepository committeeMemberRepository;
    private final DonationRepository donationRepository;
    private final ExpenseRepository expenseRepository;

    public PublicController(CommitteeMemberRepository committeeMemberRepository,
                           DonationRepository donationRepository,
                           ExpenseRepository expenseRepository) {
        this.committeeMemberRepository = committeeMemberRepository;
        this.donationRepository = donationRepository;
        this.expenseRepository = expenseRepository;
    }

    @GetMapping("/committee")
    public ResponseEntity<List<CommitteeMember>> getCommittee(@RequestParam String year) {
        return ResponseEntity.ok(committeeMemberRepository.findByYearOrderByDisplayOrderAsc(year));
    }
    @GetMapping("/health")
    public ResponseEntity<String> getHealth() {
        return ResponseEntity.ok("Application is running Smoothly");
    }

    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("Application is running Smoothly");
    }

    @GetMapping("/donations")
    public ResponseEntity<List<Donation>> getDonations(@RequestParam String year) {
        return ResponseEntity.ok(donationRepository.findByYear(year));
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getExpenses(@RequestParam String year) {
        return ResponseEntity.ok(expenseRepository.findByYear(year));
    }
}
