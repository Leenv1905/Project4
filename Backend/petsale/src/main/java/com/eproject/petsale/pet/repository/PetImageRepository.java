package com.eproject.petsale.pet.repository;
import com.eproject.petsale.pet.entity.PetImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetImageRepository extends JpaRepository<PetImage, Long> {
}