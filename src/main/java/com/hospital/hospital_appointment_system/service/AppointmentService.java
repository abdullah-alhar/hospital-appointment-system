package com.hospital.hospital_appointment_system.service;

import com.hospital.hospital_appointment_system.Repository.AppointmentRepository;
import com.hospital.hospital_appointment_system.Repository.DoctorScheduleRepository;
import com.hospital.hospital_appointment_system.Repository.PatientRepository;
import com.hospital.hospital_appointment_system.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorScheduleRepository doctorScheduleRepository,
                              PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public Appointment bookAppointment(String patientId, String scheduleId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + patientId));

        DoctorSchedule schedule = doctorScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found: " + scheduleId));

        if (schedule.getBookedCount() >= schedule.getMaxCount()) {
            throw new IllegalStateException("This schedule is fully booked.");
        }

        int nextQueueNumber = schedule.getBookedCount() + 1;

        Appointment appointment = new Appointment();
        appointment.setId(generateNextId());
        appointment.setPatient(patient);
        appointment.setDoctorSchedule(schedule);
        appointment.setQueueNumber(nextQueueNumber);
        appointment.setStatus(AppointmentStatus.PENDING);

        schedule.setBookedCount(nextQueueNumber);
        doctorScheduleRepository.save(schedule);

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(String id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found: " + id));
    }

    @Transactional
    public Appointment cancelAppointment(String id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(AppointmentStatus.CANCELLED);

        DoctorSchedule schedule = appointment.getDoctorSchedule();
        schedule.setBookedCount(schedule.getBookedCount() - 1);
        doctorScheduleRepository.save(schedule);

        return appointmentRepository.save(appointment);
    }

    private String generateNextId() {
        int max = appointmentRepository.findAll().stream()
                .map(Appointment::getId)
                .filter(id -> id != null && id.startsWith("A"))
                .map(id -> id.substring(1))
                .filter(num -> num.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);

        return String.format("A%03d", max + 1);
    }
}