# 🔎 Distributed Search Engine

> A scalable web search engine built with **Java**, **Spring Boot**, and **MySQL** that crawls web pages, indexes their content, and serves ranked search results through REST APIs.

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Jsoup](https://img.shields.io/badge/Jsoup-Web_Crawler-orange?style=for-the-badge)

---

## 📖 About the Project

The **Distributed Search Engine** is a backend search platform that demonstrates the core architecture of modern search engines. Starting from a **seed URL**, the system crawls websites using a **Breadth-First Search (BFS)** strategy, extracts hyperlinks, stores crawled pages, builds searchable indexes, and returns ranked results through REST APIs.

The project is designed with **distributed systems principles** in mind, allowing crawling, indexing, and searching to evolve into independent microservices that can scale horizontally across multiple machines.

---

## ✨ Features

- 🌐 BFS-based web crawling from seed URLs.
- 🔗 Hyperlink extraction using **Jsoup**.
- 📄 Stores crawled pages as `Document` entities in MySQL.
- ⚡ Content indexing for efficient searching.
- 🔍 Ranked search results via REST APIs.
- 🧩 Modular architecture separating crawling, indexing, and search layers.
- 🚀 Designed for horizontal scalability.
- ⚙️ Optional Redis caching for faster query responses and service coordination.

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Language** | Java |
| **Framework** | Spring Boot, Spring Data JPA |
| **Web Crawler** | Jsoup |
| **Database** | MySQL |
| **Cache** | Redis *(optional)* |
| **API** | Spring REST APIs |
| **Build Tool** | Maven |

---

## 🏗️ System Architecture

```text
                 +----------------------+
                 |      Seed URL        |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 |   BFS Web Crawler    |
                 |       (Jsoup)        |
                 +----------+-----------+
                            |
             Extract HTML + Hyperlinks
                            |
                            v
                 +----------------------+
                 | Document Repository  |
                 |      (MySQL)         |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 |   Indexing Service   |
                 | Tokenize & Build     |
                 | Search Index         |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 |   Search Service     |
                 | Ranking & Retrieval  |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 |     REST API         |
                 +----------------------+

            (Optional Redis Cache Layer)
```

---

## ⚙️ How It Works

### 1. Web Crawling

- The crawler starts with one or more **seed URLs**.
- Uses **Breadth-First Search (BFS)** to discover connected webpages.
- Downloads HTML pages using **Jsoup**.
- Extracts hyperlinks for further crawling.

### 2. Document Storage

Each crawled page is stored as a **Document** entity containing:

- URL
- Page title
- HTML content
- Crawl timestamp
- Crawl status

The documents are persisted in **MySQL** using **Spring Data JPA**.

### 3. Indexing

After crawling, every document passes through the indexing pipeline:

- Parse HTML content.
- Extract searchable text.
- Build an inverted index for fast lookup.
- Store processed metadata for efficient retrieval.

### 4. Searching

The Search API:

- Accepts a search query.
- Looks up indexed documents.
- Ranks matching pages.
- Returns relevant results in JSON format.

---

## 📂 Project Structure

```bash
distributed-search-engine/
│── src/
│   ├── crawler/
│   │   ├── BfsCrawlerService.java
│   │   └── CrawlerService.java
│   ├── controller/
│   │   └── CrawlController.java
│   ├── entity/
│   │   └── Document.java
│   ├── repository/
│   │   └── DocumentRepository.java
│   ├── service/
│   │   ├── IndexingService.java
│   │   └── SearchService.java
│   └── resources/
│       └── application.properties
│
├── pom.xml
└── README.md
```

---

## 🚀 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/crawl` | Crawl a website from a seed URL. |
| `POST` | `/index` | Build or refresh the search index. |
| `GET` | `/search?q=keyword` | Search indexed documents. |

---

## 📈 Scalability Vision

The architecture is intentionally modular so each component can be deployed independently.

| Service | Responsibility |
|---------|----------------|
| **Crawler Service** | Crawl webpages across multiple worker nodes. |
| **Indexing Service** | Build and maintain distributed indexes. |
| **Search Service** | Query indexes and rank results. |
| **Redis** | Cache popular queries and coordinate distributed workers. |

This design allows the search engine to scale from a single-node application to a distributed search platform.

---

## 🔮 Future Improvements

- Multi-threaded distributed crawler.
- URL deduplication using Bloom Filters.
- TF-IDF / BM25 ranking algorithm.
- PageRank integration.
- Elasticsearch support for distributed indexing.
- Kafka-based crawling and indexing pipeline.
- Prometheus + Grafana monitoring.

---

## 🎯 Use Cases

- Search engine architecture learning project.
- Large-scale document indexing system.
- Internal enterprise search.
- Distributed systems and Spring Boot portfolio project.

---

## 👨‍💻 Author

**Arnav Singh**

B.Tech CSE • Java Backend Developer • Distributed Systems Enthusiast
