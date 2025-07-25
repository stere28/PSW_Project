package it.unical.mormannoshop.entities;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED) // @Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class User {

    @Id
    private String id;
}
