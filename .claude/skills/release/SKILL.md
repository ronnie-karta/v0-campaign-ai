# Skill: Release Checklist

Steps to follow before committing and pushing a release.

## Pre-commit
- [ ] `pnpm build` passes with no errors
- [ ] `pnpm lint` passes
- [ ] No `.env` secrets committed (check `.gitignore`)
- [ ] `N8N_WEBHOOK_URL` reads from env, not hardcoded
- [ ] No `console.log` in production paths (`app/api/chat/route.ts`, store actions)

## Commit Message Format
```
<type>: <short description>

<optional body>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
Types: `feat`, `fix`, `chore`, `refactor`, `docs`

## Environment Variables to Verify
```
DATABASE_URL          ✓ set in hosting platform
N8N_WEBHOOK_URL       ✓ points to production n8n instance
```

## Post-deploy
- [ ] Test chat widget sends message and receives AI response
- [ ] Test campaign creation flow (all 5 steps)
- [ ] Verify n8n workflow is active on production instance
