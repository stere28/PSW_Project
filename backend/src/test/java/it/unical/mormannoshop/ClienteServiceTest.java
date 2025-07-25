package it.unical.mormannoshop;

import it.unical.mormannoshop.entities.*;
import it.unical.mormannoshop.repositories.*;
import it.unical.mormannoshop.services.ClienteService;
import it.unical.mormannoshop.services.ProdottiService;
import it.unical.mormannoshop.utils.exceptions.ProdottoNonDisponibileException;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
public class ClienteServiceTest {

    @Autowired
    private ClienteService clienteService;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private VenditoreRepository venditoreRepository;
    @Autowired
    private ProdottoRepository prodottoRepository;
    @Autowired
    private OrdineRepository ordineRepository;

    private static String cliente1Id, cliente2Id;
    private static Long prodottoId;

    @BeforeEach
    void setUp() {
        ordineRepository.deleteAll();
        prodottoRepository.deleteAll();
        clienteRepository.deleteAll();
        venditoreRepository.deleteAll();

        Venditore venditore = new Venditore();
        venditore.setId("venditore123");
        venditoreRepository.save(venditore);

        Cliente cliente1 = new Cliente();
        cliente1.setId("cliente1");
        Cliente cliente2 = new Cliente();
        cliente2.setId("cliente2");
        clienteRepository.save(cliente1);
        clienteRepository.save(cliente2);

        Prodotto prodotto = Prodotto.builder()
                .nome("Prodotto Test")
                .prezzo(10.0)
                .venduto(false)
                .venditore(venditore)
                .clienti(new HashSet<>()) // inizializza manualmente qui
                .build();

        prodottoRepository.save(prodotto);

        cliente1Id = cliente1.getId();
        cliente2Id = cliente2.getId();
        prodottoId = prodotto.getId();
    }

    @Test
    @Order(1)
    void testAggiuntaProdottoAlCarrelloEEffettuaCheckout() {
        // Aggiunta del prodotto al carrello
        clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente1Id);
        Set<Prodotto> carrello = clienteService.getCarrello(cliente1Id);
        assertEquals(1, carrello.size(), "Il carrello dovrebbe contenere 1 prodotto");

        // Verifica che il prodotto nel carrello sia quello giusto
        Prodotto prodottoNelCarrello = carrello.iterator().next();
        assertEquals(prodottoId, prodottoNelCarrello.getId(), "Il prodotto nel carrello non corrisponde a quello aggiunto");

        // Effettua il checkout
        clienteService.checkout(cliente1Id);

        // Verifica ordine creato correttamente
        Cliente cliente = clienteRepository.findById(cliente1Id).orElseThrow();
        assertEquals(1, cliente.getOrdini().size(), "Il cliente dovrebbe avere un ordine");

        Ordine ordine = cliente.getOrdini().iterator().next();
        assertNotNull(ordine.getId(), "L'ordine dovrebbe avere un ID");
        assertEquals(cliente1Id, ordine.getCliente().getId(), "Il cliente dell'ordine non corrisponde");

        // Verifica carrello svuotato
        assertTrue(cliente.getProdotti().isEmpty(), "Il carrello dovrebbe essere vuoto");

        // Verifica stato del prodotto
        Prodotto prodotto = prodottoRepository.findById(prodottoId).orElseThrow();
        assertTrue(prodotto.isVenduto(), "Il prodotto dovrebbe essere marcato come venduto");
        assertNotNull(prodotto.getOrdine(), "Il prodotto dovrebbe essere associato a un ordine");
        assertEquals(ordine.getId(), prodotto.getOrdine().getId(), "L'ordine associato non è corretto");

        // Verifica venditore
        assertNotNull(prodotto.getVenditore(), "Il venditore del prodotto non dovrebbe essere null");

        // Verifica il prodotto è presente nell'ordine
        assertTrue(ordine.getProdotti().contains(prodotto), "Il prodotto non è presente nell'ordine");

        // Prova a rifare il checkout con carrello vuoto → IllegalStateException
        IllegalStateException carrelloVuotoException = assertThrows(
                IllegalStateException.class,
                () -> clienteService.checkout(cliente1Id),
                "Il secondo checkout dovrebbe fallire (carrello vuoto)"
        );
        assertTrue(carrelloVuotoException.getMessage().contains("carrello"), "Messaggio d'errore errato per carrello vuoto");

        // Prova a inserire un prodotto già venduto → ProdottoNonDisponibileException
        String nuovoClienteId = "clienteExtra";
        Cliente nuovoCliente = new Cliente();
        nuovoCliente.setId(nuovoClienteId);
        clienteRepository.save(nuovoCliente);

        Prodotto prodottoVenduto = prodottoRepository.findById(prodottoId).orElseThrow();
        assertTrue(prodottoVenduto.isVenduto());

        ProdottoNonDisponibileException eccezioneProdottoVenduto = assertThrows(
                ProdottoNonDisponibileException.class,
                () -> clienteService.aggiungiProdottoAlCarrello(prodottoVenduto.getId(), nuovoClienteId),
                "Dovrebbe lanciare eccezione se il prodotto è già venduto"
        );
        assertTrue(eccezioneProdottoVenduto.getMessage().contains(prodottoId.toString()), "Messaggio errato per prodotto venduto");
    }


    @Test
    @Order(2)
    void testProdottoInPiuCarrelli() {
        clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente1Id);
        clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente2Id);

        Set<Prodotto> carrello1 = clienteService.getCarrello(cliente1Id);
        Set<Prodotto> carrello2 = clienteService.getCarrello(cliente2Id);

        assertTrue(carrello1.contains(prodottoRepository.findById(prodottoId).orElseThrow()));
        assertTrue(carrello2.contains(prodottoRepository.findById(prodottoId).orElseThrow()));
    }

    @Test
    @Order(3)
    void testVenditaBloccaAltriAcquisti() {
        clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente1Id);
        clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente2Id);

        clienteService.checkout(cliente1Id);

        assertThrows(ProdottoNonDisponibileException.class, () -> {
            clienteService.checkout(cliente2Id);
        });

        assertThrows(ProdottoNonDisponibileException.class, () -> {
            clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente2Id);
        });
    }

    @Test
    @Order(4)
    void testConcorrenzaSuProdottoUnico() throws InterruptedException, ExecutionException {
        clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente1Id);
        clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente2Id);

        ExecutorService executor = Executors.newFixedThreadPool(2);

        Future<String> result1 = executor.submit(() -> {
            try {
                clienteService.checkout(cliente1Id);
                return "cliente1";
            } catch (Exception e) {
                return "fail1";
            }
        });

        Future<String> result2 = executor.submit(() -> {
            try {
                clienteService.checkout(cliente2Id);
                return "cliente2";
            } catch (Exception e) {
                return "fail2";
            }
        });

        String res1 = result1.get();
        String res2 = result2.get();

        assertTrue((res1.equals("cliente1") && res2.equals("fail2")) || (res1.equals("fail1") && res2.equals("cliente2")));

        executor.shutdown();
    }

}
