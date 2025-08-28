package it.unical.mormannoshop.services;

import it.unical.mormannoshop.entities.Cliente;
import it.unical.mormannoshop.entities.Ordine;
import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.repositories.ClienteRepository;
import it.unical.mormannoshop.repositories.OrdineRepository;
import it.unical.mormannoshop.repositories.ProdottoRepository;
import it.unical.mormannoshop.utils.events.ProdottoVendutoEvent;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonDisponibileException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonTrovatoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Set;

@Service
public class ClienteService {
    @Autowired
    private  ClienteRepository clienteRepository;

    @Autowired
    private  ProdottoRepository prodottoRepository;

    @Autowired
    private OrdineRepository ordineRepository;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Transactional//(isolation = Isolation.READ_COMMITTED)
    public void aggiungiProdottoAlCarrello(Long idProdotto, String idCliente) {
        Prodotto prodotto = prodottoRepository.findById(idProdotto)
                .orElseThrow(() -> new ProdottoNonTrovatoException(idProdotto));

        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseGet(() -> creaCliente(idCliente));

        if (prodotto.isVenduto()) {
            throw new ProdottoNonDisponibileException(idProdotto);
        }

        cliente.aggiungiAlCarrello(prodotto);
        clienteRepository.save(cliente);
    }

    @Transactional//(isolation = Isolation.READ_COMMITTED)
    public void rimuoviProdottoDalCarrello(Long idProdotto, String idCliente) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseGet(() -> creaCliente(idCliente));

        Prodotto prodotto = prodottoRepository.findById(idProdotto)
                .orElseThrow(() -> new ProdottoNonTrovatoException(idProdotto));

        cliente.rimuoviDalCarrello(prodotto);
        clienteRepository.save(cliente); //TODO non serve
    }

    @Transactional(readOnly = true)
    public Set<Prodotto> getCarrello(String idCliente) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseGet(() -> creaCliente(idCliente));
        return cliente.getProdotti();
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void checkout(String idCliente) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseGet(() -> creaCliente(idCliente));

        Set<Prodotto> carrello = cliente.getProdotti();

        if (carrello.isEmpty()) {
            throw new IllegalStateException("Il carrello è vuoto");
        }

        // Crea nuovo ordine
        Ordine ordine = new Ordine();
        ordine.setCliente(cliente);

        cliente.getOrdini().add(ordine);

        Set<Prodotto> prodottiVenduti = new HashSet<>();

        for (Prodotto p : carrello) {
            Prodotto prodottoDb = prodottoRepository.findById(p.getId())
                    .orElseThrow(() -> new ProdottoNonTrovatoException(p.getId()));

            if (prodottoDb.isVenduto()) {
                throw new ProdottoNonDisponibileException(p.getId());
            }

            prodottoDb.setVenduto(true);
            prodottoDb.setOrdine(ordine);
            prodottoDb.getClienti().remove(cliente);
            prodottiVenduti.add(prodottoDb);

            publisher.publishEvent(new ProdottoVendutoEvent(this, prodottoDb, prodottoDb.getVenditore()));
        }

        ordine.setProdotti(prodottiVenduti);
        ordineRepository.save(ordine);
        cliente.svuotaCarrello();
    }

    public Cliente creaCliente(String idCliente) {
        if (clienteRepository.existsById(idCliente)) {
            throw new IllegalStateException("Cliente con ID " + idCliente + " già esistente."); //TODO
        }

        Cliente cliente = new Cliente();
        cliente.setId(idCliente);
        clienteRepository.save(cliente);
        return cliente;
    }

    public Cliente getProfilo(String idCliente) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseGet(() -> creaCliente(idCliente));
        return cliente;
    }
}

