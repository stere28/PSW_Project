package it.unical.mormannoshop.utils.specifications;

import it.unical.mormannoshop.entities.Prodotto;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ProdottoSpecifications {

    public static Specification<Prodotto> withFilters(String text, String categoria, Double minPrice, Double maxPrice) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categoria != null && !categoria.isEmpty()) {
                predicates.add(cb.equal(root.get("categoria"), categoria));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("prezzo"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("prezzo"), maxPrice));
            }

            if (text != null && !text.isEmpty()) {
                String pattern = "%" + text.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nome")), pattern),
                        cb.like(cb.lower(root.get("descrizione")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
