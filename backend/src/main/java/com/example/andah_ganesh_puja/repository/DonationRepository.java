package com.example.andah_ganesh_puja.repository;

import com.example.andah_ganesh_puja.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByYear(String year);
    List<Donation> findByDonorNameContainingIgnoreCase(String donorName);
}
