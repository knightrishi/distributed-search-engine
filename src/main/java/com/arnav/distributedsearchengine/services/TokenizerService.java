package com.arnav.distributedsearchengine.services;



import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class TokenizerService {

    public List<String> tokenize(String text) {

        if(text== null || text.isBlank()) return List.of();

        return Arrays.stream(text.toLowerCase().replaceAll("[^a-zA-Z0-9]", "").split("\\+s")).filter(word->!word.isBlank()).toList();
    }
}
