package com.arnav.distributedsearchengine.controller;

import com.arnav.distributedsearchengine.dto.SearchResult;
import com.arnav.distributedsearchengine.entity.Document;
import com.arnav.distributedsearchengine.services.SearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.OPTIONS})
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public List<SearchResult> search(@RequestParam String q) {
        return searchService.search(q);
    }
}
