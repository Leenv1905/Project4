package com.eproject.registry.repository;


import com.eproject.registry.entity.Pet;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PetRepository extends MongoRepository<Pet, String> {

    Optional<Pet> findByPetCode(String petCode);
    boolean existsByPetCode(String petCode);
}