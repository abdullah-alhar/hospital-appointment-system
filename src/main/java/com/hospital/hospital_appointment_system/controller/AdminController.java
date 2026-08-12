package com.hospital.hospital_appointment_system.controller;

import com.hospital.hospital_appointment_system.model.Admin;
import com.hospital.hospital_appointment_system.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PutMapping("/{id}")
    public Admin update(@PathVariable String id, @RequestBody AdminRequest request) {
        return adminService.updateAdmin(id, request.username());
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable String id, @RequestBody PasswordChangeRequest request) {
        try {
            adminService.updatePassword(id, request.oldPassword(), request.newPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        adminService.deleteAdmin(id);
    }

    public record AdminRequest(String username, String password) {}
    public record PasswordChangeRequest(String oldPassword, String newPassword) {}
}