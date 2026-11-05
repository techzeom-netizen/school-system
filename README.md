# School-System

School-System is a React and TypeScript school website with a role-based school ERP portal. The public website is branded as **Demo School** until the final school name and logo are supplied.

## What is included

- Public school homepage at `/`
- School sections for about, academics, campus life, admissions, and news
- Shared portal login at `/login`
- Protected dashboard routes for school administration and internal users
- Reusable form fields, buttons, dialogs, tables, layouts, and dashboard components
- Responsive desktop and mobile navigation

The public site is intentionally separate from the portal. Visitors see the school website first, while authenticated users are redirected to the appropriate dashboard.

## User roles

The portal is designed for these school audiences:

- Administrator
- Management
- Teacher
- Staff
- Parent

The authentication and dashboard routing currently use the existing role configuration in `src/types` and `src/routes`. As the backend role names are finalized, those values can be mapped directly to the school roles above.

## Tech stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Redux Toolkit
- Radix UI primitives
- TanStack Table
- Recharts
- Axios

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Getting started

Install dependencies:

```bash
npm install
```

Create a local environment file from the example:

```bash
copy env.example .env
```

Start the development server:

```bash
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

## Available scripts

| Script                 | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Vite development server        |
| `npm run build`        | Type-check and create a production build |
| `npm run type-check`   | Run TypeScript without emitting files    |
| `npm run lint`         | Run ESLint                               |
| `npm run lint:fix`     | Fix automatically fixable ESLint issues  |
| `npm run format`       | Format the repository with Prettier      |
| `npm run format:check` | Check Prettier formatting                |
| `npm run preview`      | Serve the production build locally       |

## Project structure

```text
src/
├── components/       Shared UI, layout, auth, and dashboard components
├── contexts/         Authentication, theme, and branding providers
├── features/         Feature-specific portal modules
├── layouts/          Public and protected application layouts
├── pages/            Route-level pages and dashboards
├── services/         API and authentication service modules
├── types/            Shared TypeScript types
├── websites/         Public website pages
└── routes/           Application route configuration
```

The public homepage is implemented in [src/websites/SchoolHomePage.tsx](./src/websites/SchoolHomePage.tsx). Public route selection is handled in [src/pages/WebsiteApp.tsx](./src/pages/WebsiteApp.tsx).

## Branding

The temporary public brand is **Demo School**. To replace it later:

1. Update the school name and contact details in `src/websites/SchoolHomePage.tsx`.
2. Update the shared defaults in `src/contexts/BrandingContext.tsx`.
3. Replace the temporary logo asset references in the layout and login pages.
4. Update the browser title in `index.html`.
5. Update `VITE_APP_TITLE` in `env.example` and the local `.env` file.

Keep school-specific content, contact details, and media in one shared configuration once the final branding is available.

## Shared component rules

Before adding UI, check the existing shared components first. Application forms should use `src/components/common/FormField.tsx`, data tables should use `src/components/common/TanStackTable.tsx`, dialogs should use `src/components/ui/dialog.tsx`, and buttons should use `src/components/ui/button.tsx`.

These conventions are documented in [AGENTS.md](./AGENTS.md) and should be followed for new portal work.

## Environment configuration

Use `env.example` as the starting point for local configuration. Do not commit secrets or production credentials. Backend/API values should be supplied through local environment variables or the deployment environment.

## Production checklist

Before deployment:

1. Replace `Demo School` with the approved school name.
2. Add the approved school logo and image assets.
3. Replace placeholder email, phone, and address details.
4. Confirm role names and permissions with the backend API.
5. Run `npm run type-check`, `npm run lint`, and `npm run build`.
6. Test the public homepage, login, protected routes, and mobile layout.
