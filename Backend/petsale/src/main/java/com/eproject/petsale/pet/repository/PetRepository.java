package com.eproject.petsale.pet.repository;
import com.eproject.petsale.pet.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public  interface PetRepository extends JpaRepository<Pet,Long> {
    List<Pet> findByUserEmail(String email);
    boolean existsByPetCode(String petCode);
    List<Pet> findByIsVerifiedTrueOrderByCreatedAtDesc();

}

