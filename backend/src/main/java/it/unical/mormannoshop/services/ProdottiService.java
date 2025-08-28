package it.unical.mormannoshop.services;

import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.repositories.ProdottoRepository;
import it.unical.mormannoshop.utils.specifications.ProdottoSpecifications;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ProdottiService {

    @Autowired
    private ProdottoRepository prodottoRepository;

    @Transactional(readOnly = true)
    public List<Prodotto> getAll() {
        return prodottoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Prodotto> getAll(int pageNumber, int pageSize, String sortBy) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy));
        return prodottoRepository.findAll(pageable).getContent();
    }

    @Transactional(readOnly = true)
    public List<Prodotto> filterProducts(String text, String categoria, Double minPrice, Double maxPrice, String sortBy, int pageNumber, int pageSize, boolean escludiVenduti) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy));
        Specification<Prodotto> spec = ProdottoSpecifications.withFilters(text, categoria, minPrice, maxPrice, escludiVenduti);
        return prodottoRepository.findAll(spec, pageable).getContent();
    }


}
