# Personas

Three real users. The dashboard must serve all three, but the **primary** persona drives v1
decisions. The biggest current-product blind spot is treating all three identically.

---

## 🥇 PRIMARY — "Maya," the first-time technical founder

- **Who:** Solo or 2–3 person deep-tech startup (hardware, AI, bio, energy). PhD or strong
  engineering background. Has a product/prototype and maybe 1–2 commercial signals. Never won an
  SBIR.
- **Job-to-be-done:** *"Is there non-dilutive federal money that fits what I actually built, and can
  I realistically win it before the deadline — without spending 3 weeks learning a bureaucracy?"*
- **Pains:**
  - Doesn't know which of 11 agencies even fund her domain.
  - Can't tell keyword-adjacent topics from real fit; afraid of wasting a week on a 5%-shot proposal.
  - **Doesn't know registration takes 6+ weeks** — discovers it too late.
  - Realistic win rate as a first-timer is lower and agency-dependent; she has no way to know this.
- **What SIGNAL must give her:** brutal, honest triage ("skip this"), a realistic shot estimate, and
  an early, loud warning about registration lead time. **Her trust is won by SIGNAL telling her NOT
  to apply to things.**
- **Maps to existing code:** `flags.firstTime`, `Profile.tech`, the verdict layer. Today the
  `firstTime` flag is collected but barely used — that's a gap.

---

## 🥈 SECONDARY — "Devin," the repeat / portfolio operator

- **Who:** Has won 1+ SBIR awards; running multiple proposals per cycle, possibly across agencies.
  May be a fractional grants lead or a founder who's now a semi-pro at this. (DoD's repeat-winner
  concentration is real — these users exist and are valuable.)
- **Job-to-be-done:** *"Maximize award throughput. Never miss a cycle. Know where each opportunity
  sits in my pipeline and the funnel."*
- **Pains:** managing many deadlines and many proposals-in-flight; sequencing Phase I vs II vs D2P2;
  remembering which agency's portal/format each needs.
- **What SIGNAL must give him:** pipeline/Kanban over the tracked list, funnel-stage awareness,
  bulk triage, saved searches & alerts, calendar/export.
- **Maps to existing code:** the `tracked` view — currently a flat deadline list, needs to become a
  pipeline. `phase` interest exists; funnel stage does not.

---

## 🥉 TERTIARY — "Priya," the ecosystem enabler

- **Who:** Accelerator program manager, university tech-transfer office, state SBIR matching-fund
  administrator, or VC scout. Advises/serves *many* startups.
- **Job-to-be-done:** *"Surface the right opportunities to my portfolio companies and prove the
  program creates value."*
- **Pains:** doing per-company discovery manually; reporting on outcomes.
- **What SIGNAL might give her (later):** multi-company workspaces, shareable shortlists, a
  reporting view. **Likely the eventual B2B revenue path**, but explicitly *not* a v1 priority.

---

## Persona → product implications

| Decision | Driven by |
|----------|-----------|
| Default to brutal honesty in verdicts | Maya |
| Surface registration-readiness loudly & early | Maya |
| Realistic "shot estimate" using win-rate + experience | Maya |
| Pipeline/Kanban + funnel stage on tracked items | Devin |
| Saved searches, alerts, calendar export | Devin |
| Award/competitive intelligence ("who won this") | Maya + Devin |
| Multi-company / team workspaces | Priya (later) |

**v1 rule of thumb:** if a feature doesn't help Maya decide *go / no-go / not-yet* on a specific
opportunity, it waits.
