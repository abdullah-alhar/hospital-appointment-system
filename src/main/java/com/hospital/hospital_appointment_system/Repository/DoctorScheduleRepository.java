package com.hospital.hospital_appointment_system.Repository;
import com.hospital.hospital_appointment_system.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorScheduleRepository extends JpaRepository <DoctorSchedule,String>{

}
