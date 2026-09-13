package com.example.andah_ganesh_puja.repository;



import com.example.andah_ganesh_puja.entity.Session;
import com.example.andah_ganesh_puja.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByProfileEntity(ProfileEntity profileEntity);

    Optional<Session> findByRefreshToken(String refreshToken);

    List<Session> findByProfileEntityIdOrderByCreatedAtAsc(Long id);

    boolean existsByRefreshToken(String refreshToken);
}
