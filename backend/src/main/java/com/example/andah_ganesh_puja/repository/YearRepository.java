package com.example.andah_ganesh_puja.repository;

import com.example.andah_ganesh_puja.entity.Year;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface YearRepository extends JpaRepository<Year, Long> {
    Optional<Year> findByLabel(String label);
    List<Year> findAllByOrderByLabelDesc();
    List<Year> findByActiveTrueOrderByLabelDesc();
}
