package com.arnav.distributedsearchengine.crawler;

import com.arnav.distributedsearchengine.entity.Document;
import com.arnav.distributedsearchengine.repository.DocumentRepository;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
@Service
public class CrawlerService {
    private final DocumentRepository repository;
        public CrawlerService(DocumentRepository documentRepository) {
            this.repository = documentRepository;
        }
        public Document crawl(String url) throws Exception{
            org.jsoup.nodes.Document page = Jsoup.connect(url).get();
            //the above line downloads the webpage.

            Document document=new Document();
            document.setUrl(url);
            document.setTitle(page.title());
            document.setHtmlContent(page.html());
            document.setStatus("Crawled");
            document.setCrawledAt(LocalDateTime.now());

            return repository.save(document);


        }
//download a webpage and return the Jsoup Document object without saving anything to the database.
    public org.jsoup.nodes.Document fetchPage(String url) throws Exception {
            return Jsoup.connect(url).get();
    }
}
