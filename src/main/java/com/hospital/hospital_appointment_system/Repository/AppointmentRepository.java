package com.hospital.hospital_appointment_system.Repository;
import com.hospital.hospital_appointment_system.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository <Appointment, String>{
}
