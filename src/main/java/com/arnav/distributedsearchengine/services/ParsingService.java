package com.arnav.distributedsearchengine.services;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

@Service
public class ParsingService {
    public ParsedContent parse(String html){
        Document doc = Jsoup.parse(html);
        String title=doc.title();
        String text = doc.body() != null ? doc.body().text() : "";

        return new ParsedContent(title,text);

    }


}
