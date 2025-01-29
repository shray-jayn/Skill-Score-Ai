import {
    CheckTeamNameRequest,
    CheckTeamNameResponse,
    FetchSessionsDropdownRequest,
    FetchSessionsDropdownResponse,
    GenerateSasRequest,
    GenerateSasResponse,
    AnalyzeRequest,
    AnalyzeResponse,
  } from "../models/upload/upload.model";
  import apiClient from "./api.service";
  
  export const uploadService = {
  
    // Check team name
    async checkTeamName(payload: CheckTeamNameRequest): Promise<CheckTeamNameResponse> {
      try {
        const response = await apiClient.post<CheckTeamNameResponse>("/check-team-name", payload);
        return response.data;
      } catch (error) {
        console.error("Check team name failed:", error);
        throw new Error("Unable to check team name. Please try again.");
      }
    },
  
    // Fetch sessions dropdown
    async fetchSessionsDropdown(
      payload: FetchSessionsDropdownRequest
    ): Promise<FetchSessionsDropdownResponse> {
      try {
        const response = await apiClient.post<FetchSessionsDropdownResponse>(
          "/fetch-sessions-dropdown",
          payload
        );
        return response.data;
      } catch (error) {
        console.error("Fetching sessions dropdown failed:", error);
        throw new Error("Unable to fetch sessions dropdown. Please try again.");
      }
    },
  
    // Generate SAS URL
    async generateSas(payload: GenerateSasRequest): Promise<GenerateSasResponse> {
      try {
        const response = await apiClient.post<GenerateSasResponse>("/generate-sas", payload);
        return response.data;
      } catch (error) {
        console.error("SAS URL generation failed:", error);
        throw new Error("Unable to generate SAS URL. Please try again.");
      }
    },
  
    // Analyze
    async analyze(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
      try {
        const response = await apiClient.post<AnalyzeResponse>("/analyze", payload);
        return response.data;
      } catch (error) {
        console.error("Analyze operation failed:", error);
        throw new Error("Unable to analyze. Please try again.");
      }
    },
  };
  