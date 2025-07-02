package it.unical.mormannoshop.repositories;

import it.unical.mormannoshop.entities.Prodotto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdottoRepository extends JpaRepository<Prodotto,Long> {
}
