package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.model.Patient;
import com.hospital.hospital_appointment_system.service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        patientService.deletePatient(id);
    }

    public record PatientRequest(String username, String password, String bloodGroup) {}
}