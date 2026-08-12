package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.Repository.AdminRepository;
import com.hospital.hospital_appointment_system.Repository.DoctorRepository;
import com.hospital.hospital_appointment_system.Repository.PatientRepository;
import com.hospital.hospital_appointment_system.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AdminRepository adminRepository;

    public AuthController(PatientRepository patientRepository,
                          DoctorRepository doctorRepository,
                          AdminRepository adminRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String username = request.username();
        String password = request.password();

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required."));
        }

        // Search across all user types by username
        Optional<? extends User> found = patientRepository.findByUsername(username);
        if (found.isEmpty()) {
            found = doctorRepository.findByUsername(username);
        }
        if (found.isEmpty()) {
            found = adminRepository.findByUsername(username);
        }

        if (found.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "User not found. Check your username."));
        }

        User user = found.get();

        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("message", "Incorrect password."));
        }

        // Build response with user info
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("role", user.getRole().name());

        // Add role-specific fields
        if (user instanceof com.hospital.hospital_appointment_system.model.Patient patient) {
            response.put("bloodGroup", patient.getBloodGroup());
        } else if (user instanceof com.hospital.hospital_appointment_system.model.Doctor doctor) {
            response.put("specialization", doctor.getSpecialization());
        }

        return ResponseEntity.ok(response);
    }

    public record LoginRequest(String username, String password) {}
}
