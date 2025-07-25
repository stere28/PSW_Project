package it.unical.mormannoshop.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(requests -> {
                    // Endpoint pubblici
                    requests.requestMatchers("/login/**", "/actuator/health").permitAll();
                    requests.requestMatchers("/API/prodotti/**").permitAll();

                    // Endpoint che richiedono ruolo 'user' (clienti)
                    requests.requestMatchers("/API/carrello/**").hasRole("user");
                    requests.requestMatchers("/API/user/**").hasRole("user");

                    // Endpoint che richiedono ruolo 'venditore'
                    requests.requestMatchers("/API/venditore/**").hasRole("venditore");

                    // Tutti gli altri endpoint richiedono autenticazione
                    requests.anyRequest().authenticated();
                })
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(new KeycloakTokenConverter())
                        )
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permettere il frontend locale durante lo sviluppo
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*"));

        // Metodi HTTP permessi
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers permessi
        configuration.setAllowedHeaders(List.of("*"));

        // Permettere le credenziali (importante per JWT)
        configuration.setAllowCredentials(true);

        // Headers esposti al frontend
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}