package com.hospital.hospital_appointment_system.service;

import com.hospital.hospital_appointment_system.Repository.DoctorRepository;
import com.hospital.hospital_appointment_system.Repository.DoctorScheduleRepository;
import com.hospital.hospital_appointment_system.model.Doctor;
import com.hospital.hospital_appointment_system.model.DoctorSchedule;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class DoctorScheduleService {

    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorRepository doctorRepository;

    public DoctorScheduleService(DoctorScheduleRepository doctorScheduleRepository,
                                 DoctorRepository doctorRepository) {
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.doctorRepository = doctorRepository;
    }

    public DoctorSchedule createSchedule(String doctorId, LocalDate date, LocalTime startTime, int maxCount) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + doctorId));

        DoctorSchedule schedule = new DoctorSchedule();
        schedule.setId(generateNextId());
        schedule.setDoctor(doctor);
        schedule.setDate(date);
        schedule.setStartTime(startTime);
        schedule.setMaxCount(maxCount);
        schedule.setBookedCount(0);

        return doctorScheduleRepository.save(schedule);
    }

    public List<DoctorSchedule> getAllSchedules() {
        return doctorScheduleRepository.findAll();
    }

    public DoctorSchedule getScheduleById(String id) {
        return doctorScheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found: " + id));
    }

    public List<DoctorSchedule> getSchedulesByDoctor(String doctorId) {
        return doctorScheduleRepository.findAll().stream()
                .filter(s -> s.getDoctor().getId().equals(doctorId))
                .toList();
    }

    public boolean hasAvailableSlot(String scheduleId) {
        DoctorSchedule schedule = getScheduleById(scheduleId);
        return schedule.getBookedCount() < schedule.getMaxCount();
    }

    public void deleteSchedule(String id) {
        doctorScheduleRepository.delete(getScheduleById(id));
    }

    private String generateNextId() {
        int max = doctorScheduleRepository.findAll().stream()
                .map(DoctorSchedule::getId)
                .filter(id -> id != null && id.startsWith("S"))
                .map(id -> id.substring(1))
                .filter(num -> num.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);

        return String.format("S%03d", max + 1);
    }
}