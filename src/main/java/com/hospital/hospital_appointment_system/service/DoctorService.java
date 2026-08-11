package com.hospital.hospital_appointment_system.service;

import com.hospital.hospital_appointment_system.Repository.DoctorRepository;
import com.hospital.hospital_appointment_system.model.Doctor;
import com.hospital.hospital_appointment_system.model.Role;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor registerDoctor(String username, String password, String specialization) {
        Doctor doctor = new Doctor();
        doctor.setId(generateNextId());
        doctor.setUsername(username);
        doctor.setPassword(password);
        doctor.setRole(Role.DOCTOR);
        doctor.setSpecialization(specialization);
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(String id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + id));
    }

    public Doctor updateDoctor(String id, String username, String specialization) {
        Doctor doctor = getDoctorById(id);
        doctor.setUsername(username);
        doctor.setSpecialization(specialization);
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(String id) {
        doctorRepository.delete(getDoctorById(id));
    }

    private String generateNextId() {
        int max = doctorRepository.findAll().stream()
                .map(Doctor::getId)
                .filter(id -> id != null && id.startsWith("D"))
                .map(id -> id.substring(1))
                .filter(num -> num.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);

        return String.format("D%03d", max + 1);
    }
}