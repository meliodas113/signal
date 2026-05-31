export type Program = "SBIR" | "STTR";
export type Verdict = "Strong match" | "Possible" | "Weak" | "Skip";
export type PhaseInterest = "Phase I" | "Phase II" | "Either";

/** Shaped like an SBIR.gov solicitation_topics record. */
export interface Solicitation {
  id: string;
  title: string;
  agency: string;
  branch: string;
  program: Program;
  phase: string;
  /** ISO date string for the application due date */
  due: string;
  topic: string;
}

export interface MatchScore {
  id: string;
  fit_score: number;
  verdict: Verdict;
  why: string;
  next_step: string;
  eligibility_flag: string | null;
}

export interface SetAsideFlags {
  woman: boolean;
  hubzone: boolean;
  disadvantaged: boolean;
  firstTime: boolean;
}

export interface Profile {
  company: string;
  tech: string;
  phase: PhaseInterest;
  agencies: string[];
  flags: SetAsideFlags;
}

export const VERDICT_ORDER: Record<Verdict, number> = {
  "Strong match": 0,
  Possible: 1,
  Weak: 2,
  Skip: 3,
};
