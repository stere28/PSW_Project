package it.unical.mormannoshop.repositories;

import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.entities.Venditore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProdottoRepository extends JpaRepository<Prodotto, Long>,
        JpaSpecificationExecutor<Prodotto> {

    List<Prodotto> findByVenditoreAndVenduto(Venditore venditore, boolean venduto);


}