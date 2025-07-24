package it.unical.mormannoshop.utils.exceptions;

public class ProdottoNonTrovatoException extends RuntimeException {
    public ProdottoNonTrovatoException(Long idProdotto) {
        super("Prodotto non trovato: " + idProdotto);
    }
}