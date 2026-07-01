package com.arnav.distributedsearchengine.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "inverted_index")
@Getter
@Setter
public class InvertedIndex {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String term;

    private Long documentId;

    private Integer frequency;
}
