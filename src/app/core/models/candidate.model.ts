
export type CandidateId = string;

export interface Candidate {
  id: CandidateId;
  name: string;                 
  email: string;                
  phone?: string;               
  age?: number;                 
  city?: string;                
  hobbies?: string | null;             
  why?: string | null;                 
  // --- media
  /**
   * Base64 data URL string (data:image/png;base64,...) or external url
   * recommended max size: 2 * 1024 * 1024 (2MB)
   */
  image?: string | null;
  summary?: string;       
  submittedAt: number;          
  updatedAt?: number;           
}

