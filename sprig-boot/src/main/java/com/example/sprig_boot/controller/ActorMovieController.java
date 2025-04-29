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

import com.example.sprig_boot.model.ActorMovie;
import com.example.sprig_boot.repository.ActorMovieRepository;

@RestController
@CrossOrigin("http://127.0.0.1:5500")
public class ActorMovieController {

    private final ActorMovieRepository repository; // Inyección de dependencias
    
    // Constructor para la inyección de dependencias
    public ActorMovieController(ActorMovieRepository repository) {
        this.repository = repository;
    }
    
    // Método para obtener todas las relaciones Actor-Movie
    @GetMapping("/api/getAllActorMovies")
    public List<ActorMovie> getAllActorMovies() {
        return repository.findAll();
    }
    
    // Método para obtener una relación Actor-Movie por su id
    @GetMapping("/api/getActorMovieById/{id}")
    public ResponseEntity<ActorMovie> getActorMovieById(@PathVariable Long id) {
        Optional<ActorMovie> opt = repository.findById(id);
        
        if (opt.isEmpty()){
            return ResponseEntity.badRequest().build();
        }
        
        else {
            return ResponseEntity.ok(opt.get());
        }
    }
    
    // Método para guardar una nueva relación Actor-Movie
    @PostMapping("/api/addActorMovie")
    public ResponseEntity<ActorMovie> addActorMovie(@RequestBody ActorMovie actorMovie) {
        if (actorMovie.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        repository.save(actorMovie);
        return ResponseEntity.ok(actorMovie);
    }
    
    // Método para actualizar una relación Actor-Movie
    @PutMapping("/api/updateActorMovie/{id}")
    public ResponseEntity<ActorMovie> updateActorMovie(@PathVariable Long id, @RequestBody ActorMovie updatedActorMovie) {
        Optional<ActorMovie> existingActorMovieOpt = repository.findById(id);
        
        if (existingActorMovieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        ActorMovie existingActorMovie = existingActorMovieOpt.get();
        // Aquí puedes agregar cualquier lógica de actualización si es necesario.
        
        repository.save(existingActorMovie);
        return ResponseEntity.ok(existingActorMovie);
    }
    
    // Método para eliminar una relación Actor-Movie
    @DeleteMapping("/api/deleteActorMovie/{id}")
    public ResponseEntity<Void> deleteActorMovie(@PathVariable Long id) {
        Optional<ActorMovie> existingActorMovieOpt = repository.findById(id);
        
        if (existingActorMovieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
