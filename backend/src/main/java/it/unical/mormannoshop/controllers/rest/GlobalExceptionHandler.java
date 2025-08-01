package it.unical.mormannoshop.controllers.rest;

import it.unical.mormannoshop.utils.exceptions.ClienteNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonDisponibileException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.VenditoreNonTrovatoException;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonAppartieneAlVenditoreException;
import it.unical.mormannoshop.utils.exceptions.ProdottoGiaVendutoException;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Classe per le risposte di errore strutturate
    @Getter
    public static class ErrorResponse {
        private final LocalDateTime timestamp;
        private final int status;
        private final String error;
        private final String message;
        private final String path;
        private final Object details;

        public ErrorResponse(int status, String error, String message, String path, Object details) {
            this.timestamp = LocalDateTime.now();
            this.status = status;
            this.error = error;
            this.message = message;
            this.path = path;
            this.details = details;
        }
    }

    @ExceptionHandler(ProdottoNonTrovatoException.class)
    public ResponseEntity<ErrorResponse> handleProdottoNonTrovato(
            ProdottoNonTrovatoException ex,
            HttpServletRequest request) {

        log.warn("Prodotto non trovato: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Prodotto non trovato",
                "Il prodotto richiesto non è stato trovato nel sistema",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(ProdottoNonDisponibileException.class)
    public ResponseEntity<ErrorResponse> handleProdottoNonDisponibile(
            ProdottoNonDisponibileException ex,
            HttpServletRequest request) {

        log.warn("Prodotto non disponibile: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "Prodotto non disponibile",
                "Il prodotto selezionato non è più disponibile",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(ClienteNonTrovatoException.class)
    public ResponseEntity<ErrorResponse> handleClienteNonTrovato(
            ClienteNonTrovatoException ex,
            HttpServletRequest request) {

        log.warn("Cliente non trovato: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Cliente non trovato",
                "Il cliente specificato non è stato trovato",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(VenditoreNonTrovatoException.class)
    public ResponseEntity<ErrorResponse> handleVenditoreNonTrovato(
            VenditoreNonTrovatoException ex,
            HttpServletRequest request) {

        log.warn("Venditore non trovato: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Venditore non trovato",
                "Il venditore specificato non è stato trovato",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(ProdottoNonAppartieneAlVenditoreException.class)
    public ResponseEntity<ErrorResponse> handleProdottoNonAppartieneAlVenditore(
            ProdottoNonAppartieneAlVenditoreException ex,
            HttpServletRequest request) {

        log.warn("Accesso negato al prodotto: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "Accesso negato",
                "Non hai i permessi per accedere a questo prodotto",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(ProdottoGiaVendutoException.class)
    public ResponseEntity<ErrorResponse> handleProdottoGiaVenduto(
            ProdottoGiaVendutoException ex,
            HttpServletRequest request) {

        log.warn("Operazione su prodotto venduto: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "Prodotto già venduto",
                "Non è possibile modificare un prodotto già venduto",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    // Gestione errori di validazione
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        log.warn("Errori di validazione: {}", ex.getMessage());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Errori di validazione",
                "I dati forniti non sono validi",
                request.getRequestURI(),
                errors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // Gestione errori di tipo argomento
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request) {

        log.warn("Tipo di argomento non valido: {}", ex.getMessage());

        ex.getRequiredType();
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Parametro non valido",
                String.format("Il parametro '%s' deve essere di tipo %s",
                        ex.getName(),
                        ex.getRequiredType().getSimpleName()),
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // Gestione errori di sicurezza
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {

        log.warn("Accesso negato: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "Accesso negato",
                "Non hai i permessi necessari per accedere a questa risorsa",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientAuthentication(
            InsufficientAuthenticationException ex,
            HttpServletRequest request) {

        log.warn("Autenticazione insufficiente: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "Autenticazione richiesta",
                "È necessario effettuare il login per accedere a questa risorsa",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    // Gestione errori di stato illegale
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(
            IllegalStateException ex,
            HttpServletRequest request) {

        log.warn("Stato illegale: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "Operazione non valida",
                ex.getMessage(),
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    // Gestione errori di argomento illegale
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request) {

        log.warn("Argomento illegale: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Parametri non validi",
                ex.getMessage(),
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // Fallback generico per tutte le altre eccezioni
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleEccezioneGenerica(
            Exception ex,
            HttpServletRequest request) {

        log.error("Errore interno del server", ex);

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Errore interno del server",
                "Si è verificato un errore imprevisto. Riprova più tardi.",
                request.getRequestURI(),
                null
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}