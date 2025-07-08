package it.unical.mormannoshop.entities;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {
    //TODO
    // @Inheritance(strategy = InheritanceType.TABLE_PER_CLASS) con @GeneratedValue(strategy = GenerationType.IDENTITY)
    // può causare problemi di performance e complessità.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
