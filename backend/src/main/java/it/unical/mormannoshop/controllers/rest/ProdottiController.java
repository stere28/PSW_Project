package it.unical.mormannoshop.controllers.rest;

import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.payload.AggiuntaProdottoRequest;
import it.unical.mormannoshop.payload.AggiuntaProdottoResponse;
import it.unical.mormannoshop.services.ProdottiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("API/prodotti")
public class ProdottiController {
    @Autowired
    private ProdottiService prodottiService;

    @GetMapping
    public List<Prodotto> getAll() {
        return prodottiService.getAll();
    }
    @GetMapping("/paged")
    public List<Prodotto> getAll(@RequestParam(defaultValue = "0") int pageNumber,
                                 @RequestParam(defaultValue = "10") int pageSize,
                                 @RequestParam(defaultValue = "id") String sortBy) {
        return prodottiService.getAll(pageNumber, pageSize, sortBy);
    }

    @GetMapping("/filter")
    public List<Prodotto> filterProducts(
            @RequestParam(required = false) String text,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "true") Boolean escludiVenduti) {

        return prodottiService.filterProducts(text, categoria, minPrice, maxPrice, sortBy, pageNumber, pageSize, escludiVenduti);
    }
    //TODO potrebbe essere utile usare ResponseEntity
}
