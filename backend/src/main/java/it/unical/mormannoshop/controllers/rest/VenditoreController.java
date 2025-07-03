package it.unical.mormannoshop.controllers.rest;

import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.payload.AggiuntaProdottoRequest;
import it.unical.mormannoshop.payload.AggiuntaProdottoResponse;
import it.unical.mormannoshop.services.VenditoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("API/venditore")
public class VenditoreController
{
    @Autowired
    private VenditoreService venditoreService;

    @PostMapping("/prodotti/aggiunta")
    public ResponseEntity<AggiuntaProdottoResponse> aggiungiProdotto(@RequestBody AggiuntaProdottoRequest request)
    {
        Prodotto prodotto = venditoreService.aggiungiProdotto(request);

        URI location = URI.create("/API/prodotti/" + prodotto.getId());

        return ResponseEntity
                .created(location)
                .body(new AggiuntaProdottoResponse(prodotto.getId()));
    }

    //LISTA NOTIFICHE
    //PRODOTTI IN VENDITA
    //pRODOTTI VENDUTI

}
