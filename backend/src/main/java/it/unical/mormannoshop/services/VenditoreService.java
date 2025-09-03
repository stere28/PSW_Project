package it.unical.mormannoshop.services;

import it.unical.mormannoshop.entities.Cliente;
import it.unical.mormannoshop.entities.Notifica;
import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.entities.Venditore;
import it.unical.mormannoshop.payload.AggiuntaProdottoRequest;
import it.unical.mormannoshop.repositories.ProdottoRepository;
import it.unical.mormannoshop.repositories.VenditoreRepository;
import it.unical.mormannoshop.utils.exceptions.ProdottoGiaVendutoException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonAppartieneAlVenditoreException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonTrovatoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;

@Service
public class VenditoreService
{

    @Autowired
    private ProdottoRepository prodottoRepository;

    @Autowired
    private VenditoreRepository venditoreRepository;

    @Transactional
    public Venditore getProfilo(Authentication authentication)
    {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            String userId = jwt.getSubject();
            return venditoreRepository.findById(userId)
                    .orElseGet(() -> venditoreRepository.save(creaVenditore(userId)));
        }
        throw new IllegalStateException("Impossibile determinare l'ID utente dal JWT");
    }

    @Transactional
    public Prodotto aggiungiProdotto(String idVenditore, AggiuntaProdottoRequest request)
    {
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseGet(() -> venditoreRepository.save(creaVenditore(idVenditore)));

        Prodotto prodotto = Prodotto.builder()
                .venditore(venditore)
                .nome(request.getNome())
                .descrizione(request.getDescrizione())
                .prezzo(request.getPrezzo())
                .venduto(false)
                .build();

        return prodottoRepository.save(prodotto);
    }

    @Transactional
    public List<Prodotto> getProdottiInVendita(String idVenditore)
    {
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseGet(() -> venditoreRepository.save(creaVenditore(idVenditore)));
        return prodottoRepository.findByVenditoreAndVenduto(venditore,false);
    }

    @Transactional
    public List<Prodotto> getProdottiVenduti(String idVenditore)
    {
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseGet(() -> venditoreRepository.save(creaVenditore(idVenditore)));
        return prodottoRepository.findByVenditoreAndVenduto(venditore,true);
    }

    @Transactional
    public List<Notifica> getNotifiche(String idVenditore)
    {
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseGet(() -> venditoreRepository.save(creaVenditore(idVenditore)));
        return venditore.getNotifiche();
    }

    private Venditore creaVenditore(String idVenditore) {
        if (venditoreRepository.existsById(idVenditore)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Venditore già registrato");
        }

        Venditore venditore = new Venditore();
        venditore.setId(idVenditore);
        return venditoreRepository.save(venditore);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void eliminaProdotto(String idVenditore, Long idProdotto) {
        // Verifica che il venditore esista
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseGet(() -> venditoreRepository.save(creaVenditore(idVenditore)));

        // Verifica che il prodotto esista
        Prodotto prodotto = prodottoRepository.findById(idProdotto)
                .orElseThrow(() -> new ProdottoNonTrovatoException(idProdotto));

        // Verifica che il prodotto appartenga al venditore
        if (!prodotto.getVenditore().getId().equals(idVenditore)) {
            throw new ProdottoNonAppartieneAlVenditoreException(
                    "Il prodotto con ID " + idProdotto + " non appartiene al venditore " + idVenditore
            );
        }

        // Verifica che il prodotto non sia già stato venduto
        if (prodotto.isVenduto()) {
            throw new ProdottoGiaVendutoException(
                    "Non è possibile eliminare il prodotto con ID " + idProdotto + " perché è già stato venduto"
            );
        }

        for (Cliente cliente : new HashSet<>(prodotto.getClienti())) {
            cliente.rimuoviDalCarrello(prodotto);
        }

        prodottoRepository.delete(prodotto);
    }
}
