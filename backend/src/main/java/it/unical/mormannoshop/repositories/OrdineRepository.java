package it.unical.mormannoshop.repositories;

import it.unical.mormannoshop.entities.Ordine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdineRepository extends JpaRepository<Ordine,Long> {
}
