package it.unical.mormannoshop.utils.exceptions;

public class ProdottoGiaVendutoException extends RuntimeException {
    public ProdottoGiaVendutoException(String message) {
        super(message);
    }

    public ProdottoGiaVendutoException(String message, Throwable cause) {
        super(message, cause);
    }
