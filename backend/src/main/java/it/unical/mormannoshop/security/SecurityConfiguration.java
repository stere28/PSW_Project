package it.unical.mormannoshop.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(requests -> {
                    requests.requestMatchers("/login/**", "/actuator/health").permitAll();
                    requests.requestMatchers("/API/prodotti/**").permitAll();
                    requests.requestMatchers("/API/*/carrello/**").hasRole("user");
                    requests.requestMatchers("/API/venditore/**").hasRole("venditore");
                    requests.anyRequest().authenticated();
                })
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(new KeycloakTokenConverter())
                        )
                );

        return http.build();
    }
}