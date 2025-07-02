package it.unical.mormannoshop.services;

import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.entities.Venditore;
import it.unical.mormannoshop.payload.AggiuntaProdottoRequest;
import it.unical.mormannoshop.repositories.ProdottoRepository;
import it.unical.mormannoshop.repositories.VenditoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VenditoreService
{
    @Autowired
    private ProdottoRepository prodottoRepository;

    @Autowired
    private VenditoreRepository venditoreRepository;

    public Prodotto aggiungiProdotto(AggiuntaProdottoRequest request)
    {
        Venditore venditore = venditoreRepository.findById(request.getIdVenditore())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venditore non registrato"));

        Prodotto prodotto = Prodotto.builder()
                .venditore(venditore)
                .nome(request.getNome())
                .descrizione(request.getDescrizione())
                .prezzo(request.getPrezzo())
                .venduto(false)
                .build();

        return prodottoRepository.save(prodotto);
    }
}
