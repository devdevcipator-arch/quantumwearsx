# Deployment Guidelines

## Account (important)

This platform must ALWAYS be deployed to the Vercel account that owns the domain `quantumwearx.com`:

- Vercel user: `quantumwearsx-ux` (`quantumwearsx@gmail.com`)
- Team / scope: `quantum-wear` (`team_FcPQHBUAwAT2q6lDIyUU8LyQ`)
- Project: `quantam-wear` (`prj_yw2Sl9ck17PXvWM9ZVrq0msBK2bg`)
- Production URLs: https://www.quantumwearx.com (primary), https://quantam-wear.vercel.app

Never deploy this platform to any other Vercel account or team (e.g. `project.school1344@gmail.com`, `projectschool1344-9616`, `thespartanleather77`). If `vercel whoami` does not return `quantumwearsx-ux`, stop and re-authenticate before deploying.

## Workflow

Always stage, commit, and push all changes to GitHub (`git push origin main`) and deploy to Vercel (`npx vercel --prod`) before providing the final update to the user.

After deploying, verify the live site (title/content) on https://www.quantumwearx.com before reporting success.
