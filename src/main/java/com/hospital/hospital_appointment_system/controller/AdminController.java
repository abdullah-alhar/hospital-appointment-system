package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.model.Admin;
import com.hospital.hospital_appointment_system.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping
    public Admin register(@RequestBody AdminRequest request) {
        return adminService.registerAdmin(request.username(), request.password());
    }

    @GetMapping
    public List<Admin> getAll() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/{id}")
    public Admin getById(@PathVariable String id) {
        return adminService.getAdminById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        adminService.deleteAdmin(id);
    }

    public record AdminRequest(String username, String password) {}
}