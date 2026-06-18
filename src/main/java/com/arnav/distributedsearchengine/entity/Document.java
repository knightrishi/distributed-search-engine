package com.arnav.distributedsearchengine.entity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

// Ye entity crawled webpages ko represent karti hai.
// Hibernate ORM is class ko documents table se map karta hai.
// Har object ek crawled webpage ka URL, title, HTML content aur status store karta hai.


@Entity
@Table(name = "documents")
@Data
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String url;

    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String htmlContent;

    private String status;

    private LocalDateTime crawledAt;
}
