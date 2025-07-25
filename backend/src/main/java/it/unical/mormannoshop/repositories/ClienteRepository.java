package it.unical.mormannoshop.repositories;

import it.unical.mormannoshop.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente,String> {
}
