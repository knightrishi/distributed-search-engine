package com.arnav.distributedsearchengine.controller;

import com.arnav.distributedsearchengine.crawler.BfsCrawlerService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/crawl-site")
public class BfsCrawlerController {
    private final BfsCrawlerService bfsCrawlerService;
    public BfsCrawlerController(BfsCrawlerService bfsCrawlerService) {
        this.bfsCrawlerService = bfsCrawlerService;
    }
    @PostMapping
    public String crawlSite(@RequestParam String url,@RequestParam int limit) throws Exception {
        bfsCrawlerService.crawlSite(url, limit);
         return "crawling started";
    }
}
