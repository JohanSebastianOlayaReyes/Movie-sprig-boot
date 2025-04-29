package com.example.sprig_boot.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "actor")
public class Actor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "country")
    private String country;
    
    // Relación con ActorMovie (One-to-Many)
    @OneToMany(mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ActorMovie> actorMovies = new HashSet<>();
    
    public Actor() {
        super();
    }
    
    public Actor(String firstName, String lastName, String country) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.country = country;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
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
        actorMovie.setActor(this);
    }
    
    public void removeActorMovie(ActorMovie actorMovie) {
        actorMovies.remove(actorMovie);
        actorMovie.setActor(null);
    }
}