package com.example.andah_ganesh_puja.repository;

import com.example.andah_ganesh_puja.entity.Year;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class YearRepositoryTest {

    @Autowired
    private YearRepository yearRepository;

    @Test
    void shouldSaveAndFetchFinancialYear() {
        Year year = new Year();
        year.setLabel("2026-27");
        year.setActive(true);

        Year saved = yearRepository.save(year);

        assertThat(saved.getId()).isNotNull();
        assertThat(yearRepository.findByLabel("2026-27")).isPresent();
    }
}
