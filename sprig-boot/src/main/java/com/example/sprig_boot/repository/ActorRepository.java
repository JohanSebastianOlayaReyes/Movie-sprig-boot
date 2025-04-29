package com.example.sprig_boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sprig_boot.model.Actor;

//Hereda de JpaRepository, con extends
@Repository
public interface ActorRepository extends JpaRepository<Actor, Long> {
}