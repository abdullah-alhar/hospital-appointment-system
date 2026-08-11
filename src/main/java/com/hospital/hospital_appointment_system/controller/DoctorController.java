package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.model.Doctor;
import com.hospital.hospital_appointment_system.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    public record DoctorRequest(String username, String password, String specialization) {}
}