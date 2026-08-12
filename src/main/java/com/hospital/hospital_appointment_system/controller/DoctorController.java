package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.model.Doctor;
import com.hospital.hospital_appointment_system.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public Doctor register(@RequestBody DoctorRequest request) {
        return doctorService.registerDoctor(request.username(), request.password(), request.specialization());
    }

    @GetMapping
    public List<Doctor> getAll() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public Doctor getById(@PathVariable String id) {
        return doctorService.getDoctorById(id);
    }

    @PutMapping("/{id}")
    public Doctor update(@PathVariable String id, @RequestBody DoctorRequest request) {
        return doctorService.updateDoctor(id, request.username(), request.specialization());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        doctorService.deleteDoctor(id);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable String id, @RequestBody PasswordChangeRequest request) {
        try {
            doctorService.updatePassword(id, request.oldPassword(), request.newPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    public record DoctorRequest(String username, String password, String specialization) {}
    public record PasswordChangeRequest(String oldPassword, String newPassword) {}
}