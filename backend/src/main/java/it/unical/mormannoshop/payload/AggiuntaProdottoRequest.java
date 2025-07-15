package it.unical.mormannoshop.payload;

import lombok.Data;

@Data
public class AggiuntaProdottoRequest
{
    private String nome;

    private String descrizione;

    private double prezzo;

}
