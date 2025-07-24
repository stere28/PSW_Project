package it.unical.mormannoshop.utils.events;

import it.unical.mormannoshop.entities.Prodotto;
import it.unical.mormannoshop.entities.Venditore;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ProdottoVendutoEvent extends ApplicationEvent
{
    private final Prodotto prodotto;

    private final Venditore venditore;
    public ProdottoVendutoEvent(Object source, Prodotto prodotto, Venditore venditore)
    {
        super(source);
        this.prodotto = prodotto;
        this.venditore = venditore;
    }
}
