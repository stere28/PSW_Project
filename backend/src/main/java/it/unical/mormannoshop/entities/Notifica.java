package it.unical.mormannoshop.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "notifica")
public class Notifica
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String testo;

    @ManyToOne
    @JsonIgnore
    private Venditore venditore;
}
