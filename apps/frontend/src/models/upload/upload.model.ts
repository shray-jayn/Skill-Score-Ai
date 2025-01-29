export interface CheckTeamNameRequest {
    teamName: string;
  }
  
  export interface CheckTeamNameResponse {
    success: boolean;
    exists: boolean;
  }
  
  export interface FetchSessionsDropdownRequest {
    userId: string;
  }
  
  export interface FetchSessionsDropdownResponse {
    success: boolean;
    data: {
      coaching_round_id: string;
      coaching_session_name: string;
      coachee_name1: string;
      coachee_name2: string;
      coachee_name3: string;
      date: string;
      round: number;
    }[];
  }
  
  export interface GenerateSasRequest {
    filename: string;
  }
  
  export interface GenerateSasResponse {
    success: boolean;
    sasUrl: string;
    blobUrl: string;
  }
  
 export interface AnalyzeRequest {
  formattedDate: string; 
  teamName: string;      
  language: string;     
  coachingRound: string; 
  coacheeName1: string;  
  coacheeName2: string; 
  coacheeName3: string; 
  userId: string;        
  url: string;           
}

  
  export interface AnalyzeResponse {
    success: boolean;
    message: string;
  }