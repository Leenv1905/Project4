package com.eproject.petsale.common.mapper;


import com.eproject.petsale.pet.dto.PetPublicResponse;
import com.eproject.petsale.pet.dto.PetResponse;
import com.eproject.petsale.pet.entity.Pet;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PetPublicMapper {

    PetPublicResponse toResponse(Pet pet);

    List<PetPublicResponse> toResponseList(List<Pet> pets);
}