const CRYPTO_PANIC_API_KEY = "fa1a277cc05f74386bc62779ade30f256749113d";
const CRYPTO_PANIC_BASE_URL = "https://cryptopanic.com/api/v1";

export interface CryptoNewsItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  published_at: string;
  created_at: string;
  kind: string;
  domain?: string;
  url?: string;
  source?: {
    title: string;
    region: string;
    domain: string;
    type: string;
  };
  currencies?: Array<{
    code: string;
    title: string;
    slug: string;
    url: string;
  }>;
  votes?: {
    negative: number;
    positive: number;
    important: number;
    liked: number;
    disliked: number;
    lol: number;
    toxic: number;
    saved: number;
    comments: number;
  };
  hot?: boolean;
}

export interface CryptoNewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CryptoNewsItem[];
}

export async function getCryptoNews(options: {
  currencies?: string; // e.g., "BTC,ETH"
  regions?: string; // e.g., "en"
  kind?: "news" | "media" | "all";
  filter?: "rising" | "hot" | "bullish" | "bearish" | "important" | "saved" | "lol";
  page?: number;
} = {}): Promise<CryptoNewsResponse> {
  try {
    const params = new URLSearchParams();
    params.append("auth_token", CRYPTO_PANIC_API_KEY);
    params.append("public", "true");
    
    // Add optional parameters
    if (options.currencies) params.append("currencies", options.currencies);
    if (options.regions) params.append("regions", options.regions);
    if (options.kind) params.append("kind", options.kind);
    if (options.filter) params.append("filter", options.filter);
    if (options.page) params.append("page", options.page.toString());

    const url = `${CRYPTO_PANIC_BASE_URL}/posts/?${params}`;
    console.log("Making request to:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MindCP-App/1.0',
      },
    });
    
    console.log("Response status:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`CryptoPanic API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    throw error;
  }
}

export async function getTrendingCryptoNews(): Promise<CryptoNewsResponse> {
  return getCryptoNews({
    filter: "hot",
    kind: "news",
    regions: "en",
  });
}

export async function getCryptoNewsBySymbol(symbol: string): Promise<CryptoNewsResponse> {
  return getCryptoNews({
    currencies: symbol.toUpperCase(),
    kind: "news",
    regions: "en",
  });
}

export async function getBullishCryptoNews(): Promise<CryptoNewsResponse> {
  return getCryptoNews({
    filter: "bullish",
    kind: "news",
    regions: "en",
  });
}

export async function getBearishCryptoNews(): Promise<CryptoNewsResponse> {
  return getCryptoNews({
    filter: "bearish",
    kind: "news",
    regions: "en",
  });
} 