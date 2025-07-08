package it.unical.mormannoshop.repositories;

import it.unical.mormannoshop.entities.Notifica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificaRepository extends JpaRepository<Notifica, Long>
{
}
