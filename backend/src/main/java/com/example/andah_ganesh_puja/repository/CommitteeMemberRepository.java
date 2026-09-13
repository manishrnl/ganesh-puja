package com.example.andah_ganesh_puja.repository;

import com.example.andah_ganesh_puja.entity.CommitteeMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommitteeMemberRepository extends JpaRepository<CommitteeMember, Long> {
    List<CommitteeMember> findByYearOrderByDisplayOrderAsc(String year);
}
