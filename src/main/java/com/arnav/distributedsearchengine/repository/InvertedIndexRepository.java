package com.arnav.distributedsearchengine.repository;

import com.arnav.distributedsearchengine.entity.InvertedIndex;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvertedIndexRepository extends JpaRepository<InvertedIndex,Long> {
    List<InvertedIndex> findByTerm(String term);
}
