package com.example.sprig_boot.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "genre")
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;
    
    // Relación con Movie (One-to-Many)
    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Movie> movies = new ArrayList<>();

    public Genre() {
        super();
    }

    public Genre(String name) {
        super();
        this.name = name;
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
    
    public List<Movie> getMovies() {
        return movies;
    }
    
    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }
    
    // Métodos helper para añadir y remover películas
    public void addMovie(Movie movie) {
        movies.add(movie);
        movie.setGenre(this);
    }
    
    public void removeMovie(Movie movie) {
        movies.remove(movie);
        movie.setGenre(null);
    }
}