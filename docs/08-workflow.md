# ROADIS Web --- Vibe Coding Workflow

## Golden loop

`Requirement → Inspect → Plan → Implement → Typecheck → Lint → Build → Review → Fix → Commit`.

## Analyze-first prompt

``` text
Read AGENTS.md and relevant docs. Inspect existing source and backend routes/controllers when API-related. Do not code yet.
Analyze requirements, UI, data, API, permissions, states, reusable components, backend gaps and risks. Mark missing facts UNKNOWN. Return plan and files to change.
```

## Implement prompt

``` text
Implement only the approved plan. Reuse existing shell/components. Do not invent endpoints, fields or production data. Include loading/empty/error/401/403 states. Run lint, typecheck and build. Report changed files, checks and remaining gaps.
```

## Review prompt

``` text
Do not modify code. Review against AGENTS.md, PRD, requirements, design, role permissions, API contract and backend reality. Find API hallucinations, permission leaks, fake data, duplication, missing states, accessibility and responsive issues. Classify CRITICAL/HIGH/MEDIUM/LOW.
```

## Task size

One vertical slice at a time: login, shell, report table, report detail,
status update, map, chat, etc. Do not ask an agent to build the entire
web in one prompt.

## Git

Use focused branches/commits such as `feat(auth): add admin login` and
`feat(reports): add report detail`.

## Definition of done

UI, API, permission, states, tests/checks and documentation all agree.
No fake production data.
