package com.eproject.registry.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "pets")
public class Pet {

    @Id
    private String id;
    @Indexed(unique = true)
    private String petCode;     // mã chip (15 số)
    private String petName;
    private int age;
    private String color;
    private String personality;
    private String vaccinationRecord; // sổ tiêm
    private String healthRecord;      // sổ sức khỏe
    private String breed;
    private String gender;
    private double weight;

    private boolean verified;
}