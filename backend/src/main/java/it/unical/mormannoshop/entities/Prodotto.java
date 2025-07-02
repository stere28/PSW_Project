package it.unical.mormannoshop.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "prodotti")
public class Prodotto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venditore_id", nullable = false)
    @JsonIgnore
    private Venditore venditore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordine_id")
    @JsonIgnore
    private Ordine ordine;

    @ManyToMany(mappedBy = "prodotti")
    @JsonIgnore
    private Set<Cliente> clienti = new HashSet<>();

    //TODO EAN
    private String nome;

    private String descrizione;

    private double prezzo;

    private boolean venduto;
}
