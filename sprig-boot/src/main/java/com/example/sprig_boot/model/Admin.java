package com.example.sprig_boot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "admin") // Nombre de la tabla en la base de datos
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Genera el id automáticamente
    @Column(name = "id") // Nombre de la columna en la base de datos
    private Long id;

    @Column(name = "name") // Nombre de la columna en la base de datos
    private String name;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    public Admin() {
        super();
    }

    public Admin(String name, String password, String email, String phone) {
        super();
        this.name = name;
        this.password = password;
        this.email = email;
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}