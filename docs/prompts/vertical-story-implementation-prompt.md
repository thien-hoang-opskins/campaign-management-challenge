Implement one vertical user story in this repository.

Inputs:
- STORY_ID: `<replace-with-story-id>` (example: `VS-04`)

Primary sources:
- [docs/features/vertical-user-stories.md](../features/vertical-user-stories.md)
- [docs/features/enablers-and-spikes.md](../features/enablers-and-spikes.md)
- [Backend initial requirements (index)](../../backend/docs/initial-requirements/INDEX.md) and linked `.md` files in that folder
- [Frontend initial requirements (index)](../../frontend/docs/initial-requirement/INDEX.md) and linked `.md` files in that folder

Execution requirements:
1) Locate `STORY_ID` in [docs/features/vertical-user-stories.md](../features/vertical-user-stories.md) and treat it as the implementation contract.
2) Read and implement only the subtasks and acceptance criteria for the selected story.
3) Resolve required dependencies from `Depends on`:
   - Ensure required enablers from [docs/features/enablers-and-spikes.md](../features/enablers-and-spikes.md) are present/implemented as needed.
   - If dependent enablers or constraints require design choices, document the decision before coding.
4) Keep scope strict:
   - Do not implement unrelated stories.
   - Do not add features outside selected story + required dependencies.
5) Implement backend + frontend changes needed for end-to-end completion of the selected story.
6) Add or update tests for changed behavior.
7) Run validation commands and include results in documentation.

Documentation and tracking (mandatory):
Create a story workspace under `docs/implementation/<STORY_ID>/` (concrete example: [VS-01](../implementation/VS-01/README.md)).

Create these files (paths use your `STORY_ID`; [VS-01 example folder](../implementation/VS-01/README.md)):
1) [README.md](../implementation/VS-01/README.md) — story summary, acceptance criteria checklist, scope included/excluded, file change map (backend/frontend/docs/tests)
2) [progress-log.md](../implementation/VS-01/progress-log.md) — chronological progress entries; blockers, decisions, resolutions; next actions
3) [architecture.md](../implementation/VS-01/architecture.md) — data flow and request flow; Mermaid diagram(s); boundary definitions (frontend/backend/db/external)
4) [decisions.md](../implementation/VS-01/decisions.md) — decision records with context, alternatives, decision, consequences; link ADR-style rationale when trade-offs are non-trivial
5) [test-report.md](../implementation/VS-01/test-report.md) — test plan; seeders for testing; commands run; pass/fail outcomes; known gaps and risk notes

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
4) Decisions made: concise list with links to [decisions.md](../implementation/VS-01/decisions.md) for the story (use your `STORY_ID` path)
5) Validation results: commands + outcomes
6) Follow-up recommendations:
   - Technical debt
   - Optional enhancements
   - Candidate next story IDs

Helpful defaults:
- If the selected story has ambiguous requirements, prefer strict contract adherence from story text and linked requirement docs.
- If multiple valid implementations exist, choose the smallest maintainable option and document why.
- Keep backward compatibility for existing endpoints/contracts unless the story explicitly requires a contract change.
