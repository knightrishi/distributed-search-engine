package com.arnav.distributedsearchengine.services;

import java.util.List;
import java.util.Set;

public class StopWordService {
    public static final Set<String> STOP_WORDS=Set.of(
            "a", "an", "the", "is", "are", "am", "was", "were",
            "be", "been", "being", "to", "of", "in", "on", "at",
            "for", "with", "and", "or", "but", "if", "this", "that",
            "these", "those", "it", "its", "as", "by", "from",
            "into", "about", "over", "under"
    );
    public List<String> removeStopWords(List<String> tokens) {
         return tokens.stream().filter(word-> !STOP_WORDS.contains(word)).toList();
    }
}
