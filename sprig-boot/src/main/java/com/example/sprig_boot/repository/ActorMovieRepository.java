package com.example.sprig_boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sprig_boot.model.ActorMovie;

// Hereda de JpaRepository para ActorMovie
@Repository
public interface ActorMovieRepository extends JpaRepository<ActorMovie, Long> {
}
