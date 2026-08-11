package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.model.DoctorSchedule;
import com.hospital.hospital_appointment_system.service.DoctorScheduleService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class DoctorScheduleController {

    private final DoctorScheduleService doctorScheduleService;

    public DoctorScheduleController(DoctorScheduleService doctorScheduleService) {
        this.doctorScheduleService = doctorScheduleService;
    }

    @PostMapping
    public DoctorSchedule create(@RequestBody ScheduleRequest request) {
        return doctorScheduleService.createSchedule(
                request.doctorId(), request.date(), request.startTime(), request.maxCount());
    }

    @GetMapping
    public List<DoctorSchedule> getAll() {
        return doctorScheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public DoctorSchedule getById(@PathVariable String id) {
        return doctorScheduleService.getScheduleById(id);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<DoctorSchedule> getByDoctor(@PathVariable String doctorId) {
        return doctorScheduleService.getSchedulesByDoctor(doctorId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        doctorScheduleService.deleteSchedule(id);
    }

    public record ScheduleRequest(String doctorId, LocalDate date, LocalTime startTime, int maxCount) {}
}