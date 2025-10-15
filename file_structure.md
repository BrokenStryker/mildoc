# Military Document Formatter - File Structure (Updated)

This document reflects the **ACTUAL** current state of the project with Tiptap 3.x and Shadcn UI already installed.

**Legend:**
- ✅ **INSTALLED** - Already present in the project
- 🔨 **TO BE CREATED** - Needs to be built

---

## Root Directory Structure

```
MILdoc/
├── .env.local                      # 🔨 TO BE CREATED - Environment variables (Clerk keys)
├── .npmrc                          # ✅ INSTALLED - Tiptap Pro registry auth token
├── .gitignore                      # ✅ INSTALLED
├── next.config.ts                  # ✅ INSTALLED - Next.js 15.5.5 configuration
├── package.json                    # ✅ INSTALLED - Dependencies (see below)
├── tsconfig.json                   # ✅ INSTALLED - TypeScript 5 configuration
├── tailwind.config.ts              # ✅ INSTALLED - Tailwind 4.x configuration
├── postcss.config.mjs              # ✅ INSTALLED - PostCSS configuration
├── components.json                 # ✅ INSTALLED - Shadcn UI configuration
├── README.md                       # ✅ INSTALLED
├── SETUP.md                        # ✅ INSTALLED - Setup guide
├── TIPTAP_INTEGRATION.md           # ✅ INSTALLED - Tiptap integration guide
├── formatting_rules.md             # ✅ INSTALLED - AR 25-50 formatting rules
├── project_spec.md                 # ✅ INSTALLED - Original project specification
├── project_spec_updated.md         # ✅ INSTALLED - Updated specification
├── file_structure.md               # ✅ INSTALLED - This file
│
├── public/                         # ✅ INSTALLED - Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── images/                     # 🔨 TO BE CREATED
│       ├── army-crest.png          # Army crest image
│       └── logo.svg                # App logo
│
├── app/                            # Next.js App Router (✅ PARTIALLY INSTALLED)
│   ├── layout.tsx                  # ✅ INSTALLED - Root layout
│   ├── page.tsx                    # ✅ INSTALLED - Landing page
│   ├── globals.css                 # ✅ INSTALLED - Global CSS
│   ├── favicon.ico                 # ✅ INSTALLED
│   │
│   ├── notion-like/                # ✅ INSTALLED - Demo Notion-like editor
│   │   └── page.tsx                # Tiptap Notion-like editor demo
│   │
│   ├── (auth)/                     # 🔨 TO BE CREATED - Auth routes (Clerk)
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx        # Clerk sign-in page
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx        # Clerk sign-up page
│   │
│   └── (dashboard)/                # 🔨 TO BE CREATED - Dashboard routes
│       ├── layout.tsx              # Four-panel layout: ribbon, docs, TOC, editor
│       └── dashboard/
│           └── page.tsx            # Main dashboard page
│
├── components/                     # React components (✅ HEAVILY INSTALLED)
│   │
│   ├── ui/                         # ✅ INSTALLED - Shadcn UI (53 components)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx           # ✅ react-resizable-panels installed
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx              # ✅ Toast notifications
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   └── tooltip.tsx
│   │   └── [+20 more components]
│   │
│   ├── tiptap-templates/           # ✅ INSTALLED - Tiptap Notion-like Editor
│   │   ├── notion-like-editor.tsx  # Main editor component
│   │   ├── notion-like-editor-light-theme.scss
│   │   ├── notion-like-editor-dark-theme.scss
│   │   └── [6 tsx, 2 scss, 1 json files]
│   │
│   ├── tiptap-icons/               # ✅ INSTALLED - ~80 icon components
│   │   ├── ai-sparkles-icon.tsx
│   │   ├── arrow-left-icon.tsx
│   │   ├── blockquote-icon.tsx
│   │   ├── bold-icon.tsx
│   │   ├── chevron-right-icon.tsx
│   │   ├── code-block-icon.tsx
│   │   ├── highlighter-icon.tsx
│   │   ├── image-icon.tsx
│   │   ├── italic-icon.tsx
│   │   ├── link-icon.tsx
│   │   ├── list-icon.tsx
│   │   ├── more-vertical-icon.tsx
│   │   ├── underline-icon.tsx
│   │   └── [+65 more icons]
│   │
│   ├── tiptap-node/                # ✅ INSTALLED - Custom node components
│   │   ├── blockquote-node/
│   │   ├── code-block-node/
│   │   ├── heading-node/
│   │   ├── horizontal-rule-node/
│   │   ├── image-node/
│   │   ├── image-upload-node/
│   │   ├── list-node/
│   │   └── paragraph-node/
│   │
│   ├── tiptap-ui/                  # ✅ INSTALLED - Editor UI (74 tsx, 38 ts, 8 scss)
│   │   ├── ai-menu.tsx
│   │   ├── blockquote-button.tsx
│   │   ├── code-block-button.tsx
│   │   ├── color-highlight-button.tsx
│   │   ├── drag-context-menu.tsx
│   │   ├── emoji-dropdown-menu.tsx
│   │   ├── heading-button.tsx
│   │   ├── image-upload-button.tsx
│   │   ├── link-popover.tsx
│   │   ├── list-button.tsx
│   │   ├── mention-dropdown-menu.tsx
│   │   ├── slash-dropdown-menu.tsx
│   │   ├── text-align-button.tsx
│   │   ├── undo-redo-button.tsx
│   │   └── [+60 more UI components]
│   │
│   ├── tiptap-ui-primitive/        # ✅ INSTALLED - Base UI primitives (32 tsx, 18 scss)
│   │   ├── button.tsx
│   │   ├── button-group.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── separator.tsx
│   │   ├── spacer.tsx
│   │   ├── toolbar.tsx
│   │   └── [+26 more primitives]
│   │
│   ├── tiptap-ui-utils/            # ✅ INSTALLED - UI utilities (4 tsx, 3 ts)
│   │   └── [utility components]
│   │
│   ├── tiptap-extension/           # ✅ INSTALLED - UI state extension
│   │   └── ui-state-extension.ts
│   │
│   ├── layout/                     # 🔨 TO BE CREATED - Custom layout components
│   │   ├── Ribbon.tsx              # Left ribbon (profile, settings, home)
│   │   ├── DocumentSelector.tsx    # Document list sidebar
│   │   ├── TableOfContents.tsx     # Auto-generated TOC from editor
│   │   └── EditorPanel.tsx         # Container wrapping NotionEditor
│   │
│   ├── editor/                     # 🔨 TO BE CREATED - Custom editor components
│   │   ├── InsertElementMenu.tsx   # Dropdown for military elements
│   │   ├── IndentControls.tsx      # Indent/outdent buttons
│   │   ├── LockButton.tsx          # Lock/unlock node button
│   │   ├── SuppressIndentButton.tsx # Suppress child indent button
│   │   └── AutoSaveIndicator.tsx   # "Saved X seconds ago"
│   │
│   ├── military-nodes/             # 🔨 TO BE CREATED - Military document nodes
│   │   ├── MilitaryParagraphRenderer.tsx
│   │   ├── OfficeSymbolRenderer.tsx
│   │   ├── SubjectRenderer.tsx
│   │   ├── ReferencesRenderer.tsx
│   │   ├── ReferenceItemRenderer.tsx
│   │   ├── TimeZoneRenderer.tsx
│   │   ├── TaskOrganizationRenderer.tsx
│   │   ├── SignatureBlockRenderer.tsx
│   │   └── CrestImageRenderer.tsx
│   │
│   ├── modals/                     # 🔨 TO BE CREATED - Modal dialogs
│   │   ├── UploadModal.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── SettingsModal.tsx
│   │   ├── NumberingPatternEditor.tsx
│   │   ├── KeyboardShortcutsEditor.tsx
│   │   ├── ClassificationSettings.tsx
│   │   ├── ExportModal.tsx
│   │   └── ErrorModal.tsx
│   │
│   ├── document/                   # 🔨 TO BE CREATED - Document components
│   │   ├── DocumentListItem.tsx
│   │   ├── DocumentSearch.tsx
│   │   └── TrashBin.tsx
│   │
│   └── toc/                        # 🔨 TO BE CREATED - Table of contents
│       ├── TOCTree.tsx
│       ├── TOCItem.tsx
│       └── TOCCollapse.tsx
│
├── contexts/                       # ✅ INSTALLED - React contexts (4 files)
│   ├── ai-context.tsx
│   ├── app-context.tsx
│   ├── collab-context.tsx
│   └── user-context.tsx
│
├── hooks/                          # ✅ INSTALLED - Custom React hooks (15 files)
│   ├── use-composed-ref.ts
│   ├── use-cursor-visibility.ts
│   ├── use-element-rect.ts
│   ├── use-floating-element.ts
│   ├── use-floating-toolbar-visibility.ts
│   ├── use-isomorphic-layout-effect.ts
│   ├── use-menu-navigation.ts
│   ├── use-mobile.ts
│   ├── use-on-click-outside.ts
│   ├── use-scrolling.ts
│   ├── use-throttled-callback.ts
│   ├── use-tiptap-editor.ts        # ✅ Tiptap editor hook
│   ├── use-ui-editor-state.ts      # ✅ UI state for editor
│   ├── use-unmount.ts
│   └── use-window-size.ts
│
├── lib/                            # Utility libraries (✅ PARTIALLY INSTALLED)
│   ├── utils.ts                    # ✅ INSTALLED - General utilities (cn, etc.)
│   ├── tiptap-utils.ts             # ✅ INSTALLED - General Tiptap utilities
│   ├── tiptap-collab-utils.ts      # ✅ INSTALLED - Collaboration utilities
│   ├── tiptap-advanced-utils.ts    # ✅ INSTALLED - Advanced Tiptap utilities
│   │
│   ├── db.ts                       # 🔨 TO BE CREATED - Dexie.js IndexedDB setup
│   │
│   ├── tiptap-military/            # 🔨 TO BE CREATED - Military extensions
│   │   ├── extensions/
│   │   │   ├── military-paragraph.ts
│   │   │   ├── office-symbol-node.ts
│   │   │   ├── subject-node.ts
│   │   │   ├── references-node.ts
│   │   │   ├── reference-item-node.ts
│   │   │   ├── time-zone-node.ts
│   │   │   ├── task-organization-node.ts
│   │   │   ├── signature-block-node.ts
│   │   │   ├── crest-image-node.ts
│   │   │   └── auto-numbering-plugin.ts
│   │   ├── numbering.ts
│   │   ├── indentation.ts
│   │   └── dragDrop.ts
│   │
│   ├── parsers/                    # 🔨 TO BE CREATED - Document parsing
│   │   ├── wordParser.ts           # mammoth.js (not yet installed)
│   │   ├── pdfParser.ts            # pdf.js (not yet installed)
│   │   └── nodeDetector.ts
│   │
│   ├── exporters/                  # 🔨 TO BE CREATED - Document export
│   │   ├── pdfExporter.ts          # jsPDF/html2pdf.js (not yet installed)
│   │   ├── jsonExporter.ts
│   │   ├── formatters/
│   │   │   ├── pageBreaks.ts
│   │   │   ├── tableFormatter.ts
│   │   │   ├── classificationMarkers.ts
│   │   │   └── armySymbolRemover.ts
│   │   └── styles/
│   │       └── ar25-50.css
│   │
│   ├── hooks-custom/               # 🔨 TO BE CREATED - Our custom hooks
│   │   ├── useAutoSave.ts
│   │   ├── useDocument.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useLocalStorage.ts
│   │
│   └── validation/                 # 🔨 TO BE CREATED - Validation
│       ├── documentValidator.ts
│       └── exportValidator.ts
│
├── stores/                         # 🔨 TO BE CREATED - Zustand state management
│   ├── documentStore.ts
│   ├── editorStore.ts
│   ├── settingsStore.ts
│   └── uiStore.ts
│
├── types/                          # 🔨 TO BE CREATED - TypeScript types
│   ├── document.ts
│   ├── node.ts
│   ├── settings.ts
│   └── export.ts
│
├── constants/                      # 🔨 TO BE CREATED - Application constants
│   ├── numberingPatterns.ts
│   ├── keyboardShortcuts.ts
│   ├── classifications.ts
│   └── errorMessages.ts
│
├── styles/                         # ✅ INSTALLED - Global styles (2 files)
│   ├── _keyframe-animations.scss
│   └── _variables.scss
│
└── .taskmaster/                    # ✅ INSTALLED - Task management
    ├── tasks/
    │   ├── tasks.json              # 39 tasks defined
    │   └── [39 task markdown files]
    └── docs/
        └── prd.txt                 # Product requirements document
```

---

## Current Dependencies (package.json)

### ✅ **INSTALLED** - Tiptap Ecosystem
```json
"@tiptap/core": "^3.7.0",
"@tiptap/react": "^3.7.0",
"@tiptap/pm": "^3.7.0",
"@tiptap/starter-kit": "^3.7.0",
"@tiptap/extensions": "^3.7.0",
"@tiptap/extension-drag-handle-react": "^3.7.0",
"@tiptap/extension-collaboration": "^3.7.0",
"@tiptap/extension-collaboration-caret": "^3.7.0",
"@tiptap/extension-color": "^3.7.0",
"@tiptap/extension-emoji": "^3.7.0",
"@tiptap/extension-highlight": "^3.7.0",
"@tiptap/extension-horizontal-rule": "^3.7.0",
"@tiptap/extension-image": "^3.7.0",
"@tiptap/extension-list": "^3.7.0",
"@tiptap/extension-mathematics": "^3.7.0",
"@tiptap/extension-mention": "^3.7.0",
"@tiptap/extension-subscript": "^3.7.0",
"@tiptap/extension-superscript": "^3.7.0",
"@tiptap/extension-text-align": "^3.7.0",
"@tiptap/extension-text-style": "^3.7.0",
"@tiptap/extension-typography": "^3.7.0",
"@tiptap/extension-unique-id": "^3.7.0",
"@tiptap/suggestion": "^3.7.0",
"@tiptap-pro/extension-ai": "^3.2.0",
"@tiptap-pro/provider": "^3.3.0"
```

### ✅ **INSTALLED** - Radix UI / Shadcn Components
```json
"@radix-ui/react-accordion": "^1.2.12",
"@radix-ui/react-alert-dialog": "^1.1.15",
"@radix-ui/react-aspect-ratio": "^1.1.7",
"@radix-ui/react-avatar": "^1.1.10",
"@radix-ui/react-checkbox": "^1.3.3",
"@radix-ui/react-collapsible": "^1.1.12",
"@radix-ui/react-context-menu": "^2.2.16",
"@radix-ui/react-dialog": "^1.1.15",
"@radix-ui/react-dropdown-menu": "^2.1.16",
"@radix-ui/react-hover-card": "^1.1.15",
"@radix-ui/react-label": "^2.1.7",
"@radix-ui/react-menubar": "^1.1.16",
"@radix-ui/react-navigation-menu": "^1.2.14",
"@radix-ui/react-popover": "^1.1.15",
"@radix-ui/react-progress": "^1.1.7",
"@radix-ui/react-radio-group": "^1.3.8",
"@radix-ui/react-scroll-area": "^1.2.10",
"@radix-ui/react-select": "^2.2.6",
"@radix-ui/react-separator": "^1.1.7",
"@radix-ui/react-slider": "^1.3.6",
"@radix-ui/react-slot": "^1.2.3",
"@radix-ui/react-switch": "^1.2.6",
"@radix-ui/react-tabs": "^1.1.13",
"@radix-ui/react-toggle": "^1.1.10",
"@radix-ui/react-toggle-group": "^1.1.11",
"@radix-ui/react-tooltip": "^1.2.8"
```

### ✅ **INSTALLED** - UI & Utilities
```json
"react-resizable-panels": "^3.0.6",  // For resizable layout
"sonner": "^2.0.7",                   // Toast notifications
"lucide-react": "^0.545.0",           // Icons
"yjs": "^13.6.27",                    // Collaboration (Tiptap)
"tailwind-merge": "^3.3.1",
"clsx": "^2.1.1",
"zod": "^4.1.12",                     // Form validation
"react-hook-form": "^7.65.0",
"date-fns": "^4.1.0"
```

### 🔨 **MISSING** - Need to Install
```json
// Authentication
"@clerk/nextjs": "^x.x.x"

// Storage
"dexie": "^x.x.x"

// State Management
"zustand": "^x.x.x"

// Document Parsing
"mammoth": "^x.x.x"          // Word documents
"pdfjs-dist": "^x.x.x"       // PDF documents

// PDF Export
"jspdf": "^x.x.x"            // or "html2pdf.js"
```

---

## Next Steps

1. **Install Missing Dependencies**
   ```bash
   npm install @clerk/nextjs dexie zustand mammoth pdfjs-dist jspdf
   ```

2. **Create Environment Variables** (`.env.local`)
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx
   CLERK_SECRET_KEY=xxx
   ```

3. **Update Task Plan** - Task 1 (Initialize project) and Task 3 (Install Tiptap) are essentially **COMPLETE**

4. **Begin Development** - Start with Task 2 (Clerk authentication)

---

## Summary

**✅ Already Installed:**
- Next.js 15.5.5 with App Router
- Tiptap 3.7.0 with all major extensions
- Shadcn UI (53 components)
- React Resizable Panels
- All Tiptap UI components and primitives
- Hooks for editor state management
- Collaboration infrastructure (Yjs)

**🔨 Still Need:**
- Clerk authentication
- Dexie.js for IndexedDB
- Zustand for state management
- Document parsers (mammoth, pdfjs-dist)
- PDF export library (jsPDF)
- Custom military document extensions
- Layout components
- All business logic (parsers, exporters, stores, etc.)

The project has a **STRONG FOUNDATION** with Tiptap and UI components fully set up. Focus now shifts to:
1. Authentication (Clerk)
2. Custom military document nodes
3. Document storage (IndexedDB)
4. Parsing & Export functionality
