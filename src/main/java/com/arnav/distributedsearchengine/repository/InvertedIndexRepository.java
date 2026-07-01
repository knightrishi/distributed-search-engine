package com.arnav.distributedsearchengine.repository;

import com.arnav.distributedsearchengine.entity.InvertedIndex;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvertedIndexRepository extends JpaRepository<InvertedIndex,Long> {
}
