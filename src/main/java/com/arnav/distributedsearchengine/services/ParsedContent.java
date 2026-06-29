package com.arnav.distributedsearchengine.services;

import lombok.Getter;

@Getter
public class ParsedContent {
    private final String title;
    private final String content;
    public ParsedContent(String title, String content) {
        this.title = title;
        this.content = content;
    }

}
