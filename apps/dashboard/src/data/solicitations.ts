import type { Solicitation } from "../types";
import { mkDue } from "../lib/dates";

/**
 * Demo feed shaped like SBIR.gov `solicitation_topics` records. In production
 * this comes from your server-side daily pull of the SBIR.gov Solicitations
 * API, stored in your database and read from there (not fetched in-browser).
 */
export const SOLICITATIONS: Solicitation[] = [
  {
    id: "AF243-D012",
    title: "Open Topic — Dual-Use Autonomy & Edge AI",
    agency: "DoD",
    branch: "Air Force / AFWERX",
    program: "SBIR",
    phase: "Phase I → Direct II",
    due: mkDue(9),
    topic:
      "Seeking commercially-mature autonomy, computer vision, and edge-inference technologies adaptable to contested ISR environments. Open topic: no predefined problem set — applicants propose a dual-use capability with an existing commercial traction signal. Strong preference for runtime inference on SWaP-constrained hardware.",
  },
  {
    id: "A24-118",
    title: "Trusted AI/ML for Battlefield Decision Support",
    agency: "DoD",
    branch: "Army",
    program: "SBIR",
    phase: "Phase I",
    due: mkDue(25),
    topic:
      "Develop explainable machine-learning models for real-time decision support under degraded, intermittent connectivity. Emphasis on model robustness against adversarial inputs, uncertainty quantification, and on-device operation. Prior commercial ML deployment experience is favorable.",
  },
  {
    id: "NSF-25-AM",
    title: "Advanced Manufacturing & Industrial Robotics",
    agency: "NSF",
    branch: "TIP",
    program: "SBIR",
    phase: "Phase I",
    due: mkDue(12),
    topic:
      "Funding for high-risk, high-reward innovations in robotics, automation, and advanced manufacturing processes with a clear path to commercialization. Open to a broad range of deep-tech approaches; must demonstrate technical novelty and a credible commercial market beyond government.",
  },
  {
    id: "NIH-NIAID-26",
    title: "Point-of-Care Diagnostics for Infectious Disease",
    agency: "HHS",
    branch: "NIH / NIAID",
    program: "SBIR",
    phase: "Phase I",
    due: mkDue(40),
    topic:
      "Rapid, low-cost diagnostic platforms deployable outside centralized labs. Interested in novel biosensing, microfluidics, and on-device signal processing. Hardware + software systems welcome. Clinical validation pathway should be addressed in the proposal.",
  },
  {
    id: "DOE-26-GS",
    title: "Grid-Scale Energy Storage Materials",
    agency: "DOE",
    branch: "Office of Science",
    program: "STTR",
    phase: "Phase I",
    due: mkDue(55),
    topic:
      "Novel materials and cell architectures for long-duration, grid-scale storage. STTR requires a partnership with a research institution. Battery chemistry, thermal management, and manufacturability innovations are all in scope.",
  },
  {
    id: "NASA-Z8",
    title: "In-Space Sensing & Autonomous Operations",
    agency: "NASA",
    branch: "STMD",
    program: "SBIR",
    phase: "Phase I",
    due: mkDue(18),
    topic:
      "Sensors, onboard autonomy, and data-processing systems for in-space manufacturing and servicing missions. Radiation-tolerant edge compute and autonomous fault detection are areas of high interest.",
  },
  {
    id: "DHS-S26",
    title: "First-Responder Situational Awareness Wearables",
    agency: "DHS",
    branch: "S&T",
    program: "SBIR",
    phase: "Phase I",
    due: mkDue(33),
    topic:
      "Wearable sensing and communication systems that improve first-responder safety in low-connectivity environments. Edge processing, low-power design, and ruggedization are key. Dual-use commercial markets are encouraged.",
  },
  {
    id: "NIH-NCI-26",
    title: "AI for Oncology Imaging Analysis",
    agency: "HHS",
    branch: "NIH / NCI",
    program: "STTR",
    phase: "Phase I",
    due: mkDue(48),
    topic:
      "Machine-learning tools for detection and characterization in radiological and pathological imaging. STTR partnership with a research institution required. Must address validation, bias, and regulatory pathway.",
  },
];
