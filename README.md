# fyre

[![Deploy to Azure SWA](https://github.com/sixfortyfour/fyre-vue/actions/workflows/azure-swa.yml/badge.svg)](https://github.com/sixfortyfour/fyre-vue/actions/workflows/azure-swa.yml)

Burn-after-reading message app. Send a secret — it self-destructs after the recipient reads it.

## Stack

- Vue 3 + TypeScript + Vite (frontend)
- Azure Functions v4 TypeScript (API)
- Upstash Redis (storage)
- Azure Static Web Apps (hosting)

## Local development

Install dependencies:

```sh
npm install
cd api && npm install && cd ..
```

Start the Vite dev server (frontend only, no API):

```sh
npm run dev
```

Start the full stack with the SWA CLI (requires Node 20, Azure Functions Core Tools v4):

```sh
swa start --config swa-cli.config.json
```

The full stack runs at `http://localhost:4280`.

## Environment variables

Create `.env.local` in the repo root for local development:

```
UPSTASH_REDIS_REST_URL=https://<your-instance>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your-token>
```

For Azure deployment, add these as application settings in the Static Web App resource (not as GitHub secrets — the SWA action copies `api/local.settings.json` values automatically, or you set them in the Azure portal).

The `AZURE_SWA_TOKEN` GitHub secret must be set to the deployment token from the Azure portal (Static Web Apps > Manage deployment token).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build frontend |
| `npm run type-check` | Run vue-tsc |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run lint` | Run oxlint + eslint |
| `cd api && npm run build` | Compile API TypeScript |
