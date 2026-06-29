package com.arnav.distributedsearchengine.controller;

import com.arnav.distributedsearchengine.services.CrawlerService;
import com.arnav.distributedsearchengine.entity.Document;
import org.springframework.web.bind.annotation.*;


//This is for crawling exactly one page not more than 1 like visit a page and store the required data
@RestController
@RequestMapping("/crawl")
public class CrawlController {
    private final CrawlerService crawlerService;
    public CrawlController(CrawlerService crawlerService) {
        this.crawlerService = crawlerService;
    }

    @PostMapping
    public Document crawl(@RequestParam String url) throws Exception {
        return crawlerService.crawl(url);
    }
}
