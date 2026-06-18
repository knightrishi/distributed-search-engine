package com.arnav.distributedsearchengine.controller;

import com.arnav.distributedsearchengine.entity.Document;
import com.arnav.distributedsearchengine.repository.DocumentRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/documents")
public class DocumentController {
    private final DocumentRepository documentRepository;

    public DocumentController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }
    @PostMapping
    public Document saveDocument(){
    Document document = new Document();
    document.setUrl("https://www.example.com");
        document.setTitle("Example Website");
        document.setHtmlContent("<html>Hello</html>");
        document.setStatus("CRAWLED");
        document.setCrawledAt(LocalDateTime.now());
    return documentRepository.save(document);
    }

}
