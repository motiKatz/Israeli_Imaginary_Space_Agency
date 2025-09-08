// src/app/core/models/candidate.model.ts

/**
 * ייחודי לכל מועמד (UUID string)
 */
export type CandidateId = string;

/**
 * המודל המלא של מועמד (ישמש ב־service, detail view, פריסה בדשבורד)
 */
export interface Candidate {
  id: CandidateId;
  name: string;                 // required, minLength 2
  email: string;                // required, valid email
  phone?: string;               // required on form, pattern e.g. /^[0-9+\- ]{7,15}$/
  age?: number;                 // required on form, min 18, max 80
  city?: string;                // required on form
  hobbies?: string;             // optional longer text
  why?: string;                 // required on form, minLength e.g. 20
  // --- media
  /**
   * Base64 data URL string (data:image/png;base64,...) or external url
   * recommended max size: 2 * 1024 * 1024 (2MB)
   */
  image?: string | null;
  summary?: string;             // short summary for list (e.g. first 120 chars of `why` or `hobbies`)
  // --- metadata
  submittedAt: number;          // epoch ms when first submitted
  updatedAt?: number;           // epoch ms when last updated (for edit window logic)
  // optional flag if record was created via admin/dashboard vs public
  source?: 'public' | 'admin' | 'import';
}

/**
 * שדות שמוצגים ברשימת מועמדים (קל לשאוב ולרנדר)
 */
export interface CandidateSummary {
  id: CandidateId;
  name: string;
  summary: string;
  age?: number;
  city?: string;
  image?: string | null;
  submittedAt: number;
  updatedAt?: number;
}

/**
 * טיפוס שמייצג את הערכים שבטופס (נוח ל־FormGroup.value)
 */
export interface CandidateFormValue {
  id?: CandidateId | '';
  name: string;
  email: string;
  phone: string;
  age: number | null;
  city: string;
  hobbies?: string;
  why?: string;
  image?: string | null; 
}

/**
 * פילטרים לשימוש בדשבורד (search + filtering)
 */
export interface CandidateFilter {
  q?: string;            // חיפוש חופשי (name / summary / email)
  city?: string;         // filter by city
  minAge?: number;
  maxAge?: number;
  hasImage?: boolean;    // only with/without image
  submittedAfter?: number; // epoch ms
  submittedBefore?: number;
}

/**
 * אופציות למיון ותיעוד פגישת רשימה
 */
export type CandidateSortField = 'submittedAt' | 'name' | 'age' | 'updatedAt';
export type CandidateSortDirection = 'asc' | 'desc';

export interface CandidateListOptions {
  filter?: CandidateFilter;
  sort?: { field: CandidateSortField; dir: CandidateSortDirection };
  page?: number;        // optional pagination
  pageSize?: number;
}

/**
 * תשובת service לרשימת מועמדים (יכולה לשמש גם ל־mock server)
 */
export interface CandidateListResponse {
  items: CandidateSummary[];
  total: number;
  page?: number;
  pageSize?: number;
}

/**
 * הממשק של תוצאות פעולות Service נפוצות
 */
export interface UpsertResult {
  ok: boolean;
  id?: CandidateId;
  error?: string;
}

/* ---------- הערות ולידציה (להעתקה לשימוש בטפסים) ----------
  - name: required, minLength: 2
  - email: required, Validators.email
  - phone: required, pattern: /^[0-9+\- ]{7,15}$/
  - age: required, min: 18, max: 80
  - city: required
  - why: required, minLength: 20 (להמליץ)
  - image: optional, accept only image/png,image/jpeg, max size 2MB
  - edit window: can edit if Date.now() - (updatedAt || submittedAt) < 3 * 24 * 60 * 60 * 1000
------------------------------------------------------------------ */
