package com.example.sprig_boot.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.sprig_boot.model.Admin;
import com.example.sprig_boot.repository.AdminRepository;

@RestController
@CrossOrigin("http://127.0.0.1:5500")
public class  adminController{

    AdminRepository repository; // Inyección de dependencias

    // Constructor para la inyección de dependencias
    public adminController(AdminRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/CreateAdmins")
    public void CreateAdmins() {
        Admin admin1 = new Admin("Juan Pérez", "1234", "juan@example.com", "1234567890");
        Admin admin2 = new Admin("María García", "abcd", "maria@example.com", "0987654321");
        Admin admin3 = new Admin("Carlos Ruiz", "pass123", "carlos@example.com", "1122334455");

        repository.save(admin1);
        repository.save(admin2);
        repository.save(admin3);
    }

    // Método para obtener listado de administradores
    @GetMapping("/api/getAllAdmins")
    public List<Admin> getAllAdmins() {
        return repository.findAll();
    }

    // Método para obtener un administrador por id
    @GetMapping("/api/getAdminById/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        Optional<Admin> opt = repository.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        } else {
            return ResponseEntity.ok(opt.get());
        }
    }

    // Método para guardar un administrador
    @PostMapping("/api/addAdmin")
    public ResponseEntity<Admin> addAdmin(@RequestBody Admin admin) {
        if (admin.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        repository.save(admin);
        return ResponseEntity.ok(admin);
    }

    // Método para actualizar un administrador
    @PutMapping("/api/updateAdmin/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin updatedAdmin) {
        Optional<Admin> existingAdminOpt = repository.findById(id);

        if (existingAdminOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Admin existingAdmin = existingAdminOpt.get();
        existingAdmin.setName(updatedAdmin.getName());
        existingAdmin.setPassword(updatedAdmin.getPassword());
        existingAdmin.setEmail(updatedAdmin.getEmail());
        existingAdmin.setPhone(updatedAdmin.getPhone());

        repository.save(existingAdmin);
        return ResponseEntity.ok(existingAdmin);
    }

    // Método para eliminar un administrador
    @DeleteMapping("/api/deleteAdmin/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        Optional<Admin> existingAdminOpt = repository.findById(id);

        if (existingAdminOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
