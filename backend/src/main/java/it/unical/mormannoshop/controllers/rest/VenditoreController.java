package it.unical.mormannoshop.controllers.rest;

import it.unical.mormannoshop.entities.Notifica;
import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.payload.AggiuntaProdottoRequest;
import it.unical.mormannoshop.payload.AggiuntaProdottoResponse;
import it.unical.mormannoshop.services.VenditoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

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

    @GetMapping("/{idVenditore}/prodotti/in-vendita")
    public ResponseEntity<List<Prodotto>> getProdottiInVendita(@PathVariable Long idVenditore)
    {
        List<Prodotto> prodotti = venditoreService.getProdottiInVendita(idVenditore);
        return ResponseEntity.ok(prodotti);
    }

//    @GetMapping("/{idVenditore/notifiche}")
//    public ResponseEntity<List<Notifica>> getNotifiche(@PathVariable Long idVenditore)
//    {
//        List<Notifica> notifiche = venditoreService.getNotifiche(idVenditore);
//        return ResponseEntity.ok(notifiche);
//    }
    //TODO per natale mi da un problema

    @GetMapping("/{idVenditore}/prodotti/venduti")
    public ResponseEntity<List<Prodotto>> getProdottiVenduti(@PathVariable Long idVenditore)
    {
        List<Prodotto> prodotti = venditoreService.getProdottiVenduti(idVenditore);
        return ResponseEntity.ok(prodotti);
    }

}
