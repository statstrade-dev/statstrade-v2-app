# Statstrade v2 App

This repository contains the Statstrade frontend as a Yarn workspaces monorepo.
The checked-in application target is a Next.js web app, with shared UI,
feature, configuration, and generated integration packages alongside it.

## Stack

- Next.js 15 with the App Router
- React 19 and TypeScript/JavaScript
- Tamagui for the design system and theming
- React Native Web and selected Expo packages for cross-platform components
- Supabase for authentication and data access
- Stripe integrations for billing
- Storybook 9 with Vite for component and feature development
- Vitest for tests

The repository does not currently contain a native Expo application under
`app/expo`; the application entry point checked in here is the Next.js app.

## Repository layout

```text
app/
  nextjs/                  Next.js application and API routes

app-gen/
  edge/                    Shared generated edge, auth, and remote actions
  group/                   Shared generated group and Supabase actions
  edge-storybook/          Storybook for the generated edge modules

app-lib/
  config/                  Tamagui configuration, themes, tokens, and fonts
  config-eslint/           Shared ESLint configuration package
  avatar/                  Three.js/VRM avatar components
  component/               Shared UI and management components
  feature/                 Reusable product features
  component-storybook/     Storybook stories for shared components
  feature-storybook/       Storybook stories for shared features
```

The workspace package names are defined in the package manifests under
`app-gen/`, `app-lib/`, and `app/nextjs/`.

## Prerequisites

- Node.js 20.x
- Yarn 4.9.4

Enable Corepack if Yarn is not already available, then install the
dependencies from the repository root:

```sh
corepack enable
yarn install
```

## Environment

Create `app/nextjs/.env.local` for local development, or configure these
variables in the deployment environment. Set only the variables needed by the
features you are using.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anonymous key |
| `NEXT_SERVER_SUPABASE_URL` | Supabase URL for the server-only debug route |
| `NEXT_SERVER_SUPABASE_KEY` | Server-only Supabase key for the debug route |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe browser integration |
| `NEXT_PUBLIC_SITE_URL` | Site URL used for billing return URLs |
| `NEXT_PUBLIC_CONTACT_US_URL` | Destination used by the contact feature |

Never expose `NEXT_SERVER_SUPABASE_KEY` to the browser or commit environment
files. This repository does not include a local backend bootstrap script; the
Supabase service must be configured separately.

## Development

Start the Next.js development server from the repository root:

```sh
yarn dev
```

The same command can be run directly in the app workspace:

```sh
yarn workspace @statstrade/web-main dev
```

For a production Next.js build and local server:

```sh
yarn workspace @statstrade/nextjs build:app
yarn start
```

Tamagui extraction can be enabled while developing with:

```sh
yarn app:extract
```

## Tests, builds, and Storybook

Run the repository test suite:

```sh
yarn test
```

Useful validation commands include:

```sh
yarn check-tamagui
yarn workspace @statstrade/nextjs lint
yarn build
yarn build:all
```

`yarn build` runs the build scripts for the library workspaces. The Next.js
runtime build is the separate `build:app` command shown above.

The root Storybook command starts the shared component Storybook on port 6007:

```sh
yarn storybook
```

Other Storybook targets are available through their workspaces:

```sh
yarn workspace @statstrade/ui.storybook storybook       # port 6006
yarn workspace @statstrade/component-storybook storybook # port 6007
yarn workspace @statstrade/feature-storybook storybook   # port 6008
```

Build a static Storybook with the corresponding workspace's
`build:storybook` script.

## Other repository commands

```sh
yarn i18n:scan          # Scan translations
yarn i18n:scan:watch   # Watch files while scanning translations
yarn watch              # Watch workspace packages
```

Deployment configuration is kept with the Next.js app in
`app/nextjs/netlify.toml` and `app/nextjs/vercel.json`. Configure the
environment variables above in the selected hosting provider before
deploying.
