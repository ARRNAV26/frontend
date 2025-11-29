import axios from "axios";

const API_BASE = "http://localhost:8000";

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
    const res = await axios.post<AutocompleteResponse>(`${API_BASE}/autocomplete`, {
      code,
      cursorPosition,
      language,
    } as AutocompleteRequest);
    return res.data;
  },
};
