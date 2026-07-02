package com.arnav.distributedsearchengine.services;

import com.arnav.distributedsearchengine.entity.InvertedIndex;
import com.arnav.distributedsearchengine.repository.DocumentRepository;
import com.arnav.distributedsearchengine.repository.InvertedIndexRepository;
import com.arnav.distributedsearchengine.entity.Document;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IndexingService {

    private final DocumentRepository documentRepository;
    private final InvertedIndexRepository invertedIndexRepository;
    private final ParsingService parsingService;
    private final TokenizerService tokenizerService;
    private final StopWordService stopWordService;
    private final StemmerService stemmerService;


    public IndexingService(DocumentRepository documentRepository,
                           InvertedIndexRepository invertedIndexRepository,
                           ParsingService parsingService,
                           TokenizerService tokenizerService,
                           StopWordService stopWordService,
                           StemmerService stemmerService) {

        this.documentRepository = documentRepository;
        this.invertedIndexRepository = invertedIndexRepository;
        this.parsingService = parsingService;
        this.tokenizerService = tokenizerService;
        this.stopWordService = stopWordService;
        this.stemmerService = stemmerService;
    }
    public void indexDocument(Document document){
        // Extract title and text
        ParsedContent parsedContent = parsingService.parse(document.getHtmlContent());

        // Tokenize
        List<String> tokens = tokenizerService.tokenize(parsedContent.getContent());

        // Remove stop words
        tokens=stopWordService.removeStopWords(tokens);

        // Stem tokens
        tokens=stemmerService.stemWords(tokens);

        //Count Frequencies
        Map<String,Integer> frequencyMap=countFrequencies(tokens);
//        System.out.println(parsedContent.getContent());
//        System.out.println(tokens);
        saveIndex(document,frequencyMap);
        document.setIndexed(true);
        documentRepository.save(document);



    }
    public void indexAllDocuments(){
        List<Document> documents = documentRepository.findByIsIndexedFalse();
        for(Document document:documents){
            indexDocument(document);
        }
    }

    private Map<String, Integer> countFrequencies(List<String> tokens) {

        Map<String, Integer> frequencyMap = new HashMap<>();

        for (String token : tokens) {
            frequencyMap.put(token,
                    frequencyMap.getOrDefault(token, 0) + 1);
        }

        return frequencyMap;
    }
    public void saveIndex(Document document, Map<String, Integer> frequencyMap){

        for (Map.Entry<String, Integer> entry : frequencyMap.entrySet()) {

            InvertedIndex index = new InvertedIndex();

            index.setTerm(entry.getKey());
            index.setDocumentId(document.getId());
            index.setFrequency(entry.getValue());

            invertedIndexRepository.save(index);
        }
    }
}
