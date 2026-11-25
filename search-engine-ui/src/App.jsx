import React, { useState } from "react";
import { searchEngineApi } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("search"); // 'search' | 'admin'
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchStats, setSearchStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin states
  const [seedUrl, setSeedUrl] = useState("");
  const [adminStatus, setAdminStatus] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    const startTime = performance.now();

    try {
      const data = await searchEngineApi.search(query);
      const endTime = performance.now();
      setResults(data);
      setSearchStats({
        count: data.length,
        timeMs: (endTime - startTime).toFixed(1),
      });
    } catch (err) {
      setError(err.message || "Error executing search");
    } finally {
      setLoading(false);
    }
  };

  const handleCrawl = async (e) => {
    e.preventDefault();
    setAdminStatus("Crawling started in background...");
    try {
      await searchEngineApi.triggerCrawl(seedUrl);
      setAdminStatus("Crawl job successfully queued/completed.");
      setSeedUrl("");
    } catch (err) {
      setAdminStatus(`Crawl error: ${err.message}`);
    }
  };

  const handleIndex = async () => {
    setAdminStatus("Indexing documents...");
    try {
      await searchEngineApi.triggerIndex();
      setAdminStatus("Documents tokenized and Inverted Index updated!");
    } catch (err) {
      setAdminStatus(`Indexing error: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <header style={styles.header}>
        <h2 style={styles.brandTitle}>Distributed Search Engine</h2>
        <nav style={styles.nav}>
          <button
            style={activeTab === "search" ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setActiveTab("search")}
          >
            Search
          </button>
          <button
            style={activeTab === "admin" ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setActiveTab("admin")}
          >
            Crawler & Indexer
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={styles.main}>
        {activeTab === "search" ? (
          <div>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search keywords (e.g., java, algorithms, spring)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button
                type="submit"
                style={styles.primaryBtn}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {searchStats && (
              <p style={styles.stats}>
                About {searchStats.count} results ({searchStats.timeMs} ms)
              </p>
            )}

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.resultsList}>
              {results.map((doc) => (
                <div key={doc.id || doc.url} style={styles.resultCard}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.resultTitle}
                  >
                    {doc.title || doc.url}
                  </a>
                  <span style={styles.resultUrl}>{doc.url}</span>
                  <p style={styles.resultSnippet}>
                    {doc.content
                      ? doc.content.slice(0, 220) + "..."
                      : "No preview available."}
                  </p>
                  {doc.score !== undefined && (
                    <span style={styles.scoreBadge}>
                      Relevance Score: {doc.score.toFixed(3)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.adminCard}>
            <h3>Crawler & Indexer Dashboard</h3>
            <p style={styles.subtext}>
              Trigger web ingestion or re-index unindexed documents stored in
              MySQL.
            </p>

            <form onSubmit={handleCrawl} style={styles.adminForm}>
              <label>Seed URL:</label>
              <input
                type="url"
                required
                placeholder="https://en.wikipedia.org/wiki/Java_(programming_language)"
                value={seedUrl}
                onChange={(e) => setSeedUrl(e.target.value)}
                style={styles.adminInput}
              />
              <button type="submit" style={styles.secondaryBtn}>
                Start BFS Crawl
              </button>
            </form>

            <div style={{ marginTop: "20px" }}>
              <button onClick={handleIndex} style={styles.secondaryBtn}>
                Run Inverted Indexer Pipeline
              </button>
            </div>

            {adminStatus && <div style={styles.statusBox}>{adminStatus}</div>}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "system-ui, sans-serif",
    maxWidth: "850px",
    margin: "0 auto",
    padding: "24px",
    color: "#6b3419",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "16px",
  },
  brandTitle: { margin: 0, fontSize: "1.25rem", color: "#111827" },
  nav: { display: "flex", gap: "8px" },
  tabBtn: {
    padding: "8px 14px",
    border: "none",
    background: "none",
    cursor: "pointer",
    borderRadius: "6px",
    color: "#e37922",
  },
  activeTabBtn: {
    padding: "8px 14px",
    border: "none",
    background: "#eb5325",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  },
  main: { marginTop: "32px" },
  searchForm: { display: "flex", gap: "10px" },
  searchInput: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "1rem",
    border: "1px solid #f98a36",
    borderRadius: "8px",
    outline: "none",
  },
  primaryBtn: {
    padding: "12px 24px",
    background: "#dd330d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    padding: "10px 18px",
    background: "#c05a3e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  stats: { fontSize: "0.85rem", color: "#6b7280", margin: "14px 0" },
  error: { color: "#dc2626", margin: "12px 0" },
  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "16px",
  },
  resultCard: { display: "flex", flexDirection: "column", gap: "4px" },
  resultTitle: {
    fontSize: "1.15rem",
    color: "#4ae586",
    textDecoration: "none",
    fontWeight: 500,
  },
  resultUrl: { fontSize: "0.8rem", color: "#059669", wordBreak: "break-all" },
  resultSnippet: {
    fontSize: "0.9rem",
    color: "#4b5d63",
    margin: "4px 0 0 0",
    lineHeight: "1.4",
  },
  scoreBadge: {
    alignSelf: "flex-start",
    background: "#f3f4f6",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "4px",
  },
  adminCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    padding: "24px",
    borderRadius: "8px",
  },
  subtext: { color: "#6b7280", fontSize: "0.9rem", marginBottom: "16px" },
  adminForm: { display: "flex", flexDirection: "column", gap: "8px" },
  adminInput: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
  },
  statusBox: {
    marginTop: "16px",
    padding: "12px",
    background: "#e0f2fe",
    color: "#d67b14",
    borderRadius: "6px",
    fontSize: "0.9rem",
  },
};
