package com.eproject.petsale.registry.repository;

import com.eproject.petsale.registry.entity.VerificationTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationTaskRepository extends JpaRepository<VerificationTask, Long> {
    List<VerificationTask> findByOperatorEmailAndStatus(String email, String status);
    List<VerificationTask> findByOperatorEmail(String email);
    List<VerificationTask> findByStatus(String status);
    boolean existsByPetIdAndStatusIn(Long petId, java.util.Collection<String> statuses);
    long countByOperatorIdAndStatusIn(Long operatorId, java.util.Collection<String> statuses);
}
