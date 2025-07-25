package it.unical.mormannoshop.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class JwtUtils {

    /**
     * Estrae il JWT dall'oggetto Authentication
     */
    public static Jwt extractJwt(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt)) {
            throw new IllegalArgumentException("Token JWT non valido o mancante");
        }
        return (Jwt) authentication.getPrincipal();
    }

    /**
     * Estrae l'ID utente dal subject del JWT
     */
    public static String getUserId(Authentication authentication) {
        Jwt jwt = extractJwt(authentication);
        return jwt.getSubject();
    }

    /**
     * Estrae l'username dal JWT
     */
    public static String getUsername(Authentication authentication) {
        Jwt jwt = extractJwt(authentication);
        return jwt.getClaim("preferred_username");
    }

    /**
     * Estrae l'email dal JWT
     */
    public static String getEmail(Authentication authentication) {
        Jwt jwt = extractJwt(authentication);
        return jwt.getClaim("email");
    }

    /**
     * Estrae i ruoli dal JWT
     */
    @SuppressWarnings("unchecked")
    public static List<String> getRoles(Authentication authentication) {
        Jwt jwt = extractJwt(authentication);
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");

        if (realmAccess != null && realmAccess.containsKey("roles")) {
            return (List<String>) realmAccess.get("roles");
        }

        return List.of();
    }

    /**
     * Verifica se l'utente ha un ruolo specifico
     */
    public static boolean hasRole(Authentication authentication, String role) {
        List<String> roles = getRoles(authentication);
        return roles.contains(role);
    }

    /**
     * Ottiene tutte le informazioni utente dal JWT
     */
    public static Map<String, Object> getAllUserInfo(Authentication authentication) {
        Jwt jwt = extractJwt(authentication);
        return Map.of(
                "userId", jwt.getSubject(),
                "username", getUsername(authentication),
                "email", getEmail(authentication),
                "roles", getRoles(authentication),
                "fullClaims", jwt.getClaims()
        );
    }
}