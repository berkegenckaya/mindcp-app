import { tool } from "ai";
import { z } from "zod";
import { 
  getCryptoNews, 
  getTrendingCryptoNews, 
  getCryptoNewsBySymbol, 
  getBullishCryptoNews, 
  getBearishCryptoNews 
} from "./api";

export const getCryptoNewsTool = tool({
  description: "Get cryptocurrency news from CryptoPanic API with various filters",
  parameters: z.object({
    currencies: z.string().optional().describe("Comma-separated list of currency codes (e.g., 'BTC,ETH')"),
    regions: z.string().optional().describe("Region code (e.g., 'en' for English)"),
    kind: z.enum(["news", "media", "all"]).optional().describe("Type of content to fetch"),
    filter: z.enum(["rising", "hot", "bullish", "bearish", "important", "saved", "lol"]).optional().describe("Filter for news sentiment or importance"),
    page: z.number().optional().describe("Page number for pagination"),
  }),
  execute: async ({ currencies, regions, kind, filter, page }) => {
    try {
      const news = await getCryptoNews({
        currencies,
        regions,
        kind,
        filter,
        page,
      });

      return {
        success: true,
        news_data: {
          count: news.count,
          articles: news.results.map(article => ({
            id: article.id,
            title: article.title,
            url: article.url || `https://cryptopanic.com/news/${article.slug}/`,
            source: article.source?.title || article.domain || "CryptoPanic",
            published_at: article.published_at,
            hot: article.hot || false,
            currencies: article.currencies?.map(c => c.code) || [],
            votes: {
              positive: article.votes?.positive || 0,
              negative: article.votes?.negative || 0,
              important: article.votes?.important || 0,
              liked: article.votes?.liked || 0,
              disliked: article.votes?.disliked || 0,
              comments: article.votes?.comments || 0,
            },
          })),
        },
      };
    } catch (error) {
      console.error("Error in getCryptoNewsTool:", error);
      
      let errorMessage = "Failed to fetch crypto news";
      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage = "CryptoPanic API is temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes("401") || error.message.includes("403")) {
          errorMessage = "API authentication failed. Please check the API key configuration.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
        } else {
          errorMessage = `API Error: ${error.message}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});

export const getTrendingCryptoNewsTool = tool({
  description: "Get trending/hot cryptocurrency news from CryptoPanic",
  parameters: z.object({}),
  execute: async () => {
    try {
      const news = await getTrendingCryptoNews();

      return {
        success: true,
        news_data: {
          count: news.count,
          articles: news.results.map(article => ({
            id: article.id,
            title: article.title,
            url: article.url || `https://cryptopanic.com/news/${article.slug}/`,
            source: article.source?.title || article.domain || "CryptoPanic",
            published_at: article.published_at,
            hot: article.hot || false,
            currencies: article.currencies?.map(c => c.code) || [],
            votes: {
              positive: article.votes?.positive || 0,
              negative: article.votes?.negative || 0,
              important: article.votes?.important || 0,
              liked: article.votes?.liked || 0,
              disliked: article.votes?.disliked || 0,
              comments: article.votes?.comments || 0,
            },
          })),
        },
      };
    } catch (error) {
      console.error("Error in getTrendingCryptoNewsTool:", error);
      
      let errorMessage = "Failed to fetch trending crypto news";
      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage = "CryptoPanic API is temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes("401") || error.message.includes("403")) {
          errorMessage = "API authentication failed. Please check the API key configuration.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
        } else {
          errorMessage = `API Error: ${error.message}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});

export const getCryptoNewsBySymbolTool = tool({
  description: "Get cryptocurrency news for a specific coin/token symbol",
  parameters: z.object({
    symbol: z.string().describe("Cryptocurrency symbol (e.g., 'BTC', 'ETH')"),
  }),
  execute: async ({ symbol }) => {
    try {
      const news = await getCryptoNewsBySymbol(symbol);

      return {
        success: true,
        news_data: {
          count: news.count,
          symbol: symbol.toUpperCase(),
          articles: news.results.map(article => ({
            id: article.id,
            title: article.title,
            url: article.url || `https://cryptopanic.com/news/${article.slug}/`,
            source: article.source?.title || article.domain || "CryptoPanic",
            published_at: article.published_at,
            hot: article.hot || false,
            currencies: article.currencies?.map(c => c.code) || [],
            votes: {
              positive: article.votes?.positive || 0,
              negative: article.votes?.negative || 0,
              important: article.votes?.important || 0,
              liked: article.votes?.liked || 0,
              disliked: article.votes?.disliked || 0,
              comments: article.votes?.comments || 0,
            },
          })),
        },
      };
    } catch (error) {
      console.error("Error in getCryptoNewsBySymbolTool:", error);
      
      let errorMessage = "Failed to fetch crypto news for symbol";
      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage = "CryptoPanic API is temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes("401") || error.message.includes("403")) {
          errorMessage = "API authentication failed. Please check the API key configuration.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
        } else {
          errorMessage = `API Error: ${error.message}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});

export const getBullishCryptoNewsTool = tool({
  description: "Get bullish cryptocurrency news from CryptoPanic",
  parameters: z.object({}),
  execute: async () => {
    try {
      const news = await getBullishCryptoNews();

      return {
        success: true,
        news_data: {
          count: news.count,
          sentiment: "bullish",
          articles: news.results.map(article => ({
            id: article.id,
            title: article.title,
            url: article.url || `https://cryptopanic.com/news/${article.slug}/`,
            source: article.source?.title || article.domain || "CryptoPanic",
            published_at: article.published_at,
            hot: article.hot || false,
            currencies: article.currencies?.map(c => c.code) || [],
            votes: {
              positive: article.votes?.positive || 0,
              negative: article.votes?.negative || 0,
              important: article.votes?.important || 0,
              liked: article.votes?.liked || 0,
              disliked: article.votes?.disliked || 0,
              comments: article.votes?.comments || 0,
            },
          })),
        },
      };
    } catch (error) {
      console.error("Error in getBullishCryptoNewsTool:", error);
      
      let errorMessage = "Failed to fetch bullish crypto news";
      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage = "CryptoPanic API is temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes("401") || error.message.includes("403")) {
          errorMessage = "API authentication failed. Please check the API key configuration.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
        } else {
          errorMessage = `API Error: ${error.message}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});

export const getBearishCryptoNewsTool = tool({
  description: "Get bearish cryptocurrency news from CryptoPanic",
  parameters: z.object({}),
  execute: async () => {
    try {
      const news = await getBearishCryptoNews();

      return {
        success: true,
        news_data: {
          count: news.count,
          sentiment: "bearish",
          articles: news.results.map(article => ({
            id: article.id,
            title: article.title,
            url: article.url || `https://cryptopanic.com/news/${article.slug}/`,
            source: article.source?.title || article.domain || "CryptoPanic",
            published_at: article.published_at,
            hot: article.hot || false,
            currencies: article.currencies?.map(c => c.code) || [],
            votes: {
              positive: article.votes?.positive || 0,
              negative: article.votes?.negative || 0,
              important: article.votes?.important || 0,
              liked: article.votes?.liked || 0,
              disliked: article.votes?.disliked || 0,
              comments: article.votes?.comments || 0,
            },
          })),
        },
      };
    } catch (error) {
      console.error("Error in getBearishCryptoNewsTool:", error);
      
      let errorMessage = "Failed to fetch bearish crypto news";
      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage = "CryptoPanic API is temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes("401") || error.message.includes("403")) {
          errorMessage = "API authentication failed. Please check the API key configuration.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
        } else {
          errorMessage = `API Error: ${error.message}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
}); 