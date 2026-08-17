# CodeNova Editor

CodeNova Editor is an AI-assisted browser coding platform built with Next.js. It lets users create template-based projects, edit files in a Monaco-powered playground, preview runnable code in a WebContainer environment, and ask Groq-powered AI for coding help without leaving the workspace.

## Overview

CodeNova is designed as a lightweight cloud IDE experience for quickly starting and iterating on web projects. Users can sign in, create a playground from a starter template, manage their projects from a dashboard, edit project files in the browser, save changes, and use AI chat or inline suggestions while coding.

Core platform areas:

- Landing page with CodeNova product positioning and dashboard entry point.
- Authenticated dashboard for creating, opening, editing, duplicating, deleting, and starring playgrounds.
- Template selection flow for frontend, backend, and fullstack starters.
- Browser playground with file explorer, Monaco editor, resizable live preview, and project save workflow.
- AI coding assistant panel powered by Groq chat completions.
- Inline AI code-completion endpoint that analyzes cursor context and returns focused suggestions.
- MongoDB persistence through Prisma for users, accounts, playgrounds, stars, saved template files, and chat messages.
- WebContainer support for running and previewing supported templates inside the browser.

## Tech Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4, shadcn/ui-style components, Radix UI primitives
- **Editor:** Monaco Editor through `@monaco-editor/react`
- **Runtime preview:** StackBlitz WebContainers through `@webcontainer/api`
- **Terminal UI:** Xterm.js packages
- **Auth:** NextAuth v5 with GitHub and Google providers
- **Database:** MongoDB with Prisma
- **AI provider:** Groq OpenAI-compatible chat completions API
- **State management:** Zustand for playground file state
- **Notifications:** Sonner
- **Markdown rendering:** React Markdown with GFM, math, and KaTeX support

## Main Features

### Authentication

CodeNova uses NextAuth with JWT sessions and Prisma-backed account linking. Current providers are:

- GitHub
- Google

User sessions include the user ID and role so authenticated server actions can associate dashboards and playgrounds with the current user.

### Dashboard

The dashboard is the user home for project management. It shows the current user's playgrounds and provides actions for:

- Creating a new playground
- Opening a playground
- Opening a playground in a new tab
- Editing project title and description
- Duplicating a project record
- Copying a playground URL
- Deleting a project
- Marking or unmarking projects as starred

### Starter Templates

Users can create projects from templates grouped by frontend, backend, and fullstack categories.

Supported template options in the UI:

- React
- Next.js
- Express
- Vue.js
- Hono
- Angular

Template source folders are stored under `stater_files/`. When a playground is opened for the first time, the app converts the selected starter folder into a JSON file-tree structure and loads it into the editor.

### Playground Workspace

The playground is the primary coding surface. It includes:

- Sidebar file explorer
- File and folder creation
- File and folder rename
- File and folder delete
- Multi-file tabs
- Unsaved-change indicators
- Save current file
- Save all changed files
- `Ctrl+S` save shortcut
- Resizable editor and preview panels
- Toggleable preview panel
- Monaco editor integration
- WebContainer file syncing for live preview

Saved code is persisted in the `TemplateFile` collection and linked one-to-one with the playground.

### AI Chat

The CodeNova Copilot side panel is a Groq-powered coding assistant. It supports several modes:

- Chat
- Code review
- Error fixing
- Optimization

The panel also includes:

- Searchable message history in the current session
- Message type filters
- Quick prompts
- Model selector
- Copy message action
- Export chat as JSON
- Markdown, code block, table, and math rendering

### AI Code Completion

The `/api/code-completion` endpoint accepts file content, cursor position, suggestion type, and optional filename. It detects:

- Programming language
- Framework
- Nearby context
- Current line
- Whether the cursor appears to be inside a function or class
- Whether the cursor is after a comment
- Common incomplete code patterns

It then asks Groq for a short insertion-only suggestion suitable for the cursor position.

## Project Structure

```text
.
├── app/                         # Next.js App Router pages, layouts, and API routes
│   ├── (auth)/                  # Sign-in route group
│   ├── (root)/                  # Public landing page
│   ├── api/                     # Auth, chat, template, and code-completion APIs
│   ├── dashboard/               # Authenticated dashboard route
│   └── playground/[id]/         # Browser IDE route
├── components/                  # Shared UI components and providers
├── hooks/                       # Shared hooks
├── lib/                         # Database, Groq client, template paths, utilities
├── modules/                     # Feature modules
│   ├── ai-chat/                 # Copilot side panel
│   ├── auth/                    # Auth helpers and user actions
│   ├── dashboard/               # Dashboard actions and components
│   ├── playground/              # Editor, file explorer, playground hooks and logic
│   └── webcontainers/           # WebContainer preview and runtime hook
├── prisma/                      # Prisma schema
├── public/                      # Static assets and template icons
├── stater_files/                # Starter template source projects
└── output/                      # Temporary generated template JSON output
```

## Database Models

The Prisma schema uses MongoDB and defines these main models:

- `User`: Application users with roles, accounts, playgrounds, starred playgrounds, and chat messages.
- `Account`: OAuth provider account data linked to users.
- `Playground`: User-created coding projects with title, description, selected template, and template files.
- `StarMark`: Per-user starred state for playgrounds.
- `TemplateFile`: Saved JSON file-tree content for a playground.
- `ChatMessage`: Stored chat message model for future AI conversation persistence.

User roles:

- `ADMIN`
- `USER`
- `PREMIUM_USER`

Template enum values:

- `REACT`
- `NEXTJS`
- `EXPRESS`
- `VUE`
- `HONO`
- `ANGULAR`

## API Routes

### `POST /api/chat`

Generates an AI assistant response using Groq. The request body includes:

```json
{
  "message": "Explain this code",
  "history": [],
  "model": "openai/gpt-oss-20b"
}
```

The response includes the generated text, model name, token usage when available, and timestamp.

### `POST /api/code-completion`

Generates an inline code suggestion for the current editor cursor position.

```json
{
  "fileContent": "const message =",
  "cursorLine": 0,
  "cursorColumn": 15,
  "suggestionType": "completion",
  "fileName": "app.ts"
}
```

### `GET /api/template/[id]`

Loads the selected playground template, converts the starter folder into a JSON file tree, and returns it to the playground.

## Environment Variables

Create a `.env` file in the project root with these values:

```env
DATABASE_URL="mongodb+srv://..."
AUTH_SECRET="your-nextauth-secret"

AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"

AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="openai/gpt-oss-20b"
```

`GROQ_MODEL` is optional. If it is not set, the app defaults to `openai/gpt-oss-20b`.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

The project runs Prisma generation after install, but you can also run it manually:

```bash
npx prisma generate
```

### 3. Configure environment variables

Add the required variables listed above to `.env`.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev      # Start the Next.js development server
npm run build    # Build the production app
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## WebContainer Requirements

The app sets the following response headers in `next.config.ts`:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

These headers are required for WebContainer browser runtime support.

## Notes and Current Limitations

- The Hono template path currently points to `/stater_file/hono-nodejs-starter`, while the repository folder is `stater_files/hono-nodejs-starter`. Update `lib/template.ts` before using the Hono template.
- Project duplication currently copies playground metadata only. Template file duplication is marked as a TODO in the dashboard action.
- Chat messages are modeled in Prisma, but the current AI chat panel keeps the visible conversation in component state.
- The root metadata still uses the default Next.js title and description. Update `app/layout.tsx` before deploying publicly.

## Deployment

The application can be deployed anywhere that supports Next.js and environment variables. For Vercel deployment:

1. Add all environment variables in the project settings.
2. Ensure MongoDB allows connections from the deployment environment.
3. Confirm OAuth callback URLs are configured for the deployed domain.
4. Build with `npm run build`.

## Platform Summary

CodeNova Editor combines project templates, authenticated project management, an in-browser IDE, WebContainer previews, and Groq-powered AI assistance into one coding workspace. It is best suited for quickly creating starter projects, experimenting with frontend and backend templates, and getting AI help while editing code directly in the browser.
