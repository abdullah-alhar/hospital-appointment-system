package com.hospital.hospital_appointment_system.Repository;

import com.hospital.hospital_appointment_system.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository <Doctor,String> {
    Optional<Doctor> findByUsername(String username);
}
