# Skill: Refactor

Guidelines for refactoring code in this project without changing behaviour.

## Rules
- Read all affected files before proposing changes
- Do not change public API signatures without updating all call sites
- Do not rename Zustand store keys without updating all consumers
- Do not move files without updating all imports
- Prefer editing existing files over creating new ones
- Run `pnpm build` mentally — ensure no TypeScript errors introduced

## Common Refactors in This Project

### Extract a reusable hook
Place in `hooks/` — import from there, not inline in components.

### Split a large component
If a component exceeds ~200 lines, consider splitting into sub-components in the same folder.

### Consolidate duplicate intent logic
Duplicate regex/intent matching between `app/api/chat/` and `app/api/chat-mock/` should stay separate — mock is intentionally offline.

### Move types
Shared types go in `lib/types.ts`. Campaign-specific types go in `lib/campaign-types.ts`. Do not inline types in component files.
