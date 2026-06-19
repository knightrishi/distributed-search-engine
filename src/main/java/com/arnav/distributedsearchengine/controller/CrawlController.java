package com.arnav.distributedsearchengine.controller;

import com.arnav.distributedsearchengine.crawler.CrawlerService;
import com.arnav.distributedsearchengine.entity.Document;
import org.springframework.web.bind.annotation.*;

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
