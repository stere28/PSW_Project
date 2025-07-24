package it.unical.mormannoshop.utils.listeners;

import it.unical.mormannoshop.entities.Notifica;
import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.entities.Venditore;
import it.unical.mormannoshop.repositories.NotificaRepository;
import it.unical.mormannoshop.utils.events.ProdottoVendutoEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class PurchaseListener
{
    @Autowired
    private NotificaRepository repository;

    @EventListener
    public void notificaAcquisto(ProdottoVendutoEvent event)
    {
        Venditore venditore = event.getVenditore();
        Prodotto prodotto = event.getProdotto();

        Notifica notifica = new Notifica();
        notifica.setTesto("Prodotto: " + prodotto.getId() + " venduto");
        notifica.setVenditore(venditore);
        repository.save(notifica);

        venditore.getNotifiche().add(notifica);
    }

}
