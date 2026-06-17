package com.arnav.distributedsearchengine.repository;

import com.arnav.distributedsearchengine.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}
