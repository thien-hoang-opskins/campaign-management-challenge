# VS-08 Decisions

## DEC-01: Centralize Frontend Error Message Resolution

### Context

Multiple pages independently rendered raw `error.message`, creating inconsistent UX and fragile fallback behavior.

### Alternatives Considered

1. Keep page-local error message handling.
2. Add shared utility for resolving API errors into user-facing text.

### Decision

Add `frontend/src/utils/getApiErrorMessage.ts` and use it across key flows.

### Consequences

- Consistent copy for recurring backend error codes.
- Reduced duplication and lower risk of silent or unclear error states.

---

## DEC-02: Normalize Network and Non-Envelope API Failures in Client Layer

### Context

The API client assumed all failed responses contained JSON error envelopes, which can break on network issues or unexpected responses.

### Alternatives Considered

1. Keep strict envelope assumption.
2. Add robust fallback normalization in API client.

### Decision

`request()` now catches network failures (`NETWORK_ERROR`) and malformed error payloads (`API_ERROR`) as `ApiError`.

### Consequences

- UI always receives predictable error objects.
- Eliminates brittle error parsing and hidden failure cases.

---

## DEC-03: Keep Inline Error Region Instead of Adding Toast System

### Context

`VS-08` requires meaningful error surfacing but does not mandate a specific visual channel.

### Alternatives Considered

1. Introduce global toast infrastructure.
2. Standardize on existing inline `ErrorAlert` regions.

### Decision

Retain inline `ErrorAlert` and standardize message sourcing.

### Consequences

- Meets acceptance criteria with minimal complexity.
- Leaves optional toast enhancement for later iteration.
