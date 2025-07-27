package it.unical.mormannoshop.utils.exceptions;

public class ProdottoNonAppartieneAlVenditoreException extends RuntimeException {
    public ProdottoNonAppartieneAlVenditoreException(String message) {
        super(message);
    }

    public ProdottoNonAppartieneAlVenditoreException(String message, Throwable cause) {
        super(message, cause);
    }
}
