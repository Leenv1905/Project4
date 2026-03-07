package com.eproject.petsale.pet.repository;

import com.eproject.petsale.pet.entity.PetRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetRequirementRepository extends JpaRepository<PetRequirement, Long> {
}
