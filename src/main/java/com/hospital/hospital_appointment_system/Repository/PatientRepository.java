package com.hospital.hospital_appointment_system.Repository;
import com.hospital.hospital_appointment_system.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository <Patient,String>{
}
