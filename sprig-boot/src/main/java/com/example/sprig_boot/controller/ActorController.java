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

import com.example.sprig_boot.model.Actor;
import com.example.sprig_boot.repository.ActorRepository;

@RestController
@CrossOrigin("http://127.0.0.1:5500")
public class ActorController {

    ActorRepository repository;// Inyeccion de dependencias
    
    // Constructor para la inyeccion de dependencias
    public ActorController(ActorRepository repository) {
        this.repository = repository;
    }
    
    @GetMapping("/api/CreateActor")
    public void CreateActor() {
        Actor actor1 = new Actor("Tom", "Hanks", "USA");
        Actor actor2 = new Actor("Penélope", "Cruz", "Spain");
        Actor actor3 = new Actor("Denzel", "Washington", "USA");
                
        repository.save(actor1);
        repository.save(actor2);
        repository.save(actor3);
    }
    
    //metodo para obtener listado de actores
    @GetMapping("/api/getAllActors")
    public List<Actor> getAllActors() {
        return repository.findAll();
    }
    
    //metodo para obtener un actor por id
    @GetMapping("/api/getActorById/{id}")
    public ResponseEntity<Actor>getActorById(@PathVariable Long id) {
        Optional<Actor> opt = repository.findById(id);
        
        if (opt.isEmpty()){
            return ResponseEntity.badRequest().build();
        }
        
        else {
            return ResponseEntity.ok(opt.get());
        }
    }
    
    //Metodo para guardar un actor
    @CrossOrigin("http://127.0.0.1:5500")
    @PostMapping("/api/addActor")
    public ResponseEntity<Actor> addActor(@RequestBody Actor actor) {
        if (actor.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        repository.save(actor);
        return ResponseEntity.ok(actor);
    }
    
    // Método para actualizar un actor
    @PutMapping("/api/updateActor/{id}")
    public ResponseEntity<Actor> updateActor(@PathVariable Long id, @RequestBody Actor updatedActor) {
        Optional<Actor> existingActorOpt = repository.findById(id);
        
        if (existingActorOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Actor existingActor = existingActorOpt.get();
        existingActor.setFirstName(updatedActor.getFirstName());
        existingActor.setLastName(updatedActor.getLastName());
        existingActor.setCountry(updatedActor.getCountry());
        
        repository.save(existingActor);
        return ResponseEntity.ok(existingActor);
    }
    
    // Método para eliminar un actor
    @DeleteMapping("/api/deleteActor/{id}")
    public ResponseEntity<Void> deleteActor(@PathVariable Long id) {
        Optional<Actor> existingActorOpt = repository.findById(id);
        
        if (existingActorOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}