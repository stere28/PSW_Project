package it.unical.mormannoshop.controllers.rest;

import it.unical.mormannoshop.utils.exceptions.ClienteNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonDisponibileException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.VenditoreNonTrovatoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProdottoNonTrovatoException.class)
    public ResponseEntity<String> handleProdottoNonTrovato(ProdottoNonTrovatoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(ProdottoNonDisponibileException.class)
    public ResponseEntity<String> handleProdottoNonDisponibile(ProdottoNonDisponibileException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(ClienteNonTrovatoException.class)
    public ResponseEntity<String> handleClienteNonTrovato(ClienteNonTrovatoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // Fallback generico
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleEccezioneGenerica(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Errore interno: " + ex.getMessage());
    }

    @ExceptionHandler(VenditoreNonTrovatoException.class)
    public ResponseEntity<String> handleVenditoreNonTrovato(VenditoreNonTrovatoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
