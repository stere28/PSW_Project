package it.unical.mormannoshop.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "venditori")
public class Venditore extends User {

    @OneToMany(mappedBy = "venditore", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Prodotto> prodotti = new HashSet<>();

}
