# VS-07 Decisions

## DEC-01: Deterministic Recipient Failure Policy by Email Local-Part

### Context

`VS-07` requires recipient statuses to end in `sent` or `failed` during send flow, but no external provider exists in MVP scope.

### Alternatives Considered

1. Mark all recipients as `sent`.
2. Introduce deterministic failure simulation rule.

### Decision

Classify recipients as failed when normalized email local-part contains `"fail"`; otherwise mark as sent.

### Consequences

- Enables stable, testable mixed outcomes without external integrations.
- Provides meaningful stats variation for UI verification.

---

## DEC-02: Keep Re-send Policy as `409 ALREADY_SENT`

### Context

Story allows documented idempotent conflict/no-op behavior after finalization.

### Alternatives Considered

1. Return no-op `200/202` for repeated sends.
2. Return deterministic conflict `409`.

### Decision

Keep conflict policy: `409` with machine-readable `ALREADY_SENT`.

### Consequences

- Explicit signal to clients that terminal state blocks re-send.
- Preserves current contract compatibility with existing error handling.

---

## DEC-03: Add Campaign Row Lock to Send Transaction

### Context

Concurrency protection is required to reduce double-send risk under simultaneous requests.

### Alternatives Considered

1. Lock only recipient rows.
2. Lock campaign row and recipient rows within transaction.

### Decision

Lock campaign row (`FOR UPDATE`) before processing recipient updates.

### Consequences

- Stronger protection against concurrent terminal-state transitions.
- Minimal complexity increase within existing transaction pattern.
