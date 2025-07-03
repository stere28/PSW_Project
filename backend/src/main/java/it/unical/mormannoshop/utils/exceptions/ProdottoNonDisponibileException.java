package it.unical.mormannoshop.utils.exceptions;

public static class ProdottoNonDisponibileException extends RuntimeException {
    public ProdottoNonDisponibileException(Long idProdotto) {
        super("Prodotto non disponibile: " + idProdotto);
    }
}
