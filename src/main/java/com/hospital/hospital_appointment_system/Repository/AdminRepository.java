package com.hospital.hospital_appointment_system.Repository;
import com.hospital.hospital_appointment_system.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository <Admin, String> {
}
