package it.unical.mormannoshop.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true, onlyExplicitlyIncluded = true)
@Entity
@Table(name = "venditori")
public class Venditore extends User {

    @OneToMany(mappedBy = "venditore", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Prodotto> prodotti = new HashSet<>();

    @OneToMany
    @JsonIgnore
    private List<Notifica> notifiche = new LinkedList<>();

}
