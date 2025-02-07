export interface FetchSessionsDropdownResponse {
  sessions: {
    coachingRoundId: string;
    coachingSessionName: string;
    coacheeName1: string | null;
    coacheeName2: string | null;
    coacheeName3: string | null;
    date: Date | null;
    round: number | null;
  }[];
}