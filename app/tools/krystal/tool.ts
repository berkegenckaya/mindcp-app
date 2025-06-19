/* import { tool } from "ai";
import { z } from "zod";
import axios from 'axios';

const API_BASE_URL = "https://api.krystal.app";

export const token_info = tool({
  description:
    "Fetches and displays the current sentiment for a given cryptocurrency token. IMPORTANT: This tool will render the sentiment data. Do not summarize or explain the sentiment data as your text response.",
  parameters: z.object({
    tokenSymbol: z.string().describe("The symbol of the token to get sentiment for (e.g., BTC, ETH)."),
  }),
  execute: async ({ tokenSymbol }) => {
    try {
      const endpointPath = "/all/v1/ai/tokenSentiment";
      // Construa manualmente a URL com o parâmetro de consulta
      const manuallyConstructedUrl = `${API_BASE_URL}${endpointPath}?token=${encodeURIComponent(tokenSymbol)}`;

      console.log("Attempting to GET with manually constructed URL:", manuallyConstructedUrl); 

      // Faça a requisição GET usando axios com a URL já completa
      const response = await axios.get(manuallyConstructedUrl, {
        // Não precisamos mais do objeto 'params' aqui, pois a URL já os contém
        headers: {
          "Content-Type": "application/json",
          // Adicione quaisquer outros cabeçalhos necessários aqui
          // "Authorization": `Bearer YOUR_API_KEY`,
        },
      });

      const apiResponse = response.data;
      console.log("API Response data:", apiResponse);

      if (apiResponse && apiResponse.success === false) {
        throw new Error(apiResponse.message || "API indicated an error in its response body");
      }

      const sentimentData = apiResponse.data || apiResponse; 

      if (typeof sentimentData !== 'object' || sentimentData === null || Object.keys(sentimentData).length === 0) {
         // Verifique se apiResponse em si é o dado esperado, caso contrário, pode ser um problema
         if (!(apiResponse && typeof apiResponse === 'object' && Object.keys(apiResponse).length > 0 && sentimentData === apiResponse)) {
            console.warn("Sentiment data extracted is empty or not an object:", sentimentData, "Original API Response:", apiResponse);
         }
      }

      return {
        success: true,
        data: sentimentData,
        displayType: "TokenSentimentDisplay",
      };
    } catch (error) {
      console.error("Error fetching token sentiment:", error);
      let errorMessage = "Failed to fetch token sentiment: Unknown error";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          const errorStatus = error.response.status;
          const serverMessage = typeof errorData === 'string' 
            ? errorData 
            : (errorData?.error || errorData?.message || JSON.stringify(errorData));
          errorMessage = `API request failed with status ${errorStatus} using URL ${error.config?.url}: ${serverMessage}`;
        } else if (error.request) {
          errorMessage = `API request failed: No response received from server. URL: ${error.config?.url}`;
        } else {
          errorMessage = `API request setup failed: ${error.message}. URL: ${error.config?.url}`;
        }
      } else if (error instanceof Error) {
        errorMessage = `Failed to fetch token sentiment: ${error.message}`;
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
}); */