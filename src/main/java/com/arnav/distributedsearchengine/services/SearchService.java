package com.arnav.distributedsearchengine.services;

import com.arnav.distributedsearchengine.dto.SearchResult;
import com.arnav.distributedsearchengine.entity.Document;
import com.arnav.distributedsearchengine.entity.InvertedIndex;
import com.arnav.distributedsearchengine.repository.DocumentRepository;
import com.arnav.distributedsearchengine.repository.InvertedIndexRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SearchService {
    private static final double K1 = 1.5;
    private static final double B = 0.75;

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
        tokens = stemmerService.stemWords(tokens).stream().distinct().toList();

        if (tokens.isEmpty()) {
            return List.of();
        }

        long totalDocs = documentRepository.countByIsIndexedTrue();
        double avgDocLength = documentRepository.getAverageDocumentLength();
        if (totalDocs == 0) {
            return List.of();
        }
        // Fallback if existing indexed rows still have word_count = 0 before re-indexing
        double effectiveAvgDocLength = avgDocLength > 0.0 ? avgDocLength : 1.0;

        // 1. Fetch postings per term and collect all candidate document IDs
        Map<String, List<InvertedIndex>> termPostings = new HashMap<>();
        Set<Long> docIds = new HashSet<>();

        for (String term : tokens) {
            List<InvertedIndex> postings = invertedIndexRepository.findByTerm(term);
            if (!postings.isEmpty()) {
                termPostings.put(term, postings);
                for (InvertedIndex posting : postings) {
                    docIds.add(posting.getDocumentId());
                }
            }
        }

        if (docIds.isEmpty()) {
            return List.of();
        }

        // 2. Batch-fetch all candidate documents once (avoids N+1 queries)
        Map<Long, Document> docMap = documentRepository.findAllById(docIds)
                .stream()
                .collect(Collectors.toMap(Document::getId, Function.identity()));

        // 3. Accumulate BM25 scores
        Map<Long, Double> scores = new HashMap<>();

        for (List<InvertedIndex> postings : termPostings.values()) {
            int docFreq = postings.size();
            double idf = Math.log(1.0 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5));

            for (InvertedIndex posting : postings) {
                Document doc = docMap.get(posting.getDocumentId());
                if (doc == null) continue;

                int tf = posting.getFrequency();
                double docLength = doc.getWordCount() > 0 ? doc.getWordCount() : effectiveAvgDocLength;

                double numerator = tf * (K1 + 1.0);
                double denominator = tf + K1 * (1.0 - B + B * (docLength / effectiveAvgDocLength));
                double bm25 = idf * (numerator / denominator);

                scores.merge(doc.getId(), bm25, Double::sum);
            }
        }

        // 4. Sort descending by BM25 score and build results
        return scores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .map(entry -> {
                    Document doc = docMap.get(entry.getKey());
                    return new SearchResult(doc.getTitle(), doc.getUrl(), entry.getValue());
                })
                .toList();
    }
}