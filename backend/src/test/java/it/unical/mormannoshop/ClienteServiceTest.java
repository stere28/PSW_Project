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
        venditoreRepository.save(venditore);

        Cliente cliente1 = new Cliente();
        Cliente cliente2 = new Cliente();
        clienteRepository.save(cliente1);
        clienteRepository.save(cliente2);

        Prodotto prodotto = Prodotto.builder()
                .nome("Prodotto Test")
                .prezzo(10.0)
                .venduto(false)
                .venditore(venditore)
                .build();

        prodottoRepository.save(prodotto);

        cliente1Id = cliente1.getId();
        cliente2Id = cliente2.getId();
        prodottoId = prodotto.getId();
    }

    @Test
    @Order(1)
    void testAggiuntaProdottoAlCarrelloEEffettuaCheckout() {
        clienteService.aggiungiProdottoAlCarrello(prodottoId, cliente1Id);

        Set<Prodotto> carrello = clienteService.getCarrello(cliente1Id);
        assertEquals(1, carrello.size());

        clienteService.checkout(cliente1Id);

        Cliente cliente = clienteRepository.findById(cliente1Id).orElseThrow();
        assertEquals(1, cliente.getOrdini().size());

        Prodotto prodotto = prodottoRepository.findById(prodottoId).orElseThrow();
        assertTrue(prodotto.isVenduto());
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
