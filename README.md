# moonklabs-homepage v2

## Deploy to AWS Amplify with GitHub Actions

This repo deploys to AWS Amplify through `.github/workflows/deploy-amplify.yml`.

### Required GitHub configuration
- Repository secret: `AWS_ACCESS_KEY_ID`
- Repository secret: `AWS_SECRET_ACCESS_KEY`
- Repository variable: `AWS_REGION`
- Repository variable: `AMPLIFY_APP_ID`
- Repository variable: `AMPLIFY_BRANCH`

### Deployment flow
1. GitHub Actions runs on pushes to `main` or manual dispatch.
2. The workflow installs dependencies, runs lint, and builds the static Next.js export.
3. The workflow uploads `site.zip` to Amplify using `create-deployment` / `start-deployment`.
4. Amplify serves the site from the configured branch URL.
