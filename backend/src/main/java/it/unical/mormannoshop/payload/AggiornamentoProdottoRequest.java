package it.unical.mormannoshop.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AggiornamentoProdottoRequest {
    
    @NotBlank(message = "Il nome del prodotto è obbligatorio")
    private String nome;
    
    private String descrizione;
    
    @NotNull(message = "Il prezzo è obbligatorio")
    @Positive(message = "Il prezzo deve essere positivo")
    private Double prezzo;
    
    @NotNull(message = "La quantità è obbligatoria")
    @Positive(message = "La quantità deve essere positiva")
    private Integer quantita;
    
    @NotBlank(message = "La categoria è obbligatoria")
    private String categoria;
    
    private String immagineUrl;

    // Costruttori
    public AggiornamentoProdottoRequest() {}

    public AggiornamentoProdottoRequest(String nome, String descrizione, Double prezzo, 
                                       Integer quantita, String categoria, String immagineUrl) {
        this.nome = nome;
        this.descrizione = descrizione;
        this.prezzo = prezzo;
        this.quantita = quantita;
        this.categoria = categoria;
        this.immagineUrl = immagineUrl;
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Double prezzo) {
        this.prezzo = prezzo;
    }

    public Integer getQuantita() {
        return quantita;
    }

    public void setQuantita(Integer quantita) {
        this.quantita = quantita;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getImmagineUrl() {
        return immagineUrl;
    }

    public void setImmagineUrl(String immagineUrl) {
        this.immagineUrl = immagineUrl;
    }

    @Override
    public String toString() {
        return "AggiornamentoProdottoRequest{" +
                "nome='" + nome + '\'' +
                ", descrizione='" + descrizione + '\'' +
                ", prezzo=" + prezzo +
                ", quantita=" + quantita +
                ", categoria='" + categoria + '\'' +
                ", immagineUrl='" + immagineUrl + '\'' +
                '}';
    }
}