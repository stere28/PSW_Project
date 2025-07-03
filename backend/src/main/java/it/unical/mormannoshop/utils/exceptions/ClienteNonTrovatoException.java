package it.unical.mormannoshop.utils.exceptions;

public static class ClienteNonTrovatoException extends RuntimeException {
    public ClienteNonTrovatoException(Long idCliente) {
        super("Cliente non trovato: " + idCliente);
    }
}
