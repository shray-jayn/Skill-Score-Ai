export interface CoachingSession {
    coaching_round_id: string; 
    coaching_session_name: string; 
    coachee_name: string;
    date: string; 
    round: number; 
}

export interface StyleFeedback {
    coaching_style: string; 
    style_explanation: string; 
}

export interface RoundFeedback {
    feedback_improvements: string;
}

export interface CoachingStyle {
    name: string;
    value: number;
   
}

export interface CoachingStyleTimechartData {
    coaching_style: string;
    section: string;
    round: number;
}

export interface TranscriptionData {
    speaker_id: string;
    transcribed_text: string;
}


 