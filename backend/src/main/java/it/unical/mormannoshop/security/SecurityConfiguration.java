package it.unical.mormannoshop.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    @Value("${app.cors.allowed-origins:http://localhost:8080,http://localhost:5173}")
    private List<String> allowedOrigins;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri:http://localhost:8080/realms/mormanno-shop/protocol/openid-connect/certs}")
    private String jwkSetUri;

    //TODO, errore di timeout nella connessione a keycloak da risolvere
    @Bean
    public JwtDecoder jwtDecoder() {
        try {
            return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
        } catch (Exception e) {
            System.err.println("Errore nella configurazione del JwtDecoder: " + e.getMessage());
            throw new RuntimeException("Impossibile configurare il JwtDecoder", e);
        }
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(requests -> {
                    // Endpoint pubblici
                    requests.requestMatchers("/actuator/health", "/actuator/info").permitAll();
                    requests.requestMatchers("/API/prodotti/**").permitAll();
                    requests.requestMatchers("/error").permitAll();

                    // Endpoint che richiedono ruolo 'user'
                    requests.requestMatchers("/API/carrello/**").hasRole("user");
                    requests.requestMatchers("/API/cliente/**").hasRole("user");

                    // Endpoint che richiedono ruolo 'venditore'
                    requests.requestMatchers("/API/venditore/**").hasRole("venditore");

                    // Tutti gli altri endpoint richiedono autenticazione
                    requests.anyRequest().authenticated();
                })
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(new KeycloakTokenConverter())
                        )
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            System.err.println("Authentication error: " + authException.getMessage());
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            System.err.println("Access denied: " + accessDeniedException.getMessage());
                            response.setStatus(403);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"Access denied\"}");
                        })
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origini permesse (configurabili)
        configuration.setAllowedOrigins(allowedOrigins);

        // Metodi HTTP permessi
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Headers permessi
        configuration.setAllowedHeaders(List.of("*"));

        // Permettere le credenziali (importante per JWT)
        configuration.setAllowCredentials(true);

        // Headers esposti al frontend
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));

        // Cache preflight per 1 ora
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}