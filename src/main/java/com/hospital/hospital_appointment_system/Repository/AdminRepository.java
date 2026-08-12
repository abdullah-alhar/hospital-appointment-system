package com.hospital.hospital_appointment_system.Repository;
import com.hospital.hospital_appointment_system.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository <Admin, String> {
    Optional<Admin> findByUsername(String username);
}
