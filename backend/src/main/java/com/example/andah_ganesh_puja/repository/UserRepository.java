package com.example.andah_ganesh_puja.repository;

import com.example.andah_ganesh_puja.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<ProfileEntity, Long> {
    @Query("select p from ProfileEntity p where p.email = :username")
    Optional<ProfileEntity> findByUsername(@Param("username") String username);

    @Query("select count(p) > 0 from ProfileEntity p where p.email = :username")
    boolean existsByUsername(@Param("username") String username);
}
