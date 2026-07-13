package com.hospital.hospital_appointment_system.model;

import jakarta.persistence.Entity;

@Entity
public class Patient extends User{
    private String bloodGroup;

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }
}
