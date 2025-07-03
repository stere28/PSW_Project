package it.unical.mormannoshop.repositories;

import it.unical.mormannoshop.entities.Prodotto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProdottoRepository extends JpaRepository<Prodotto, Long>,
        JpaSpecificationExecutor<Prodotto> { }