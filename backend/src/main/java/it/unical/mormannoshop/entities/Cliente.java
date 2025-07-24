package it.unical.mormannoshop.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "clienti")
public class Cliente extends User {

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Ordine> ordini = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "carrello",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "prodotto_id")
    )
    @JsonIgnore
    private Set<Prodotto> prodotti = new HashSet<>();

    public void aggiungiAlCarrello(Prodotto prodotto) {
        this.prodotti.add(prodotto);
        prodotto.getClienti().add(this);
    }
    public void rimuoviDalCarrello(Prodotto prodotto) {
        this.prodotti.remove(prodotto);
        prodotto.getClienti().remove(this);
    }

    public void svuotaCarrello() {
        for (Prodotto prodotto : new HashSet<>(this.prodotti)) {
            prodotto.getClienti().remove(this);
        }
        this.prodotti.clear();
    }

}

