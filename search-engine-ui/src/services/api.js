const BASE_URL = '';

export const searchEngineApi = {
  search: async (query) => {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Search failed: ${errText}`);
    }
    return res.json();
  },

  triggerCrawl: async (seedUrl) => {
    const res = await fetch(`${BASE_URL}/crawl?seedUrl=${encodeURIComponent(seedUrl)}`, {
      method: 'POST',
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Crawl failed: ${errText}`);
    }
    return res.text();
  },

  triggerIndex: async () => {
    const res = await fetch(`${BASE_URL}/index`, {
      method: 'POST',
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Index failed: ${errText}`);
    }
    return res.text();
  }
};  