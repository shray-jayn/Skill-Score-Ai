import {
    FetchSessionsRequest,
    FetchSessionsResponse,
    FetchFeedbackRequest,
    FetchFeedbackResponse,
    CoachingStyleStatsRequest,
    CoachingStyleStatsResponse,
    CoachingStyleTimechartRequest,
    CoachingStyleTimechartResponse,
    TranscriptionsRequest,
    TranscriptionsResponse,
} from "../models/report/report.model";
import apiClient from "./api.service";

export const coachingService = {
    async fetchSessions(payload: FetchSessionsRequest): Promise<FetchSessionsResponse> {
        try {
            const response = await apiClient.post("/fetch-sessions", payload);
            return response.data;
        } catch (error) {
            console.error("Error fetching sessions:", error);
            throw new Error("Unable to fetch sessions. Please try again.");
        }
    },

    async fetchFeedback(payload: FetchFeedbackRequest): Promise<FetchFeedbackResponse> {
        try {
            const response = await apiClient.post("/fetch-feedback", payload);
            return response.data;
        } catch (error) {
            console.error("Error fetching feedback:", error);
            throw new Error("Unable to fetch feedback. Please try again.");
        }
    },

    async getCoachingStyleStats(payload: CoachingStyleStatsRequest): Promise<CoachingStyleStatsResponse> {
        try {
            const response = await apiClient.get(`/coaching-style-stats/${payload.coachingRoundId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching coaching style stats:", error);
            throw new Error("Unable to fetch coaching style stats. Please try again.");
        }
    },

    async getCoachingStyleTimechart(payload: CoachingStyleTimechartRequest): Promise<CoachingStyleTimechartResponse> {
        try {
            const response = await apiClient.get(`/coaching-style-timechart/${payload.roundId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching coaching style timechart:", error);
            throw new Error("Unable to fetch coaching style timechart. Please try again.");
        }
    },

    async getTranscriptions(payload: TranscriptionsRequest): Promise<TranscriptionsResponse> {
        try {
            const response = await apiClient.get(`/transcriptions/${payload.coachingSessionName}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transcriptions:", error);
            throw new Error("Unable to fetch transcriptions. Please try again.");
        }
    },
};
