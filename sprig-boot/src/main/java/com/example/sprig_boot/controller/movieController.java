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

import com.example.sprig_boot.model.Movie;
import com.example.sprig_boot.repository.movieRepository;

@RestController
@CrossOrigin("http://127.0.0.1:5500")
public class movieController {

    movieRepository repository;// Inyeccion de dependencias
    
    // Constructor para la inyeccion de dependencias
    public movieController(movieRepository repository) {
        this.repository = repository;
    }
    
    //metodo para obtener listado de peliculas
    @GetMapping("/api/getAllMovies")
    public List<Movie> getAllMovies() {
        return repository.findAll();
    }
    
    //metodo para obtener una pelicula por id
    @GetMapping("/api/getMovieById/{id}")
    public ResponseEntity<Movie>getMovieById(@PathVariable Long id) {
        Optional<Movie> opt = repository.findById(id);
        
        if (opt.isEmpty()){
            return ResponseEntity.badRequest().build();
        }
        
        else {
            return ResponseEntity.ok(opt.get());
        }
    }
    
    //Metodo para guardar una pelicula
    @CrossOrigin("http://127.0.0.1:5500")
    @PostMapping("/api/addMovie")
    public ResponseEntity<Movie> addMovie(@RequestBody Movie Movie) {
        if (Movie.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        repository.save(Movie);
        return ResponseEntity.ok(Movie);
    }
    
    // Método para actualizar una película
    @PutMapping("/api/updateMovie/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        Optional<Movie> existingMovieOpt = repository.findById(id);
        
        if (existingMovieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Movie existingMovie = existingMovieOpt.get();
        existingMovie.setTitle(updatedMovie.getTitle());
        existingMovie.setDirector(updatedMovie.getDirector());
        existingMovie.setGenre(updatedMovie.getGenre());
        
        repository.save(existingMovie);
        return ResponseEntity.ok(existingMovie);
    }
    
    // Método para eliminar una película
    @DeleteMapping("/api/deleteMovie/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        Optional<Movie> existingMovieOpt = repository.findById(id);
        
        if (existingMovieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}