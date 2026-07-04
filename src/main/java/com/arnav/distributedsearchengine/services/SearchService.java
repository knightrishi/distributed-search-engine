package com.arnav.distributedsearchengine.services;

import com.arnav.distributedsearchengine.dto.SearchResult;
import com.arnav.distributedsearchengine.entity.Document;
import com.arnav.distributedsearchengine.entity.InvertedIndex;
import com.arnav.distributedsearchengine.repository.DocumentRepository;
import com.arnav.distributedsearchengine.repository.InvertedIndexRepository;
import com.arnav.distributedsearchengine.services.StemmerService;
import com.arnav.distributedsearchengine.services.StopWordService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {
    private final TokenizerService tokenizerService;
    private final StopWordService stopWordService;
    private final StemmerService stemmerService;
    private final InvertedIndexRepository invertedIndexRepository;
    private final DocumentRepository documentRepository;

    public SearchService(
            TokenizerService tokenizerService,
            StopWordService stopWordService,
            StemmerService stemmerService,
            InvertedIndexRepository invertedIndexRepository,
            DocumentRepository documentRepository
    ) {

        this.tokenizerService = tokenizerService;
        this.stopWordService = stopWordService;
        this.stemmerService = stemmerService;
        this.invertedIndexRepository = invertedIndexRepository;
        this.documentRepository = documentRepository;
    }

    public List<SearchResult> search(String query) {

        List<String> tokens = tokenizerService.tokenize(query);
        tokens = stopWordService.removeStopWords(tokens);
        tokens = stemmerService.stemWords(tokens);

        Map<Long, Integer> scores = new HashMap<>();

        for (String term : tokens) {

            List<InvertedIndex> postings =
                    invertedIndexRepository.findByTerm(term);

            for (InvertedIndex posting : postings) {

                Long documentId = posting.getDocumentId();

                int frequency = posting.getFrequency();

                scores.put(
                        documentId,
                        scores.getOrDefault(documentId, 0) + frequency
                );
            }
        }
        List<SearchResult> results = new ArrayList<>();
        scores.entrySet()
                .stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .forEach(entry -> {

                    documentRepository.findById(entry.getKey())
                            .ifPresent(document -> {

                                SearchResult result = new SearchResult(
                                        document.getTitle(),
                                        document.getUrl(),
                                        entry.getValue()   // score
                                );

                                results.add(result);

                            });

                });

        return results;

    }
}
