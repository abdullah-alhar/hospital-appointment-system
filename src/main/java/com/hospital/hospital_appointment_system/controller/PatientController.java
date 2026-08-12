package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.model.Patient;
import com.hospital.hospital_appointment_system.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public Patient register(@RequestBody PatientRequest request) {
        return patientService.registerPatient(request.username(), request.password(), request.bloodGroup());
    }

    @GetMapping
    public List<Patient> getAll() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public Patient getById(@PathVariable String id) {
        return patientService.getPatientById(id);
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable String id, @RequestBody PatientRequest request) {
        return patientService.updatePatient(id, request.username(), request.bloodGroup());
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable String id, @RequestBody PasswordChangeRequest request) {
        try {
            patientService.updatePassword(id, request.oldPassword(), request.newPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        patientService.deletePatient(id);
    }

    public record PatientRequest(String username, String password, String bloodGroup) {}
    public record PasswordChangeRequest(String oldPassword, String newPassword) {}
}