package it.unical.mormannoshop.security;

import lombok.NonNull;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class KeycloakTokenConverter implements Converter<Jwt, AbstractAuthenticationToken>
{

    //TODO controllare

    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    public KeycloakTokenConverter()
    {
        this.jwtAuthenticationConverter = new JwtAuthenticationConverter();
    }

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt)
    {
        return jwtAuthenticationConverter.convert(jwt);
    }

    private Collection<? extends GrantedAuthority> extractRolesFromRealmAccess(Jwt jwt)
    {
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");

        if(realmAccess != null && realmAccess.containsKey("roles"))
        {
            List<String> roles = (List<String>) realmAccess.getOrDefault("roles", List.of());

            // Logging per verificare i ruoli estratti
            System.out.println("Ruoli estratti da realm_access: " + roles);

            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toLowerCase()))
                    .collect(Collectors.toList());
        }

        return null;

    }
}
