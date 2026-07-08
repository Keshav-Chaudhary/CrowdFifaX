# Deployment Guide

CrowdFifaX is designed to deploy instantly to Google Cloud Run utilizing a Docker container.

## Prerequisites
- Google Cloud Platform Account
- Billing Enabled (Free tier is sufficient for testing)
- `gcloud` CLI installed locally

## 1. Local Verification
Before deploying, always run the Staff Engineer audit checks:
```bash
npm run build
npm run test
npm run lint
npm run typecheck
```
Verify no errors occur.

## 2. Setting up Google Cloud Secret Manager
Your `GEMINI_API_KEY` must never be stored in plain text.
```bash
echo -n "your-key" | gcloud secrets create GEMINI_API_KEY --data-file=-
```

## 3. Deploying via Cloud Build
A `cloudbuild.yaml` is provided for CI/CD. To manually trigger:
```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 4. Environment Variables
Cloud Run requires the following mapped variables:
- `GEMINI_API_KEY` (mapped from Secret Manager)
- `GEMINI_MODEL` (e.g. `gemini-1.5-flash`)

## Continuous Integration
Any push to the `main` branch will trigger GitHub Actions (or Cloud Build Triggers if configured) to build, run tests, and automatically deploy a new revision.
