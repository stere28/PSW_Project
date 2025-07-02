package it.unical.mormannoshop.controllers.rest;


import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.services.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("API/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/carrello/add")
    public ResponseEntity<?> aggiungiAlCarrello(@RequestParam Long idProdotto) {
        boolean successo = clienteService.aggiungiProdottoAlCarrello(idProdotto);
        if (successo) {
            return ResponseEntity.ok("Prodotto aggiunto al carrello.");
        } else {
            return ResponseEntity.badRequest().body("Errore nell'aggiunta al carrello.");
        }
    }


    @GetMapping("/carrello")
    public ResponseEntity<List<Prodotto>> visualizzaCarrello() {
        return ResponseEntity.ok(clienteService.getCarrello());
    }

    @PostMapping("/carrello/checkout")
    public ResponseEntity<?> checkout() {
        //TODO
    }
}

