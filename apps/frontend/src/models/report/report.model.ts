import { CoachingSession, CoachingStyle, CoachingStyleTimechartData, RoundFeedback, StyleFeedback, TranscriptionData } from "../coaching-session/coaching-session.model";

export interface FetchSessionsRequest {
    userId: string;
    limit?: number;
    offset?: number;
}
export interface FetchSessionsResponse {
    success: boolean; 
    data?: CoachingSession[]; 
    message?: string; 
    error?: string; 
}

export interface FetchFeedbackRequest {
    roundId: string; 
}

export interface FetchFeedbackResponse {
    success: boolean; 
    data?: {
        roundFeedback: RoundFeedback[]; 
        styleFeedback: StyleFeedback[];
    };
    error?: string; 
}

export interface CoachingStyleStatsRequest {
    coachingRoundId: string;
}

export interface CoachingStyleStatsResponse {
    success: boolean;
    data?: CoachingStyle[][];
    error?: string;
}

export interface CoachingStyleTimechartRequest {
    roundId: string;
}

export interface CoachingStyleTimechartResponse {
    success: boolean;
    data?: CoachingStyleTimechartData[];
    message?: string;
    error?: string;
}

export interface TranscriptionsRequest {
    coachingSessionName: string;
}

export interface TranscriptionsResponse {
    success: boolean;
    data?: TranscriptionData[];
    error?: string;
}
