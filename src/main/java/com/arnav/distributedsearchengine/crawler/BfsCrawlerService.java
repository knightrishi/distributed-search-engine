package com.arnav.distributedsearchengine.crawler;


import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.jsoup.nodes.Element;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.LinkedBlockingQueue;

//Manage queue -> Extract links -> Crawl MANY pages
@Service
public class BfsCrawlerService {
    private final Queue<String> queue=new LinkedList<>();
    private final  CrawlerService crawlerService;
    private final Set<String> visited=new HashSet<>();
    public BfsCrawlerService(CrawlerService crawlerService) {
        this.crawlerService = crawlerService;
    }

    public void crawlSite( String seedUrl, int limit) throws Exception {
        queue.add(seedUrl);
        while(!queue.isEmpty() && visited.size() < limit){
            String currentUrl = queue.poll();//contains next branches of seed ur

            if (visited.contains(currentUrl))
                continue;

            visited.add(currentUrl);

            Document page =
                    crawlerService.fetchPage(currentUrl);

            crawlerService.crawl(currentUrl);

            Elements links = page.select("a[href]"); //links is a collection of all <a> tags

            for (Element link : links) {

                String nextUrl = link.absUrl("href");

                if (!nextUrl.isBlank()
                        && nextUrl.startsWith("http")
                        && !visited.contains(nextUrl)) {

                    queue.add(nextUrl);
                }
            }
        }

    }

}
