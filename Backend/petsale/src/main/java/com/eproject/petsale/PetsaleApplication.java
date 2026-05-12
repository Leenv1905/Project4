package com.eproject.petsale;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PetsaleApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetsaleApplication.class, args);
	}

}
