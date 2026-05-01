package com.eproject.petsale.registry.repository;

import com.eproject.petsale.registry.entity.MockMicrochipRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MockMicrochipRegistryRepository extends JpaRepository<MockMicrochipRegistry, Long> {
    Optional<MockMicrochipRegistry> findByMicrochipNumber(String microchipNumber);
}