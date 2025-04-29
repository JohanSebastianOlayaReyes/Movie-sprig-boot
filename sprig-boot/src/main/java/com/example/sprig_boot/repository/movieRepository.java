package com.example.sprig_boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sprig_boot.model.Movie;

//Hereda de JpaRepository, con extends 
@Repository
public interface movieRepository extends JpaRepository<Movie, Long> {

}
