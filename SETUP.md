# Military Document Formatter - Setup Guide

This document provides step-by-step instructions for setting up the development environment and configuring Tiptap Pro access.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Modern browser**: Chrome, Edge, or Firefox (latest version)

---

## Initial Setup

### 1. Clone or Initialize Repository

```bash
cd C:\Users\joncs\OneDrive\Desktop\MILdoc
git init
```

### 2. Configure Tiptap Pro Registry Access

You have a Tiptap Pro membership. To access Tiptap Pro packages, you need to configure npm with your authentication token.

#### Create `.npmrc` File

Create a `.npmrc` file in the project root directory:

```bash
# Windows Command Prompt
type nul > .npmrc

# Windows PowerShell
New-Item -ItemType File -Name .npmrc

# Git Bash / WSL
touch .npmrc
```

#### Add Tiptap Pro Configuration

Open the `.npmrc` file and add the following content:

```ini
@tiptap-pro:registry=https://registry.tiptap.dev/
//registry.tiptap.dev/:_authToken=Xg92iLk4Bs3r9dKk27HmM0d9a/HlEvnAQNX+PdE27xiZyo3+JSAEFSPn1s/9EllI
```

**Important**: This file contains your Tiptap Pro authentication token. **Do NOT commit it to version control.**

#### Add `.npmrc` to `.gitignore`

Create or update `.gitignore` to exclude `.npmrc`:

```bash
# Windows Command Prompt
echo .npmrc >> .gitignore

# Windows PowerShell
Add-Content -Path .gitignore -Value ".npmrc"

# Git Bash / WSL
echo ".npmrc" >> .gitignore
```

Verify `.npmrc` is listed in `.gitignore`:

```bash
cat .gitignore
```

You should see `.npmrc` in the output.

---

## Initialize Next.js Project

### 3. Create Next.js App with Tiptap Notion-like Editor

We'll use the Tiptap CLI to initialize a Next.js project with the Notion-like Editor template pre-configured.

**Important**: You need a Tiptap account with an active subscription or trial. If you don't have one:
1. Go to [cloud.tiptap.dev/register](https://cloud.tiptap.dev/register)
2. Create an account and activate a subscription or trial

#### Option A: New Project (Recommended for This Setup)

Run the Tiptap CLI to create a new Next.js project with the Notion-like Editor template:

```bash
npx @tiptap/cli@latest init notion-like-editor
```

**What this does**:
- Creates a new Next.js project with TypeScript and Tailwind CSS
- Installs the Notion-like Editor template with all required Tiptap extensions
- Sets up the component structure with hooks, icons, UI components, and nodes
- Configures Tiptap Collaboration and AI features (optional)

**Prompts** (if any):
- ✅ Project name → **MILdoc** (or press Enter to use current directory)
- ✅ Would you like to use TypeScript? → **Yes**
- ✅ Would you like to use Tailwind CSS? → **Yes**
- ✅ Would you like to use App Router? → **Yes**
- ✅ Would you like to use `src/` directory? → **Yes**

#### Option B: Existing Project (If You Already Have Next.js Set Up)

If you've already initialized a Next.js project, add the Notion-like Editor template:

```bash
npx @tiptap/cli@latest add notion-like-editor
```

**Note**: For this project, we recommend **Option A** to ensure all components are properly configured.

---

## Install Additional Dependencies

### 4. Install Additional Project Dependencies

After the Tiptap CLI setup, install additional dependencies for document parsing, storage, and authentication:

```bash
npm install zustand dexie mammoth pdfjs-dist clsx tailwind-merge lucide-react
```

**Additional Dependencies**:
- `zustand`: Lightweight state management
- `dexie`: IndexedDB wrapper for local storage
- `mammoth`: Word document parser
- `pdfjs-dist`: PDF text extraction
- `clsx`, `tailwind-merge`: Utility for conditional class names
- `lucide-react`: Icon library

**Note**: The Tiptap Notion-like Editor template already includes:
- All Tiptap core packages (`@tiptap/react`, `@tiptap/starter-kit`, etc.)
- Tiptap Pro extensions (drag handles, collaboration, AI, etc.)
- Pre-built UI components (slash commands, floating toolbar, etc.)

### 5. Install Clerk Authentication

```bash
npm install @clerk/nextjs
```

**Clerk**: Authentication and user management

### 6. Install Shadcn UI Components

The Tiptap Notion-like Editor template includes many UI components, but we need additional Shadcn UI components for our custom panels (Ribbon, Document Selector, TOC).

Initialize Shadcn UI (if not already done by Tiptap CLI):

```bash
npx shadcn-ui@latest init
```

**Prompts**:
- ✅ Would you like to use TypeScript? → **Yes**
- ✅ Which style would you like to use? → **Default**
- ✅ Which color would you like to use as base color? → **Slate**
- ✅ Where is your global CSS file? → **src/app/globals.css**
- ✅ Would you like to use CSS variables for colors? → **Yes**
- ✅ Where is your tailwind.config.js located? → **tailwind.config.ts**
- ✅ Configure the import alias for components? → **@/components**
- ✅ Configure the import alias for utils? → **@/lib/utils**

Install additional Shadcn UI components for our custom layout:

```bash
npx shadcn-ui@latest add resizable scroll-area card badge
```

**Additional Shadcn UI Components**:
- `resizable`: For the four-panel layout (Ribbon → Docs → TOC → Editor)
- `scroll-area`: For document list and TOC scrolling
- `card`: For document list items
- `badge`: For document type indicators

**Note**: The Notion-like Editor template already includes: `button`, `dialog`, `dropdown-menu`, `input`, `separator`, `toggle`, `tooltip`, and more.

### 7. Install PDF Export Library

```bash
npm install jspdf html2canvas
```

**PDF Export**:
- `jspdf`: PDF generation library
- `html2canvas`: Capture HTML as image for PDF export

### 8. Install Dev Dependencies (if needed)

```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

**Dev Dependencies**:
- Type definitions for Node.js, React, React DOM (may already be installed by Tiptap CLI)

---

## Environment Configuration

### 9. Create `.env.local` File

Create a `.env.local` file in the project root:

```bash
# Windows Command Prompt
type nul > .env.local

# Windows PowerShell
New-Item -ItemType File -Name .env.local

# Git Bash / WSL
touch .env.local
```

Add the following environment variables:

```ini
# ============================================
# Clerk Authentication
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk URLs (adjust based on your setup)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ============================================
# Tiptap Collaboration (Optional - for real-time collaboration)
# ============================================
NEXT_PUBLIC_TIPTAP_COLLAB_DOC_PREFIX=mildoc
NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID=your_collab_app_id_here
NEXT_PUBLIC_TIPTAP_COLLAB_TOKEN=your_collab_jwt_token_here

# ============================================
# Tiptap AI (Optional - for AI features)
# ============================================
NEXT_PUBLIC_TIPTAP_AI_APP_ID=your_ai_app_id_here
NEXT_PUBLIC_TIPTAP_AI_TOKEN=your_ai_jwt_token_here
```

### Get Required Keys

#### **Clerk Keys** (Required)
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application (or use an existing one)
3. Copy your **Publishable Key** and **Secret Key** from the "API Keys" section
4. Replace `your_clerk_publishable_key_here` and `your_clerk_secret_key_here` in `.env.local`

#### **Tiptap Collaboration & AI Keys** (Optional)
1. Go to [Tiptap Cloud Dashboard](https://cloud.tiptap.dev/)
2. Navigate to your application settings
3. Copy your **Collaboration App ID** and **AI App ID**
4. For JWT tokens:
   - **Quick Start**: Use example JWT tokens from Tiptap Cloud (valid for short time only)
   - **Production**: Implement server-side JWT generation (see "JWT Authentication" section below)

**Important**: Add `.env.local` to `.gitignore` to avoid committing secrets:

```bash
echo .env.local >> .gitignore
```

### 10. Configure Tiptap Utilities

The Notion-like Editor template includes a `tiptap-collab-utils.ts` file that needs configuration.

**Location**: `src/lib/tiptap/tiptap-collab-utils.ts` (or similar path created by Tiptap CLI)

**Update the following functions**:

#### **1. fetchCollabToken() - JWT Authentication for Collaboration**

```typescript
export async function fetchCollabToken(room: string): Promise<string> {
  // Option A: Use environment variable (quick start only, not for production)
  if (process.env.NEXT_PUBLIC_TIPTAP_COLLAB_TOKEN) {
    return process.env.NEXT_PUBLIC_TIPTAP_COLLAB_TOKEN
  }

  // Option B: Fetch from your API endpoint (production-ready)
  const response = await fetch('/api/collaboration/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room }),
  })

  const data = await response.json()
  return data.token
}
```

#### **2. fetchAIToken() - JWT Authentication for AI Features**

```typescript
export async function fetchAIToken(): Promise<string> {
  // Option A: Use environment variable (quick start only)
  if (process.env.NEXT_PUBLIC_TIPTAP_AI_TOKEN) {
    return process.env.NEXT_PUBLIC_TIPTAP_AI_TOKEN
  }

  // Option B: Fetch from your API endpoint (production-ready)
  const response = await fetch('/api/ai/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await response.json()
  return data.token
}
```

**Note**: For MVP, you can use example JWT tokens from Tiptap Cloud. For production, implement server-side JWT generation. See [Tiptap JWT Authentication Guide](https://tiptap.dev/docs/collaboration/getting-started/authentication).

### 11. Configure Image Uploads (Optional)

The Notion-like Editor supports image uploads. You need a server-side endpoint to handle uploads.

#### **Option A: Simple Local Upload (Development Only)**

For development, you can store images as base64 in the document (not recommended for production due to size).

**Update `handleImageUpload` in `src/lib/tiptap/tiptap-utils.ts`**:

```typescript
export async function handleImageUpload(file: File): Promise<string> {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type')
  }

  // Convert to base64 (development only)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
```

#### **Option B: AWS S3 Upload (Production)**

For production, use a cloud storage service like AWS S3. See the Tiptap documentation for a full example server implementation.

**Update `handleImageUpload` in `src/lib/tiptap/tiptap-utils.ts`**:

```typescript
export async function handleImageUpload(file: File): Promise<string> {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type')
  }

  // Upload to your server endpoint
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Upload failed')
  }

  const data = await response.json()
  return data.url // Return permanent URL
}
```

**Note**: For MVP, we'll use base64 encoding (Option A). For production, implement S3 or similar cloud storage (Option B).

---

## Verify Installation

### 12. Check Installed Packages

Verify all packages are installed:

```bash
npm list --depth=0
```

You should see:
- **Tiptap packages**: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`, `@tiptap/extension-image`, `@tiptap/extension-history`, `@tiptap/extension-collaboration`, `@tiptap/extension-collaboration-cursor`
- **Tiptap Pro packages**: `@tiptap-pro/extension-drag-handle-react`, `@tiptap-pro/extension-ai`, `@tiptap-pro/extension-emoji`, `@tiptap-pro/extension-mathematics`
- **Authentication**: `@clerk/nextjs`
- **Storage & Parsing**: `zustand`, `dexie`, `mammoth`, `pdfjs-dist`
- **Export**: `jspdf`, `html2canvas`
- **Utilities**: `clsx`, `tailwind-merge`, `lucide-react`

### 13. Test Notion-like Editor

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**What to expect**:
- If Tiptap CLI created a demo page, you should see the Notion-like Editor with:
  - Floating toolbar
  - Slash commands (type `/`)
  - Drag handles on paragraphs (hover on left side)
  - AI menu (if configured)
  - Emoji picker (if configured)

**Test the editor**:
1. Type some text
2. Try slash commands: Type `/` and select a format (e.g., `/heading`)
3. Test drag-and-drop: Hover over a paragraph and drag the handle
4. Test formatting: Select text and use the floating toolbar

**Stop the server**: Press `Ctrl+C` in the terminal.

---

## Project Structure Setup

### 14. Review Tiptap-Generated Structure

The Tiptap CLI has created a component structure for you. Review the following directories:

```
src/
├── components/
│   └── tiptap-templates/
│       └── notion/
│           ├── notion-like-editor.tsx      # Main editor component
│           ├── hooks/                      # Custom hooks (use-mobile, use-ui-editor-state, etc.)
│           ├── icons/                      # Icon components
│           ├── extensions/                 # Tiptap extensions (collaboration, AI, emoji, etc.)
│           ├── lib/                        # Utilities (tiptap-utils.ts, tiptap-collab-utils.ts)
│           ├── ui/                         # UI components (ai-menu, slash-menu, floating toolbar, etc.)
│           ├── nodes/                      # Custom node components (code-block, image, list, etc.)
│           ├── primitives/                 # Base UI primitives (button, dropdown, toolbar, etc.)
│           └── contexts/                   # React contexts (app-context, user-context, collab-context)
```

### 15. Create Additional Directories for Our Custom Components

The Tiptap template provides the editor core, but we need additional directories for our custom military document features:

```bash
# Windows Command Prompt
mkdir src\components\layout src\components\modals src\components\document src\components\toc src\lib\parsers src\lib\exporters\formatters src\lib\exporters\styles src\lib\hooks src\lib\validation src\stores src\types src\constants public\images

# Windows PowerShell
New-Item -ItemType Directory -Path src\components\layout,src\components\modals,src\components\document,src\components\toc,src\lib\parsers,src\lib\exporters\formatters,src\lib\exporters\styles,src\lib\hooks,src\lib\validation,src\stores,src\types,src\constants,public\images

# Git Bash / WSL
mkdir -p src/components/{layout,modals,document,toc} src/lib/{parsers,hooks,validation} src/lib/exporters/{formatters,styles} src/{stores,types,constants} public/images
```

**New directories explained**:
- `components/layout`: Ribbon, DocumentSelector, TableOfContents panels
- `components/modals`: Upload, Settings, Export modals
- `components/document`: Document list items, search, trash
- `components/toc`: Table of contents tree components
- `lib/parsers`: Word/PDF document parsers
- `lib/exporters`: PDF export with AR 25-50 formatting
- `lib/hooks`: Custom React hooks (auto-save, keyboard shortcuts)
- `lib/validation`: Document validation utilities
- `stores`: Zustand state management stores
- `types`: TypeScript type definitions
- `constants`: Numbering patterns, classifications, error messages

### 16. Add Army Crest Image

Place the Army crest image in `public/images/`:

```
public/
└── images/
    └── army-crest.png
```

**Note**: If you don't have the Army crest image yet, you can add it later. The image will be inserted by users via a button in the editor.

---

## Git Configuration

### 15. Initialize Git Repository (if not done)

```bash
git init
git add .
git commit -m "Initial commit: Next.js project setup with Tiptap Pro"
```

### 16. Verify `.gitignore`

Ensure the following are in `.gitignore`:

```gitignore
# dependencies
node_modules/

# next.js
.next/
out/

# production
build/

# environment variables
.env.local
.env*.local

# Tiptap Pro auth token
.npmrc

# debug
npm-debug.log*

# misc
.DS_Store
*.pem
```

---

## Next Steps

### 17. Verify Tiptap Pro Access

Create a test file to verify Tiptap Pro extension works:

**`src/app/test-tiptap.tsx`** (temporary test file):

```typescript
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { DragHandle } from '@tiptap-pro/extension-drag-handle-react'

export default function TestTiptap() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      DragHandle.configure({
        // Tiptap Pro extension configuration
      }),
    ],
    content: '<p>Hello from Tiptap Pro!</p>',
  })

  return <EditorContent editor={editor} />
}
```

If this renders without errors, your Tiptap Pro access is configured correctly.

**Delete this test file** after verification.

---

## Troubleshooting

### Issue: Tiptap Pro Package Not Found

**Error**: `npm ERR! 404 Not Found - GET https://registry.tiptap.dev/@tiptap-pro/extension-drag-handle-react`

**Solution**:
1. Verify `.npmrc` file exists in project root
2. Check that the auth token is correct (no extra spaces or line breaks)
3. Ensure `.npmrc` has the correct format:
   ```ini
   @tiptap-pro:registry=https://registry.tiptap.dev/
   //registry.tiptap.dev/:_authToken=YOUR_TOKEN_HERE
   ```
4. Try clearing npm cache: `npm cache clean --force`
5. Re-run: `npm install @tiptap-pro/extension-drag-handle-react`

### Issue: Clerk Environment Variables Not Loading

**Error**: `Clerk: Missing publishableKey`

**Solution**:
1. Verify `.env.local` exists in project root
2. Check that keys are correctly copied from Clerk Dashboard
3. Restart the development server (`npm run dev`)

### Issue: Port 3000 Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
1. Stop any other processes using port 3000
2. Or run on a different port: `npm run dev -- -p 3001`

---

## Summary

✅ **Completed Setup**:
1. ✅ Next.js project initialized with TypeScript and Tailwind CSS
2. ✅ Tiptap Pro registry configured with auth token
3. ✅ All dependencies installed (Tiptap, Clerk, Zustand, Dexie, etc.)
4. ✅ Shadcn UI components added
5. ✅ Environment variables configured (Clerk keys)
6. ✅ Project directory structure created
7. ✅ Git repository initialized with proper `.gitignore`

**Ready for Development**: You can now proceed to **Phase 1: Core Editor & Ribbon Layout** as outlined in `project_spec_updated.md`.

---

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Install new package
npm install <package-name>

# Install Tiptap Pro package (uses .npmrc auth)
npm install @tiptap-pro/<package-name>

# Add Shadcn UI component
npx shadcn-ui@latest add <component-name>

# Build for production
npm run build

# Run production build
npm start
```

---

**Document Status**: Setup guide complete. Ready for development.
