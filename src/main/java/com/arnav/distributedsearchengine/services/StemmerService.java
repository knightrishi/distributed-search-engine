package com.arnav.distributedsearchengine.services;

import opennlp.tools.stemmer.PorterStemmer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StemmerService {
   public List<String> stemWords(List<String> words) {
       PorterStemmer stemmer = new PorterStemmer();
       List<String> stemmedWords = new ArrayList<>();
       for (String word : words){
           stemmedWords.add(stemmer.stem(word));

       }
       return stemmedWords;

   }
}
