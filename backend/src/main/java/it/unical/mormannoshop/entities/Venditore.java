package it.unical.mormannoshop.entities;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.util.*;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "venditori")
public class Venditore extends User {

    @OneToMany(mappedBy = "venditore", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Prodotto> prodotti = new HashSet<>();

}
