package com.eproject.registry.repository;

import com.eproject.registry.model.PetRegistry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PetRegistryRepository extends MongoRepository<PetRegistry, String> {
    // Phương thức quan trọng nhất: tìm hồ sơ bằng mã chip 15 số
    Optional<PetRegistry> findByPetCode(String petCode);
}