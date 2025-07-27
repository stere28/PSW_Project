package it.unical.mormannoshop.services;

import it.unical.mormannoshop.entities.Notifica;
import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.entities.Venditore;
import it.unical.mormannoshop.payload.AggiuntaProdottoRequest;
import it.unical.mormannoshop.repositories.ProdottoRepository;
import it.unical.mormannoshop.repositories.VenditoreRepository;
import it.unical.mormannoshop.utils.exceptions.ProdottoGiaVendutoException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonAppartieneAlVenditoreException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.VenditoreNonTrovatoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class VenditoreService
{

    @Autowired
    private ProdottoRepository prodottoRepository;

    @Autowired
    private VenditoreRepository venditoreRepository;

    public Prodotto aggiungiProdotto(String idVenditore, AggiuntaProdottoRequest request)
    {
        Venditore venditore = venditoreRepository.findById(idVenditore)
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

    public List<Prodotto> getProdottiInVendita(String idVenditore)
    {
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseThrow(() -> new VenditoreNonTrovatoException(idVenditore));
        return prodottoRepository.findByVenditoreAndVenduto(venditore,false);
    }

    public List<Prodotto> getProdottiVenduti(String idVenditore)
    {
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseThrow(() -> new VenditoreNonTrovatoException(idVenditore));
        return prodottoRepository.findByVenditoreAndVenduto(venditore,true);
    }

    public List<Notifica> getNotifiche(String idVenditore)
    {
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseThrow(() -> new VenditoreNonTrovatoException(idVenditore));
        return venditore.getNotifiche();
    }

    public void creaVenditore(String idVenditore) {
        if (venditoreRepository.existsById(idVenditore)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Venditore già registrato");
        }

        Venditore venditore = new Venditore();
        venditore.setId(idVenditore);

        venditoreRepository.save(venditore);
    }

    public void eliminaProdotto(String idVenditore, Long idProdotto) {
        // Verifica che il venditore esista
        Venditore venditore = venditoreRepository.findById(idVenditore)
                .orElseThrow(() -> new VenditoreNonTrovatoException(idVenditore));

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

        prodottoRepository.delete(prodotto);
    }
}
