package it.unical.mormannoshop.utils.exceptions;

public class VenditoreNonTrovatoException extends RuntimeException
{
    public VenditoreNonTrovatoException(String idVenditore) {
        super("Venditore non trovato: " + idVenditore);
    }
}
