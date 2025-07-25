package it.unical.mormannoshop.controllers.rest;

import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.services.ClienteService;
import it.unical.mormannoshop.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/API")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping("/carrello")
    public ResponseEntity<Set<Prodotto>> visualizzaCarrello(Authentication authentication) {
        String idCliente = JwtUtils.getUserId(authentication);
        Set<Prodotto> carrello = clienteService.getCarrello(idCliente);
        return ResponseEntity.ok(carrello);
    }

    @PostMapping("/carrello/add")
    public ResponseEntity<Set<Prodotto>> aggiungiAlCarrello(
            @RequestParam Long idProdotto,
            Authentication authentication) {

        String idCliente = JwtUtils.getUserId(authentication);
        clienteService.aggiungiProdottoAlCarrello(idProdotto, idCliente);
        Set<Prodotto> carrello = clienteService.getCarrello(idCliente);

        return ResponseEntity.ok(carrello);
    }

    @DeleteMapping("/carrello/remove")
    public ResponseEntity<Set<Prodotto>> rimuoviDalCarrello(
            @RequestParam Long idProdotto,
            Authentication authentication) {

        String idCliente = JwtUtils.getUserId(authentication);
        clienteService.rimuoviProdottoDalCarrello(idProdotto, idCliente);
        Set<Prodotto> carrello = clienteService.getCarrello(idCliente);

        return ResponseEntity.ok(carrello);
    }

    @PostMapping("/carrello/checkout")
    public ResponseEntity<String> checkout(Authentication authentication) {
        String idCliente = JwtUtils.getUserId(authentication);
        clienteService.checkout(idCliente);
        return ResponseEntity.ok("Checkout completato con successo.");
    }
    @PostMapping("/cliente")
    public ResponseEntity<String> creaCliente(Authentication authentication) {
        String idCliente = JwtUtils.getUserId(authentication);
        clienteService.creaCliente(idCliente);
        return ResponseEntity.ok("Cliente creato con successo.");
    }
}