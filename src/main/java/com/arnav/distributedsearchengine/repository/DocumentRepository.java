package com.arnav.distributedsearchengine.repository;
import org.springframework.data.jpa.repository.Query;
import com.arnav.distributedsearchengine.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByIsIndexedFalse();
    long countByIsIndexedTrue();
    @Query("SELECT COALESCE(AVG(d.wordCount), 0.0) FROM Document d WHERE d.isIndexed = true")
    double getAverageDocumentLength();
}
