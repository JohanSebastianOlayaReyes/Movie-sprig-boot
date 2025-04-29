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

import com.example.sprig_boot.model.Genre;
import com.example.sprig_boot.repository.GenreRepository;

@RestController
@CrossOrigin("http://127.0.0.1:5500")
public class GenreController {

    GenreRepository repository; // Inyección de dependencias

    // Constructor para la inyección de dependencias
    public GenreController(GenreRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/CreateGenre")
    public void CreateGenre() {
        Genre genre1 = new Genre("Sci-Fi");
        Genre genre2 = new Genre("Crime");
        Genre genre3 = new Genre("Drama");

        repository.save(genre1);
        repository.save(genre2);
        repository.save(genre3);
    }

    // Método para obtener listado de géneros
    @GetMapping("/api/getAllGenres")
    public List<Genre> getAllGenres() {
        return repository.findAll();
    }

    // Método para obtener un género por id
    @GetMapping("/api/getGenreById/{id}")
    public ResponseEntity<Genre> getGenreById(@PathVariable Long id) {
        Optional<Genre> opt = repository.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        } else {
            return ResponseEntity.ok(opt.get());
        }
    }

    // Método para guardar un género
    @PostMapping("/api/addGenre")
    public ResponseEntity<Genre> addGenre(@RequestBody Genre genre) {
        if (genre.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        repository.save(genre);
        return ResponseEntity.ok(genre);
    }

    // Método para actualizar un género
    @PutMapping("/api/updateGenre/{id}")
    public ResponseEntity<Genre> updateGenre(@PathVariable Long id, @RequestBody Genre updatedGenre) {
        Optional<Genre> existingGenreOpt = repository.findById(id);

        if (existingGenreOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Genre existingGenre = existingGenreOpt.get();
        existingGenre.setName(updatedGenre.getName());

        repository.save(existingGenre);
        return ResponseEntity.ok(existingGenre);
    }

    // Método para eliminar un género
    @DeleteMapping("/api/deleteGenre/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        Optional<Genre> existingGenreOpt = repository.findById(id);

        if (existingGenreOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
