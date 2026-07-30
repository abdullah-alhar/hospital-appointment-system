package com.hospital.hospital_appointment_system.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class DoctorSchedule {
    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name= "Doctor_id")
    private Doctor doctor;

    private LocalDate date;
    private String startTime;
    private int maxCount;
    private int bookedCount;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public int getMaxCount() {
        return maxCount;
    }

    public void setMaxCount(int maxCount) {
        this.maxCount = maxCount;
    }

    public int getBookedCount() {
        return bookedCount;
    }

    public void setBookedCount(int bookedCount) {
        this.bookedCount = bookedCount;
    }
}
