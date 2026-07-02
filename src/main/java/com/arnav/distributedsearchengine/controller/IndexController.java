package com.arnav.distributedsearchengine.controller;

import com.arnav.distributedsearchengine.services.IndexingService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/index")
public class IndexController {
    private final IndexingService indexingService;
    public IndexController(IndexingService indexingService) {
        this.indexingService = indexingService;
    }

    @PostMapping
    public String indexAll(){
        indexingService.indexAllDocuments();
        return "Indexing Complete";
    }
}
