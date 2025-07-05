package it.unical.mormannoshop.utils.exceptions;

public class ProdottoNonDisponibileException extends RuntimeException {
    public ProdottoNonDisponibileException(Long idProdotto) {
        super("Prodotto non disponibile: " + idProdotto);
    }
}
