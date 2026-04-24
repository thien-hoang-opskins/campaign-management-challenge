# VS-02 Decisions

## DEC-01: Strengthen Required Text Validation with Trimmed Inputs

### Context

`VS-02` requires clear validation errors for invalid create payloads. A plain `min(1)` check allows whitespace-only values.

### Alternatives Considered

1. Keep existing `min(1)` validation.
2. Trim values before validation and enforce non-empty.

### Decision

Apply `.trim().min(1)` for `name`, `subject`, and `body` in `createCampaignSchema`.

### Consequences

- Whitespace-only submissions are rejected consistently.
- Validation behavior better matches user expectations and acceptance criteria.

---

## DEC-02: Keep Duplicate Prevention in Service Layer and Validate with Tests

### Context

`VS-02` requires preventing duplicate recipient links within the same campaign.

### Alternatives Considered

1. Rely only on DB uniqueness constraints.
2. Normalize/deduplicate in service layer and retain conflict-safe inserts.

### Decision

Keep service-layer deduplication (`Set` + lowercase normalization) and `ignoreDuplicates` in link insertion; add explicit tests.

### Consequences

- Reduces unnecessary DB work for duplicate inputs.
- Keeps behavior deterministic for varied user input casing and repeated emails.

---

## DEC-03: Use In-Page Typed Validation for Frontend Create Form

### Context

Frontend required typed validation and clearer recipient input UX, but current stack had no dedicated form/validation library configured.

### Alternatives Considered

1. Add new form/validation dependencies.
2. Implement typed validation logic locally in `CampaignCreatePage`.

### Decision

Implement local typed validation helpers and field error state in `CampaignCreatePage`.

### Consequences

- Meets story requirements without expanding dependency surface.
- Keeps implementation minimal and focused on `VS-02` scope.
