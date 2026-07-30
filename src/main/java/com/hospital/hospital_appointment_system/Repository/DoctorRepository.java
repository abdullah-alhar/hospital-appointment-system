package com.hospital.hospital_appointment_system.Repository;

import com.hospital.hospital_appointment_system.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository <Doctor,String> {
}
