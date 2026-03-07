package com.eproject.petsale.personalization.repository;

import com.eproject.petsale.personalization.entity.BuyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BuyerProfileRepository extends JpaRepository<BuyerProfile, Long> {

}
