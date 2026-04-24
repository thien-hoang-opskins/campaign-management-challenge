Implement one vertical user story in this repository.

Inputs:
- STORY_ID: `<replace-with-story-id>` (example: `VS-04`)

Primary sources:
- `docs/features/vertical-user-stories.md`
- `docs/features/enablers-and-spikes.md`
- `backend/docs/initial-requirements/*`
- `frontend/docs/initial-requirement/*`

Execution requirements:
1) Locate `STORY_ID` in `docs/features/vertical-user-stories.md` and treat it as the implementation contract.
2) Read and implement only the subtasks and acceptance criteria for the selected story.
3) Resolve required dependencies from `Depends on`:
   - Ensure required enablers from `docs/features/enablers-and-spikes.md` are present/implemented as needed.
   - If dependent enablers or constraints require design choices, document the decision before coding.
4) Keep scope strict:
   - Do not implement unrelated stories.
   - Do not add features outside selected story + required dependencies.
5) Implement backend + frontend changes needed for end-to-end completion of the selected story.
6) Add or update tests for changed behavior.
7) Run validation commands and include results in documentation.

Documentation and tracking (mandatory):
Create a story workspace under:
- `docs/implementation/<STORY_ID>/`

Create these files:
1) `docs/implementation/<STORY_ID>/README.md`
   - Story summary
   - Acceptance criteria checklist
   - Scope included/excluded
   - File change map (backend/frontend/docs/tests)
2) `docs/implementation/<STORY_ID>/progress-log.md`
   - Chronological progress entries
   - Blockers, decisions, resolutions
   - Next actions
3) `docs/implementation/<STORY_ID>/architecture.md`
   - Data flow and request flow explanation
   - Mermaid diagram(s) for relevant architecture/interaction flow
   - Boundary definitions (frontend/backend/db/external)
4) `docs/implementation/<STORY_ID>/decisions.md`
   - Decision records with context, alternatives, decision, consequences
   - Link to any ADR-style rationale when trade-offs are non-trivial
5) `docs/implementation/<STORY_ID>/test-report.md`
   - Test plan
   - Seeders for testing
   - Commands run
   - Pass/fail outcomes
   - Known gaps and risk notes

Mermaid requirements:
- Use valid Mermaid syntax.
- Use simple node IDs without spaces.
- Prefer one high-level flow diagram plus one focused sequence/state diagram when relevant.

Quality gates (must pass before marking done):
- Acceptance criteria from selected story are all mapped to implementation evidence.
- Business rules and error paths are covered by tests.
- No silent UI failures for affected flows.
- Lint/typecheck/build/test pass for touched workspaces.
- Documentation files above are complete and internally consistent.

Output format at completion:
1) Story implemented: `<STORY_ID>`
2) Acceptance criteria status: checklist with evidence
3) Changed files: grouped by backend/frontend/docs/tests
4) Decisions made: concise list with links to `decisions.md`
5) Validation results: commands + outcomes
6) Follow-up recommendations:
   - Technical debt
   - Optional enhancements
   - Candidate next story IDs

Helpful defaults:
- If the selected story has ambiguous requirements, prefer strict contract adherence from story text and linked requirement docs.
- If multiple valid implementations exist, choose the smallest maintainable option and document why.
- Keep backward compatibility for existing endpoints/contracts unless the story explicitly requires a contract change.
