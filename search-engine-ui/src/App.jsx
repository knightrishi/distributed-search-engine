import React, { useState } from "react";
import { searchEngineApi } from "./services/api";
// Adjust folder name ("./asset/...") or extension (".png" / ".jpeg") if needed
import oceanBg from "./assets/pexels-matthardy-1533720.jpg";

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
    <div style={styles.page}>
      {/* Top White Navigation Bar */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand} onClick={() => setActiveTab("search")}>
           
            <span style={styles.brandBold}>Nautilus</span>
          </div>

          <nav style={styles.nav}>
            <button
              type="button"
              style={
                activeTab === "search" ? styles.activeNavLink : styles.navLink
              }
              onClick={() => setActiveTab("search")}
            >
              SEARCH
            </button>
            <button
              type="button"
              style={
                activeTab === "admin" ? styles.activeNavLink : styles.navLink
              }
              onClick={() => setActiveTab("admin")}
            >
              CRAWLER &amp; INDEXER
            </button>
          </nav>

          <button
            type="button"
            style={styles.headerCta}
            onClick={() =>
              setActiveTab(activeTab === "search" ? "admin" : "search")
            }
          >
            {activeTab === "search" ? "OPEN CONSOLE" : "BACK TO SEARCH"}
          </button>
        </div>
      </header>

      {/* Full-Width Ocean Hero Banner */}
      <section style={styles.hero}>
        <div style={styles.heroTopRow}>
          <span style={styles.statusBadge}>
            <span style={styles.statusDot} />
            BM25 Engine Ready
          </span>
        </div>

        <div style={styles.heroCenter}>
          <h1 style={styles.heroTitle}>
            {activeTab === "search"
              ? "What are you looking for?"
              : "Crawler & Indexer Pipeline"}
          </h1>

          {activeTab === "search" ? (
            <form onSubmit={handleSearch} style={styles.heroSearchForm}>
              <span style={styles.searchIcon} aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search indexed pages (e.g., java, algorithms, spring)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.heroSearchInput}
              />
              <button
                type="submit"
                style={styles.heroSearchBtn}
                disabled={loading}
              >
                {loading ? "SEARCHING..." : "SEARCH"}
              </button>
            </form>
          ) : (
            <p style={styles.heroSubtitle}>
              Ingest new web pages via BFS crawling and rebuild your inverted
              index in MySQL.
            </p>
          )}
        </div>
      </section>

      {/* Main White Content Area */}
      <main style={styles.main}>
        {activeTab === "search" ? (
          <div>
            {error && <div style={styles.errorBox}>{error}</div>}

            {searchStats && (
              <p style={styles.stats}>
                About <strong>{searchStats.count}</strong> results (
                {searchStats.timeMs} ms)
              </p>
            )}

            {results.length > 0 ? (
              <div style={styles.resultsList}>
                {results.map((doc) => (
                  <article key={doc.id || doc.url} style={styles.resultCard}>
                    <div style={styles.resultHeader}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.resultTitle}
                      >
                        {doc.title || doc.url}
                      </a>
                      {doc.score !== undefined && (
                        <span style={styles.scoreBadge}>
                          BM25: {doc.score.toFixed(3)}
                        </span>
                      )}
                    </div>
                    <span style={styles.resultUrl}>{doc.url}</span>
                    <p style={styles.resultSnippet}>
                      {doc.content
                        ? doc.content.slice(0, 220) + "..."
                        : "No preview available."}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              /* Two-Column Feature Section (matches reference layout before results) */
              <div style={styles.splitGrid}>
                <div style={styles.featureCol}>
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0099dd"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={styles.featureIcon}
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M11 8v6M8 11h6" stroke="#00b159" />
                  </svg>
                  <h2 style={styles.featureTitle}>BM25 Ranked Search</h2>
                  <p style={styles.featureText}>
                    Query your inverted index with term-frequency saturation and
                    document length normalisation for accurate, noise-free
                    ranking.
                  </p>
                  <button
                    type="button"
                    style={styles.blueBtn}
                    onClick={() => setQuery("java")}
                  >
                    TRY SAMPLE QUERY
                  </button>
                </div>

                <div style={styles.verticalDivider} />

                <div style={styles.featureCol}>
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0099dd"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={styles.featureIcon}
                  >
                    <circle cx="12" cy="12" r="3" stroke="#00b159" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <h2 style={styles.featureTitle}>Crawler &amp; Indexer</h2>
                  <p style={styles.featureText}>
                    Seed new URLs to run the BFS web crawler, tokenise HTML
                    content, and update your inverted index pipeline on demand.
                  </p>
                  <button
                    type="button"
                    style={styles.blueBtn}
                    onClick={() => setActiveTab("admin")}
                  >
                    MANAGE PIPELINE
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Admin Tab styled in the same two-column layout */
          <div>
            <div style={styles.splitGrid}>
              <div style={styles.featureCol}>
                <h2 style={styles.featureTitle}>Web Crawler (BFS)</h2>
                <p style={styles.featureText}>
                  Enter a seed URL to fetch pages and queue them into MySQL for
                  indexing.
                </p>
                <form onSubmit={handleCrawl} style={styles.adminForm}>
                  <input
                    type="url"
                    required
                    placeholder="https://en.wikipedia.org/wiki/Java_(programming_language)"
                    value={seedUrl}
                    onChange={(e) => setSeedUrl(e.target.value)}
                    style={styles.adminInput}
                  />
                  <button type="submit" style={styles.blueBtn}>
                    START BFS CRAWL
                  </button>
                </form>
              </div>

              <div style={styles.verticalDivider} />

              <div style={styles.featureCol}>
                <h2 style={styles.featureTitle}>Inverted Indexer</h2>
                <p style={styles.featureText}>
                  Tokenise, remove stop words, stem, and calculate document word
                  counts for all unindexed pages.
                </p>
                <button
                  type="button"
                  onClick={handleIndex}
                  style={styles.greenBtn}
                >
                  RUN INDEXER PIPELINE
                </button>
              </div>
            </div>

            {adminStatus && <div style={styles.statusBox}>{adminStatus}</div>}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Segoe UI', Roboto, system-ui, -apple-system, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    color: "#374151",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "0 24px",
  },
  headerInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    height: "68px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  },
  brand: {
    cursor: "pointer",
    fontSize: "1.15rem",
    letterSpacing: "1.5px",
    color: "#111827",
    userSelect: "none",
  },
  brandLight: {
    fontWeight: 300,
    color: "#4b5563",
  },
brandBold: {
  fontSize: "1.4rem",
  fontWeight: 800,
  letterSpacing: "1.8px",
  textTransform: "uppercase",
  background: "linear-gradient(90deg, #007ecc 0%, #00b159 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block",
},
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  navLink: {
    background: "none",
    border: "none",
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.6px",
    color: "#4b5563",
    cursor: "pointer",
    padding: "6px 2px",
  },
  activeNavLink: {
    background: "none",
    border: "none",
    borderBottom: "2px solid #0099dd",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.6px",
    color: "#0088cc",
    cursor: "pointer",
    padding: "6px 2px",
  },
  headerCta: {
    backgroundColor: "#00b159",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    padding: "9px 16px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.6px",
    cursor: "pointer",
  },
  hero: {
    position: "relative",
    backgroundImage: `linear-gradient(110deg, rgba(0, 126, 204, 0.78), rgba(56, 168, 108, 0.72)), url(${oceanBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px 24px 72px",
    color: "#ffffff",
  },
  heroTopRow: {
    maxWidth: "1100px",
    margin: "0 auto 28px",
    display: "flex",
    justifyContent: "flex-end",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid rgba(255, 255, 255, 0.65)",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: "4px",
    padding: "6px 12px",
    fontSize: "0.78rem",
    fontWeight: 500,
    backdropFilter: "blur(4px)",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#4ade80",
  },
  heroCenter: {
    maxWidth: "780px",
    margin: "0 auto",
    textAlign: "center",
  },
  heroTitle: {
    margin: "0 0 26px",
    fontSize: "2.35rem",
    fontWeight: 300,
    letterSpacing: "0.3px",
    textShadow: "0 1px 6px rgba(0, 0, 0, 0.2)",
  },
  heroSubtitle: {
    margin: "0 auto",
    maxWidth: "560px",
    fontSize: "1rem",
    lineHeight: 1.5,
    color: "rgba(255, 255, 255, 0.92)",
  },
  heroSearchForm: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "3px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.16)",
    overflow: "hidden",
    height: "52px",
  },
  searchIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 14px 0 18px",
  },
  heroSearchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "1rem",
    color: "#edf0f3",
    height: "100%",
  },
  heroSearchBtn: {
    height: "100%",
    padding: "0 24px",
    border: "none",
    backgroundColor: "#0099dd",
    color: "#ffffff",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.8px",
    cursor: "pointer",
  },
  main: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "56px 24px 72px",
  },
  splitGrid: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: "32px",
    flexWrap: "wrap",
  },
  featureCol: {
    flex: "1 1 320px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "12px 24px",
  },
  verticalDivider: {
    width: "1px",
    backgroundColor: "#e5e7eb",
    alignSelf: "stretch",
  },
  featureIcon: {
    marginBottom: "18px",
  },
  featureTitle: {
    margin: "0 0 12px",
    fontSize: "1.45rem",
    fontWeight: 400,
    color: "#374151",
  },
  featureText: {
    margin: "0 0 24px",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "#6b7280",
    maxWidth: "360px",
  },
  blueBtn: {
    backgroundColor: "#0099dd",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    padding: "11px 24px",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.7px",
    cursor: "pointer",
  },
  greenBtn: {
    backgroundColor: "#00b159",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    padding: "11px 24px",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.7px",
    cursor: "pointer",
  },
  stats: {
    fontSize: "0.88rem",
    color: "#6b7280",
    margin: "0 0 24px",
    paddingBottom: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "0.9rem",
  },
  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  resultCard: {
    paddingBottom: "20px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  resultTitle: {
    fontSize: "1.15rem",
    color: "#0088cc",
    textDecoration: "none",
    fontWeight: 600,
  },
  resultUrl: {
    fontSize: "0.82rem",
    color: "#009955",
    wordBreak: "break-all",
  },
  resultSnippet: {
    fontSize: "0.93rem",
    color: "#4b5563",
    margin: "4px 0 0",
    lineHeight: 1.55,
  },
  scoreBadge: {
    backgroundColor: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  adminForm: {
    width: "100%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
  },
  adminInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "0.9rem",
    outline: "none",
  },
  statusBox: {
    marginTop: "32px",
    padding: "14px 18px",
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    color: "#0369a1",
    borderRadius: "4px",
    fontSize: "0.9rem",
    textAlign: "center",
  },
};