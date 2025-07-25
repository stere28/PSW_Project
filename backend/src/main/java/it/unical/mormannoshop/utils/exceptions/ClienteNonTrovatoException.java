package it.unical.mormannoshop.utils.exceptions;

public class ClienteNonTrovatoException extends RuntimeException {
    public ClienteNonTrovatoException(String idCliente) {
        super("Cliente non trovato: " + idCliente);
    }
}
