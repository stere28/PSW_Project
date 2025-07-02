package it.unical.mormannoshop.services;

import it.unical.mormannoshop.entities.Prodotto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdottiService {
    public List<Prodotto> getAll() {
        //TODO
    }

    public List<Prodotto> getAll(int pageNumber, int pageSize, String sortBy) {
        //TODO
    }

    public ResponseEntity getByText(String text) {
        //TODO
    }

    public List<Prodotto> filterProducts(String categoria,
                                         Double minPrice,
                                         Double maxPrice,
                                         String sortBy,
                                         int pageNumber,
                                         int pageSize) {
        //TODO
    }
}