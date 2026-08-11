package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.model.Appointment;
import com.hospital.hospital_appointment_system.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public Appointment book(@RequestBody BookingRequest request) {
        return appointmentService.bookAppointment(request.patientId(), request.scheduleId());
    }

    @GetMapping
    public List<Appointment> getAll() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public Appointment getById(@PathVariable String id) {
        return appointmentService.getAppointmentById(id);
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancel(@PathVariable String id) {
        return appointmentService.cancelAppointment(id);
    }

    public record BookingRequest(String patientId, String scheduleId) {}
}