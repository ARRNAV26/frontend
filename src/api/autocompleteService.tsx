import axios from "axios";
import { API_CONFIG } from '../config/apiConfig';

interface AutocompleteRequest {
  code: string;
  cursorPosition: number;
  language: string;
}

interface AutocompleteResponse {
  suggestion: string;
}

export const autocompleteService = {
  suggest: async (
    code: string,
    cursorPosition: number,
    language = "python"
  ): Promise<AutocompleteResponse> => {
    const res = await axios.post<AutocompleteResponse>(`${API_CONFIG.baseURL}/autocomplete`, {
      code,
      cursorPosition,
      language,
    } as AutocompleteRequest);
    return res.data;
  },
};
