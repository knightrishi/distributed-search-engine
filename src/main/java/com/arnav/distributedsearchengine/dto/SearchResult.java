package com.arnav.distributedsearchengine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SearchResult {
    private String title;
    private String url;
    private int score;
}
