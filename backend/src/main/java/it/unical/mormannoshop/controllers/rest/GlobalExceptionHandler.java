package it.unical.mormannoshop.controllers.rest;

import it.unical.mormannoshop.utils.exceptions.ClienteNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonDisponibileException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.VenditoreNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonAppartieneAlVenditoreException;
import it.unical.mormannoshop.utils.exceptions.ProdottoGiaVendutoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //TODO Esposizione di Informazioni Sensibili

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

    @ExceptionHandler(VenditoreNonTrovatoException.class)
    public ResponseEntity<String> handleVenditoreNonTrovato(VenditoreNonTrovatoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(ProdottoNonAppartieneAlVenditoreException.class)
    public ResponseEntity<String> handleProdottoNonAppartieneAlVenditore(ProdottoNonAppartieneAlVenditoreException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(ProdottoGiaVendutoException.class)
    public ResponseEntity<String> handleProdottoGiaVenduto(ProdottoGiaVendutoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // Gestione errori di validazione
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // Fallback generico
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleEccezioneGenerica(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Errore interno: " + ex.getMessage());
    }
}