package com.hospital.hospital_appointment_system.service;

import com.hospital.hospital_appointment_system.Repository.AdminRepository;
import com.hospital.hospital_appointment_system.model.Admin;
import com.hospital.hospital_appointment_system.model.Role;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin registerAdmin(String username, String password) {
        Admin admin = new Admin();
        admin.setId(generateNextId());
        admin.setUsername(username);
        admin.setPassword(password);
        admin.setRole(Role.ADMIN);
        return adminRepository.save(admin);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getAdminById(String id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found: " + id));
    }

    public void deleteAdmin(String id) {
        adminRepository.delete(getAdminById(id));
    }

    private String generateNextId() {
        int max = adminRepository.findAll().stream()
                .map(Admin::getId)
                .filter(id -> id != null && id.startsWith("AD"))
                .map(id -> id.substring(2))
                .filter(num -> num.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);

        return String.format("AD%03d", max + 1);
    }
}