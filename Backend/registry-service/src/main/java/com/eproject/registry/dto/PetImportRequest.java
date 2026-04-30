package com.eproject.registry.dto;

import lombok.Data;

@Data
public class PetImportRequest {

    private String petCode;
    private String petName;
    private int age;
    private String color;
    private String personality;
    private String vaccinationRecord;
    private String healthRecord;
    private String breed;
    private String gender;
    private double weight;
}