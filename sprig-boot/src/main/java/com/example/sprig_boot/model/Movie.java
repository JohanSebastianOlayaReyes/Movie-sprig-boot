package com.example.sprig_boot.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity(name = "movie")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "director")
    private String director;
    
    // Relación con Genre (Many-to-One)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;
    
    // Relación con ActorMovie (One-to-Many)
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ActorMovie> actorMovies = new HashSet<>();
    
    public Movie() {
        super();
    }

    public Movie(String title, String director) {
        super();
        this.title = title;
        this.director = director;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public Genre getGenre() {
        return genre;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }

    public Set<ActorMovie> getActorMovies() {
        return actorMovies;
    }

    public void setActorMovies(Set<ActorMovie> actorMovies) {
        this.actorMovies = actorMovies;
    }
    
    // Métodos helper para agregar y remover ActorMovie
    public void addActorMovie(ActorMovie actorMovie) {
        actorMovies.add(actorMovie);
        actorMovie.setMovie(this);
    }
    
    public void removeActorMovie(ActorMovie actorMovie) {
        actorMovies.remove(actorMovie);
        actorMovie.setMovie(null);
    }
}