package it.unical.mormannoshop.controllers.rest;


import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.services.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/API/{idCliente}")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/carrello/add")
    public Set<Prodotto> aggiungiAlCarrello(
            @PathVariable Long idCliente,
            @RequestParam Long idProdotto) {
        clienteService.aggiungiProdottoAlCarrello(idProdotto, idCliente);
        return clienteService.getCarrello(idCliente);
    }

    @DeleteMapping("/carrello/remove")
    public Set<Prodotto> rimuoviDalCarrello(
            @PathVariable Long idCliente,
            @RequestParam Long idProdotto) {
        clienteService.rimuoviProdottoDalCarrello(idProdotto, idCliente);
        return clienteService.getCarrello(idCliente);
    }

    @GetMapping("/carrello")
    public Set<Prodotto> visualizzaCarrello(@PathVariable Long idCliente) {
        return clienteService.getCarrello(idCliente);
    }

    @PostMapping("/carrello/checkout")
    public ResponseEntity<?> checkout(@PathVariable Long idCliente) {
        clienteService.checkout(idCliente);
        return ResponseEntity.ok("Checkout completato con successo.");
    }
}

