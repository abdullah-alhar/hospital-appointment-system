package com.hospital.hospital_appointment_system;

import com.hospital.hospital_appointment_system.Repository.AdminRepository;
import com.hospital.hospital_appointment_system.model.Admin;
import com.hospital.hospital_appointment_system.model.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HospitalAppointmentSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospitalAppointmentSystemApplication.class, args);
	}

	@Bean
	CommandLineRunner seedDefaultAdmin(AdminRepository adminRepository) {
		return args -> {
			// Create the default admin if no admin with username "admin" exists
			if (adminRepository.findByUsername("admin").isEmpty()) {
				Admin admin = new Admin();
				admin.setId("AD001");
				admin.setUsername("admin");
				admin.setPassword("admin123");
				admin.setRole(Role.ADMIN);
				adminRepository.save(admin);
				System.out.println("✓ Default admin seeded (username: admin)");
			}
		};
	}
}
