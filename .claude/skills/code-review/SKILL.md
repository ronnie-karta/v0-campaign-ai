# Skill: Code Review

Review changed files in this Next.js/TypeScript project for correctness, security, and consistency with project conventions.

## Checklist

### TypeScript
- [ ] No `any` types without justification
- [ ] Proper typing for API request/response bodies
- [ ] Action payloads match types in `lib/types.ts`

### API Routes (`app/api/`)
- [ ] No secrets or credentials hardcoded — use `process.env`
- [ ] Input validated before use
- [ ] Errors returned with appropriate HTTP status codes
- [ ] No unused `messages` array sent to n8n (only `message` + `context`)

### React Components
- [ ] No direct DOM manipulation — use React state/refs
- [ ] `useEffect` deps array is correct
- [ ] No memory leaks (event listeners cleaned up)
- [ ] Tailwind classes use existing design tokens, not arbitrary values

### State (Zustand)
- [ ] State mutations happen inside store actions, not inline
- [ ] No store state duplication across stores

### General
- [ ] No `console.log` left in production code
- [ ] No dead code or commented-out blocks
- [ ] Follows existing file/folder conventions
