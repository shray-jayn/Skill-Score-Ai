import { CoachingSession, CoachingStyleTimechartData, RoundFeedback, StyleFeedback, TranscriptionData } from "../coaching-session/coaching-session.model";

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

export interface CoachingStyle {
    coaching_style: string;
    count: number;
    percentage: number;
}

export interface CoachingStyleStatsEntry {
    command: string;
    rowCount: number;
    oid: null;
    rows: CoachingStyle[]; // ✅ Correctly defining rows as an array of CoachingStyle
    fields: Array<{
        name: string;
        tableID: number;
        columnID: number;
        dataTypeID: number;
        dataTypeSize: number;
        dataTypeModifier: number;
        format: string;
    }>;
}

export interface CoachingStyleStatsResponse {
    success: boolean;
    data?: CoachingStyleStatsEntry[]; 
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
