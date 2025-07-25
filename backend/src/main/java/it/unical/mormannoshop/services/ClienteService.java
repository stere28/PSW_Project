package it.unical.mormannoshop.services;

import it.unical.mormannoshop.entities.Cliente;
import it.unical.mormannoshop.entities.Ordine;
import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.repositories.ClienteRepository;
import it.unical.mormannoshop.repositories.OrdineRepository;
import it.unical.mormannoshop.repositories.ProdottoRepository;
import it.unical.mormannoshop.utils.events.ProdottoVendutoEvent;
import it.unical.mormannoshop.utils.exceptions.ClienteNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonDisponibileException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonTrovatoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
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

        if (prodotto.isVenduto()) {
            throw new ProdottoNonDisponibileException(idProdotto);
        }

        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new ClienteNonTrovatoException(idCliente));

        cliente.aggiungiAlCarrello(prodotto);
        clienteRepository.save(cliente);
    }

    @Transactional//(isolation = Isolation.READ_COMMITTED)
    public void rimuoviProdottoDalCarrello(Long idProdotto, String idCliente) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new ClienteNonTrovatoException(idCliente));

        Prodotto prodotto = prodottoRepository.findById(idProdotto)
                .orElseThrow(() -> new ProdottoNonTrovatoException(idProdotto));

        cliente.rimuoviDalCarrello(prodotto);
        clienteRepository.save(cliente);
    }

    @Transactional(readOnly = true)
    public Set<Prodotto> getCarrello(String idCliente) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new ClienteNonTrovatoException(idCliente));
        return cliente.getProdotti();
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void checkout(String idCliente) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new ClienteNonTrovatoException(idCliente));

        Set<Prodotto> carrello = cliente.getProdotti();

        if (carrello.isEmpty()) {
            throw new IllegalStateException("Il carrello è vuoto");
        }

        // Crea un nuovo ordine
        Ordine ordine = new Ordine();
        ordine.setCliente(cliente);
        ordine.setProdotti(new HashSet<>(carrello));
        ordine = ordineRepository.save(ordine);

        // Verifica che tutti i prodotti siano ancora disponibili
        // Marca tutti i prodotti come venduti e associali all'ordine
        for (Prodotto prodotto : carrello) {
            Prodotto prodottoAggiornato = prodottoRepository.findById(prodotto.getId())
                    .orElseThrow(() -> new ProdottoNonTrovatoException(prodotto.getId()));

            if (prodottoAggiornato.isVenduto()) {
                throw new ProdottoNonDisponibileException(prodotto.getId());
            }

            prodotto.setVenduto(true);
            prodotto.setOrdine(ordine);
            prodottoRepository.save(prodotto);

            //notifica vendita dei prodotti ai venditori
            publisher.publishEvent(new ProdottoVendutoEvent(this, prodotto, prodotto.getVenditore()));
        }

        // Svuota il carrello
        cliente.svuotaCarrello();
        clienteRepository.save(cliente);
    }

}

