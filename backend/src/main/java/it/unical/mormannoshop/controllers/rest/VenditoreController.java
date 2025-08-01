package it.unical.mormannoshop.controllers.rest;

import it.unical.mormannoshop.entities.Notifica;
import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.entities.Venditore;
import it.unical.mormannoshop.payload.AggiuntaProdottoRequest;
import it.unical.mormannoshop.payload.AggiuntaProdottoResponse;
import it.unical.mormannoshop.services.VenditoreService;
import it.unical.mormannoshop.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("API/venditore")
public class VenditoreController {

    @Autowired
    private VenditoreService venditoreService;

    @GetMapping("/me")
    public Venditore getProfilo(Authentication authentication)
    {
        return venditoreService.getOrCreate(authentication);
    }

    @PostMapping("/prodotti/aggiunta")
    public ResponseEntity<AggiuntaProdottoResponse> aggiungiProdotto(
            @RequestBody AggiuntaProdottoRequest request,
            Authentication authentication) {

        String idVenditore = JwtUtils.getUserId(authentication);
        Prodotto prodotto = venditoreService.aggiungiProdotto(idVenditore, request);

        URI location = URI.create("/API/prodotti/" + prodotto.getId());

        return ResponseEntity
                .created(location)
                .body(new AggiuntaProdottoResponse(prodotto.getId()));
    }

    @GetMapping("/prodotti/in-vendita")
    public ResponseEntity<List<Prodotto>> getProdottiInVendita(Authentication authentication) {
        String idVenditore = JwtUtils.getUserId(authentication);
        List<Prodotto> prodotti = venditoreService.getProdottiInVendita(idVenditore);

        return ResponseEntity.ok(prodotti);
    }

    @GetMapping("/notifiche")
    public ResponseEntity<List<Notifica>> getNotifiche(Authentication authentication) {
        String idVenditore = JwtUtils.getUserId(authentication);
        List<Notifica> notifiche = venditoreService.getNotifiche(idVenditore);

        return ResponseEntity.ok(notifiche);
    }

    @GetMapping("/prodotti/venduti")
    public ResponseEntity<List<Prodotto>> getProdottiVenduti(Authentication authentication) {
        String idVenditore = JwtUtils.getUserId(authentication);
        List<Prodotto> prodotti = venditoreService.getProdottiVenduti(idVenditore);

        return ResponseEntity.ok(prodotti);
    }

    @DeleteMapping("/prodotti/{idProdotto}")
    public ResponseEntity<String> eliminaProdotto(
            @PathVariable Long idProdotto,
            Authentication authentication) {

        String idVenditore = JwtUtils.getUserId(authentication);
        venditoreService.eliminaProdotto(idVenditore, idProdotto);

        return ResponseEntity.ok("Prodotto eliminato con successo.");
    }
}