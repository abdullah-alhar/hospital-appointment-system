package com.hospital.hospital_appointment_system.service;

import com.hospital.hospital_appointment_system.Repository.PatientRepository;
import com.hospital.hospital_appointment_system.model.Patient;
import com.hospital.hospital_appointment_system.model.Role;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient registerPatient(String username, String password, String bloodGroup) {
        Patient patient = new Patient();
        patient.setId(generateNextId());
        patient.setUsername(username);
        patient.setPassword(password);
        patient.setRole(Role.PATIENT);
        patient.setBloodGroup(bloodGroup);
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(String id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + id));
    }

    public Patient updatePatient(String id, String username, String bloodGroup) {
        Patient patient = getPatientById(id);
        patient.setUsername(username);
        patient.setBloodGroup(bloodGroup);
        return patientRepository.save(patient);
    }

    public void deletePatient(String id) {
        patientRepository.delete(getPatientById(id));
    }

    private String generateNextId() {
        int max = patientRepository.findAll().stream()
                .map(Patient::getId)
                .filter(id -> id != null && id.startsWith("P"))
                .map(id -> id.substring(1))
                .filter(num -> num.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);

        return String.format("P%03d", max + 1);
    }
}