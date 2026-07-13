package com.hospital.hospital_appointment_system.model;
import jakarta.persistence.Entity;

@Entity
public class Doctor extends User{
    private String specialization;

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}
