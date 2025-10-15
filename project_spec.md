
**Description**: This specification outlines the plan for building a Next.js web application that enables Army staff officers to rapidly format sensitive documents (memorandums, orders, FRAGORDs, WARNORDs, DA Forms) according to AR 25-50 standards. The app uses Tiptap with a Notion-like UI for intuitive paragraph restructuring, Clerk for authentication, and IndexedDB for local browser storage. The core value proposition is reducing document formatting time from hours to minutes through intelligent node-based editing and automatic formatting application.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement & Value Proposition](#problem-statement--value-proposition)
3. [Target Users](#target-users)
4. [MVP Scope](#mvp-scope)
5. [Requirements](#requirements)
   - [Functional Requirements](#functional-requirements)
   - [Non-Functional Requirements](#non-functional-requirements)
6. [Technology Stack](#technology-stack)
7. [Architecture](#architecture)
   - [Tiptap Editor Architecture](#tiptap-editor-architecture)
   - [Custom MilitaryParagraph Node](#custom-militaryparagraph-node)
   - [Node Detection & Parsing](#node-detection--parsing)
8. [Data Model & IndexedDB Schema](#data-model--indexeddb-schema)
9. [AR 25-50 Formatting Rules](#ar-25-50-formatting-rules)
10. [User Interface Design](#user-interface-design)
    - [Wireframe](#wireframe)
    - [Three-Panel Layout](#three-panel-layout)
    - [Notion-like Editor Features](#notion-like-editor-features)
11. [Smart Paragraph Logic & Indentation Rules](#smart-paragraph-logic--indentation-rules)
12. [Document Upload & Export](#document-upload--export)
13. [Shadcn UI Components](#shadcn-ui-components)
14. [Implementation Plan](#implementation-plan)
15. [Testing Strategy](#testing-strategy)
16. [Deployment and Maintenance](#deployment-and-maintenance)
17. [Risks and Mitigations](#risks-and-mitigations)
18. [Open Questions & Future Discussions](#open-questions--future-discussions)

---

## Project Overview

This web application is designed as a **rapid document formatting tool** for Army staff officers who regularly work with military correspondence and operational orders. The primary pain point being addressed is the **excessive time spent on formatting documents** to meet AR 25-50 standards—a task that can take hours due to complex indentation requirements, paragraph numbering hierarchies, and strict formatting guidelines.

The app allows users to:
- Upload existing Word documents or PDFs
- Edit content in a Notion-like block-based editor
- Visually restructure paragraphs using drag-and-drop and indent controls
- Automatically apply AR 25-50 formatting rules
- Export formatted documents as PDFs

**Key differentiators:**
- **Node-based paragraph editing**: Each paragraph is a moveable, indent-adjustable block
- **Visual document structure**: Table of contents sidebar shows hierarchy at a glance
- **Local-only storage**: All data stays in the browser (IndexedDB) for security
- **Zero learning curve for structure**: Drag and click to adjust indentation—no manual margin tweaking

---

## Problem Statement & Value Proposition

### The Problem
Army staff officers spend **hours formatting documents** because:
1. **Indentation errors are common**: Paragraphs use wrong numbering (e.g., "a." instead of "1.") or incorrect spacing from margins
2. **Word is not intuitive for military formatting**: Adjusting outline levels, margins, and numbering is cumbersome
3. **AR 25-50 compliance is strict**: 1" margins, Arial 12pt, specific paragraph spacing (¼" indents), block format
4. **Manual fixing is tedious**: Copy-pasting between documents, re-numbering after structural changes

### The Solution
A **specialized editor** that:
- Treats each paragraph as a **draggable node** with parent-child relationships
- Shows document structure in a **live table of contents**
- Applies **AR 25-50 formatting automatically** on export (margins, fonts, spacing)
- Makes indentation adjustments **visual and intuitive** (drag horizontally to change level)

### Target Time Savings
- **Current process**: 30 minutes to 3 hours to format a memo or order manually in Word
- **Target with this app**: 5-15 minutes (upload → restructure → export)

---

## Target Users

- **Primary**: Army staff officers (O-3 to O-6) who create and edit:
  - Memorandums
  - OPORDs (Operation Orders)
  - FRAGORDs (Fragmentary Orders)
  - WARNORDs (Warning Orders)
  - DA Forms (Department of the Army Forms)

- **User Assumptions**:
  - Familiar with military document structure (5-paragraph format, etc.)
  - Basic technical proficiency (can use Google Docs, upload files)
  - Access to modern browsers (Chrome, Edge, Firefox)
  - Work on desktop/laptop (not optimized for mobile in MVP)

---

## MVP Scope

### In Scope (Minimum Viable Product)
1. **User authentication** via Clerk (email/password)
2. **Document upload** (Word .docx, PDF)
3. **Text extraction** with structure preservation (numbering, spacing)
4. **Notion-like editor** powered by Tiptap:
   - Drag handles for vertical reordering
   - Indent/outdent buttons for horizontal adjustment
   - Auto-numbering based on hierarchy level
   - Table of contents sidebar (auto-generated)
5. **Local storage** in IndexedDB (auto-save every 2 seconds)
6. **Export to PDF** with AR 25-50 formatting applied
7. **Export to JSON** (backup/migration)
8. **Army symbol toggle** (remove duplicate images from header on export)
9. **Introductory guide document** on first app load

### Out of Scope (Future Enhancements)
- Pre-made document templates
- Word (.docx) export
- Cloud sync / multi-device support
- Real-time collaboration
- Advanced encryption
- Mobile app versions
- Stripe payments / subscriptions
- AI-powered formatting suggestions (future consideration)

---

## Requirements

### Functional Requirements

#### 1. Authentication
- Users sign up/login via **Clerk** (email/password, optional SSO)
- Session management handled by Clerk JWT tokens
- Basic role: document editor (no admin roles in MVP)

#### 2. Document Upload
- **Supported formats**: Word (.docx), PDF (.pdf)
- **Upload methods**: Drag-and-drop or file picker
- **Parsing logic**:
  - **Word docs**: Use `mammoth.js` to extract text, preserve outline levels, detect numbering
  - **PDFs**: Use `pdf.js` to extract text, use regex to detect numbering patterns
- **Image/table preservation**: Extract and store as separate Tiptap nodes
- **Assumption**: All uploaded documents have *some* paragraph numbering or spacing that can be detected (e.g., "1.", "a.", "(1)", blank lines between paragraphs)

#### 3. Rich Text Editing (Tiptap Notion-like UI)
- **Block-based editing**: Each paragraph is a node
- **Drag handle**: Vertical reordering of paragraphs
- **Indent controls**: Buttons to increase/decrease indent level (horizontal movement)
- **Auto-numbering**: Numbering updates automatically based on position and parent
- **Visual feedback**: Table of contents updates in real-time to show structure
- **Basic formatting**: Bold, italic, underline (preserve from upload)
- **Tables**: Editable via Tiptap Table extension
- **Images**: Repositionable, preserve on upload

#### 4. Table of Contents Sidebar
- **Auto-generated** from document nodes
- **Shows structure**: Indentation visually indicates parent-child relationships
- **Preview text**: First 3-5 words of each paragraph
- **Clickable**: Jump to paragraph in editor
- **Real-time updates**: Changes in editor reflect immediately

#### 5. Local Storage with IndexedDB
- **Single version per document** (no version history in MVP)
- **Auto-save**: Every 2 seconds while editing
- **Operations**: Create, Read, Update, Delete
- **Metadata**: Title, document type, creation date, last modified
- **Search/filter**: By title or date in document selector

#### 6. Document Export
- **PDF export**:
  - Apply AR 25-50 formatting (margins, fonts, spacing)
  - Option to toggle Army symbol removal (delete images in top half of first page)
- **JSON export**: Full Tiptap document structure for backup
- **No Word export** in MVP

#### 7. Onboarding
- **First-time users** see an introductory document explaining:
  - The app's purpose (rapid AR 25-50 formatting)
  - Pain point it solves (hours → minutes)
  - How to upload, edit (drag/indent controls), and export
  - Brief guided example

### Non-Functional Requirements

- **Performance**:
  - Page load < 2 seconds
  - Editor responsive for documents up to 10MB
  - Auto-save debounced to avoid lag

- **Security**:
  - All document data stays client-side (IndexedDB)
  - No server-side storage of document content
  - HTTPS required
  - Clerk handles auth security

- **Compatibility**:
  - Support latest versions of Chrome, Firefox, Edge (2025)
  - Safari support best-effort

- **Accessibility**:
  - Keyboard navigation for indent/outdent (Tab/Shift+Tab)
  - ARIA labels for drag handles
  - Screen reader support for table of contents

- **Usability**:
  - Intuitive drag-and-drop
  - Visual cues for indentation levels
  - Tooltips for controls

---

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React 18+, TypeScript
- **Editor**: Tiptap 3.x
  - `@tiptap/react`
  - `@tiptap/starter-kit`
  - `@tiptap/extension-table`
  - `@tiptap/extension-image`
  - `@tiptap/extension-drag-handle-react` (for drag-and-drop)
  - Custom extensions: `MilitaryParagraph` node
- **Authentication**: Clerk (Next.js SDK)
- **Storage**: IndexedDB via `dexie.js` (wrapper for simpler API)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Document Parsing**:
  - `mammoth.js` (Word docs)
  - `pdf.js` (PDFs)
- **PDF Export**: `jsPDF` or `html2pdf.js` with custom AR 25-50 CSS
- **State Management**: Zustand (lightweight) for editor state, document list
- **Deployment**: Vercel (optimized for Next.js)

---

## Architecture

### High-Level Flow

```
1. User authenticates (Clerk) → Redirects to Dashboard
2. Dashboard loads documents from IndexedDB → Displays in left sidebar
3. User uploads document OR selects existing document
4. Upload → Parse (mammoth/pdf.js) → Convert to Tiptap nodes → Save to IndexedDB
5. Editor loads document → Display in Notion-like UI
6. User edits (drag, indent, type) → Auto-save to IndexedDB every 2s
7. User exports → Apply AR 25-50 formatting → Generate PDF → Download
```

### Tiptap Editor Architecture

#### Custom MilitaryParagraph Node

The core of the editor is a **custom Tiptap node** that extends the default `Paragraph` node:

```typescript
import { Node } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'

export const MilitaryParagraph = Node.create({
  name: 'militaryParagraph',
  group: 'block',
  content: 'inline*',
  draggable: true, // Enable drag-and-drop

  addAttributes() {
    return {
      // Indent level: 0 (root), 1 (first sub), 2 (second sub), etc.
      indentLevel: {
        default: 0,
        parseHTML: element => parseInt(element.getAttribute('data-indent-level') || '0'),
        renderHTML: attributes => ({ 'data-indent-level': attributes.indentLevel }),
      },

      // Numbering style at this level
      numberingStyle: {
        default: 'numeric', // 'numeric' | 'alpha' | 'numParen' | 'alphaParen' | 'parenNumeric' | 'parenAlpha' | 'dashNumeric' | 'dashAlpha'
        parseHTML: element => element.getAttribute('data-numbering-style') || 'numeric',
        renderHTML: attributes => ({ 'data-numbering-style': attributes.numberingStyle }),
      },

      // Calculated number (e.g., "1.", "a.", "1)", "(1)")
      calculatedNumber: {
        default: '',
        parseHTML: element => element.getAttribute('data-calculated-number') || '',
        renderHTML: attributes => ({ 'data-calculated-number': attributes.calculatedNumber }),
      },

      // Left margin offset in inches (for AR 25-50 compliance)
      leftMarginInches: {
        default: 0,
        parseHTML: element => parseFloat(element.getAttribute('data-left-margin') || '0'),
        renderHTML: attributes => ({ 'data-left-margin': attributes.leftMarginInches }),
      },

      // Lock status: prevents manual drag/indent/outdent
      isLocked: {
        default: false,
        parseHTML: element => element.getAttribute('data-locked') === 'true',
        renderHTML: attributes => ({ 'data-locked': attributes.isLocked }),
      },

      // Suppress visual indentation for children: children maintain parent-child relationship but don't indent visually
      suppressChildIndent: {
        default: false,
        parseHTML: element => element.getAttribute('data-suppress-child-indent') === 'true',
        renderHTML: attributes => ({ 'data-suppress-child-indent': attributes.suppressChildIndent }),
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'p[data-military-paragraph]' },
      { tag: 'p' }, // Also parse regular paragraphs
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'p',
      {
        ...HTMLAttributes,
        'data-military-paragraph': 'true',
        class: `military-paragraph indent-${node.attrs.indentLevel}`,
      },
      0, // Content slot
    ]
  },
})
```

#### Numbering Hierarchy Rules

**Default Pattern** (user-customizable):

| Indent Level | Numbering Style | Example | Left Margin Offset |
|--------------|-----------------|---------|---------------------|
| 0            | Numeric         | 1., 2., 3. | 0" |
| 1            | Alpha lowercase | a., b., c. | 0.25" |
| 2            | Numeric parentheses | 1), 2), 3) | 0.5" |
| 3            | Alpha parentheses | a), b), c) | 0.75" |
| 4            | Parenthetic numeric | (1), (2), (3) | 1.0" |
| 5            | Parenthetic alpha | (a), (b), (c) | 1.25" |
| 6            | Dash numeric | 1-, 2-, 3- | 1.5" |
| 7            | Dash alpha | a-, b-, c- | 1.75" |

**Default Pattern Sequence**: `1. → a. → 1) → a) → (1) → (a) → 1- → a-`

**Customization**:
- Users can modify the numbering pattern in settings
- Custom patterns are saved per document or globally
- **Visual Indent Suppression**: Users can toggle "Suppress Child Indent" for any paragraph, which keeps the parent-child relationship and numbering hierarchy intact but removes the visual left margin indentation for all children

**Note**: The indent level is displayed in the table of contents but is **not editable directly**—users adjust indentation through the indent/outdent controls only.

**Visual Indent Suppression Feature**:
When a paragraph has "Suppress Child Indent" enabled:
- **Parent-child relationship preserved**: Children still maintain their logical hierarchy and numbering style
- **No visual indentation**: Children paragraphs align at the same left margin as the parent (0.25" offset removed)
- **Numbering continues**: Children use the correct numbering style for their level (e.g., parent "1)" has child "a)" but both at same margin)
- **Recursive option**: Can apply to all descendants or just immediate children (configurable)

**Example - Visual Indent Suppression**:
```
Normal indentation:
1. Mission
   a. Intent
      1) Commander's Intent

With "Suppress Child Indent" on "1. Mission":
1. Mission
a. Intent       ← Same margin as "1.", but still a child of "1."
1) Commander's Intent  ← Same margin, but still grandchild of "1."

With "Suppress Child Indent" on "a. Intent" only:
1. Mission
   a. Intent
   1) Commander's Intent  ← Same margin as "a.", but still child of "a."
```

**Use Case**: Army documents sometimes require children to be flush left with parent (e.g., in certain memorandum formats or annexes).

#### Node Detection & Parsing

When uploading a document, the parser identifies paragraphs as nodes based on:

1. **Spacing detection**: Blank lines between paragraphs
2. **Numbering pattern detection**: Regex patterns for common formats:
   - `^\d+\.` → "1.", "2.", "3." (Level 0)
   - `^[a-z]\.` → "a.", "b.", "c." (Level 1)
   - `^\d+\)` → "1)", "2)", "3)" (Level 2)
   - `^[a-z]\)` → "a)", "b)", "c)" (Level 3)
   - `^\(\d+\)` → "(1)", "(2)", "(3)" (Level 4)
   - `^\([a-z]\)` → "(a)", "(b)", "(c)" (Level 5)
   - `^\d+-` → "1-", "2-", "3-" (Level 6)
   - `^[a-z]-` → "a-", "b-", "c-" (Level 7)

**Parser Logic** (pseudocode):
```typescript
function parseDocumentToNodes(extractedText: string): MilitaryParagraphNode[] {
  const lines = extractedText.split('\n')
  const nodes: MilitaryParagraphNode[] = []

  for (let line of lines) {
    if (line.trim() === '') continue // Skip blank lines

    const detectedLevel = detectIndentLevel(line)
    const cleanedText = removeNumberingPrefix(line)

    nodes.push({
      type: 'militaryParagraph',
      attrs: {
        indentLevel: detectedLevel,
        numberingStyle: getStyleForLevel(detectedLevel),
        calculatedNumber: '', // Will be recalculated on render
      },
      content: [{ type: 'text', text: cleanedText }],
    })
  }

  return recalculateNumbering(nodes) // Assign correct numbering based on position
}
```

---

## Data Model & IndexedDB Schema

Using **Dexie.js** for IndexedDB management.

### Schema Definition

```typescript
import Dexie, { Table } from 'dexie'

export interface Document {
  id: string // UUID
  title: string
  documentType: 'MEMO' | 'OPORD' | 'FRAGORD' | 'WARNORD' | 'DA_FORM' | 'OTHER'
  content: object // Tiptap JSON structure
  metadata: {
    createdAt: number // Unix timestamp
    lastModified: number
    originalFileName: string
    unit?: string // Optional: User's unit (e.g., "1-101 CAB")
  }
}

class DocumentDatabase extends Dexie {
  documents!: Table<Document, string>

  constructor() {
    super('MilitaryDocumentEditor')
    this.version(1).stores({
      documents: 'id, title, documentType, metadata.lastModified',
    })
  }
}

export const db = new DocumentDatabase()
```

### Operations

```typescript
// Create
await db.documents.add({
  id: generateUUID(),
  title: 'OPORD 24-001',
  documentType: 'OPORD',
  content: tiptapJSON,
  metadata: {
    createdAt: Date.now(),
    lastModified: Date.now(),
    originalFileName: 'opord_draft.docx',
  },
})

// Read
const doc = await db.documents.get(documentId)

// Update (auto-save)
await db.documents.update(documentId, {
  content: updatedTiptapJSON,
  metadata: { ...doc.metadata, lastModified: Date.now() },
})

// Delete
await db.documents.delete(documentId)

// List all (sorted by last modified)
const allDocs = await db.documents.orderBy('metadata.lastModified').reverse().toArray()
```

**Storage Considerations**:
- **Images**: Store as base64 in Tiptap JSON (inline with content)
- **Quota**: Modern browsers allow ~50MB+ per origin (sufficient for 100+ documents)
- **Backup**: JSON export allows users to save externally

---

## AR 25-50 Formatting Rules

The following rules are applied **on PDF export** (not enforced during editing for flexibility):

### Margins
- **Top, Bottom, Left, Right**: 1 inch
- **Letterhead positioning**:
  - **Memorandum**: Letterhead at 1" from top of page
  - **OPORD**: OPORD letterhead at 1" from top of page
- **Crest positioning** (optional, typically Memorandums):
  - Crest top edge: 0.5" from top of page
  - Crest left edge: 0.5" from left edge of page

### Font
- **Typeface**: Arial
- **Size**: 12pt for body text
- **Exceptions**: Headers may use different sizes (TBD)

### Spacing
- **Line spacing**: Single-spaced within paragraphs
- **Paragraph spacing**: Double-space (1 blank line) between paragraphs at the same level
- **After punctuation**: 1 space after periods, colons

### Paragraph Indentation
- **Root level (1., 2., 3.)**: Flush left (0" indent)
- **First sublevel (a., b., c.)**: ¼" indent from left margin
- **Second sublevel (1), (2), (3))**: ½" indent
- **Subsequent levels**: Continue ¼" increments

### Block Format
- **Alignment**: Left-aligned (no right justification)
- **Numbering**: Follows hierarchy (see Numbering Hierarchy table)

### Document Structure - Memorandums
- **Crest** (if present): 0.5" from top, 0.5" from left edge
- **Office Symbol (with ARIMS)**: 1 line break below crest, flush left
- **Date**: Same line as office symbol, flush right
- **MEMORANDUM FOR / MEMORANDUM FOR RECORD**: 2 line breaks below office symbol line
- **SUBJECT**: 1 line break below MEMORANDUM FOR line
- **Body**: 2 line breaks below SUBJECT line

### Document Structure - OPORDs/FRAGORDs/WARNORDs
- **OPORD Letterhead** (flush right, at 1" from top):
  - Copy ___ of ___ copies
  - Unit info
  - Address
  - Date
- **Optional Crest** (if added): 0.5" from top, 0.5" from left edge
- **Document Name** (e.g., "WARNO 1 to OPORD 26-01"): 1 line break below letterhead, flush left
- **References**: 1 line break below document name; numbered list indented 0.25" (levels 1,2,3 only - no sub-levels)
- **Time Zone**: 1 line break below last reference line
- **Task Organization**: 1 line break below Time Zone line
- **Body** (starts with "1. Situation"): 1 line break below Task Organization line

### Signature Block
- **Placement**: Bottom of document
- **Format**: Name, rank, branch (details TBD)
- **Memorandums**: Authority line above signature block
- **OPORDs**: "OFFICIAL:" line with signature underline

**Note**: Full AR 25-50 compliance will be refined in future discussion. MVP focuses on margins, fonts, and indentation.

---

## User Interface Design

### Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Military Document Formatter               [User Menu ▼] [⚙️]   │
├──────────┬─────────────────┬────────────────────────────────────────────┤
│          │                 │                                            │
│ 📂 DOCS  │  📑 TOC         │  📝 EDITOR                                 │
│          │                 │                                            │
│ [+ New]  │  1. Mission     │  [⠿] [←→] 1. Mission Statement:           │
│ [📤 Up]  │    a. Intent    │        The purpose of this operation...   │
│          │    b. Concept   │                                            │
│ ─────────│  2. Execution   │  [⠿] [←→] 2. Execution:                   │
│          │    a. Scheme    │        The following tasks...             │
│ 📄 OPORD │       (1) Phase │                                            │
│   24-001 │  3. Sustainment │  [⠿] [←→]    a. Scheme of Maneuver:      │
│  2h ago  │                 │           Forces will...                  │
│          │                 │                                            │
│ 📝 MEMO  │                 │  [⠿] [←→]       (1) Phase 1:             │
│  For Rec │                 │              Initial contact...           │
│  1d ago  │                 │                                            │
│          │                 │  [Export PDF ⬇️] [Toggle Symbol 🎖️]        │
│ 🗑️ (12)  │                 │                                            │
│          │                 │                                            │
└──────────┴─────────────────┴────────────────────────────────────────────┘
  ↑            ↑                ↑
  Resizable    Auto-generated   Notion-like editor
  Sidebar      from nodes        with drag/indent controls
```

### Three-Panel Layout

#### Panel 1: Document Selector (Left, ~200px width, resizable)
- **Header**:
  - [+ New Document] button
  - [📤 Upload Document] button
- **Document List**:
  - Each item shows: Icon, Title, Time ago
  - Sorted by last modified (newest first)
  - Click to load in editor
  - Hover actions: Rename, Delete
- **Footer**: Trash bin with count of deleted docs

**Shadcn Components**: `ResizablePanel`, `ScrollArea`, `Button`, `Card`

#### Panel 2: Table of Contents (Middle-left, ~250px width, resizable)
- **Auto-generated** from `militaryParagraph` nodes
- **Structure visualization**:
  - Indent level shown with horizontal spacing
  - Shows `calculatedNumber` + first 3-5 words of paragraph text
  - **Lock indicator**: 🔒 icon shown for locked nodes
  - **Indent labels are display-only**: Not editable in TOC (use editor indent controls)
- **Interactive**:
  - Click to jump to paragraph in editor
  - Updates in real-time as user edits (numbering, position, lock status)
- **Collapsible**: Can hide to give more editor space

**Shadcn Components**: `ScrollArea`, `Tree` (custom component), `Button` (collapse toggle)

#### Panel 3: Editor (Right, remaining width)
- **Document Header Section** (conditional based on document type):
  - **Memorandum**:
    - Optional Crest image (0.5" from top/left)
    - Office Symbol input (with ARIMS) - 1 line break below crest, flush left
    - Date input - same line as office symbol, flush right
    - MEMORANDUM FOR / MEMORANDUM FOR RECORD selector - 2 line breaks below office symbol
    - SUBJECT input - 1 line break below MEMORANDUM FOR
  - **OPORD/FRAGO/WARNO**:
    - Letterhead block (flush right, at 1" from top): Copy count, Unit, Address, Date inputs
    - Optional Crest image (0.5" from top/left)
    - Document Name input - 1 line break below letterhead, flush left
    - References section - 1 line break below document name (numbered list, 0.25" indent)
    - Time Zone input - 1 line break below references
    - Task Organization input - 1 line break below Time Zone
- **Tiptap editor** with Notion-like UI (body starts 2 line breaks below header for Memo, 1 line break for OPORD)
- **Each paragraph has**:
  - **[⠿] Drag Handle**: Click and drag vertically to reorder (disabled if locked)
  - **[←] [→] Indent Controls**: Buttons to outdent/indent (disabled if locked)
  - **[🔒] Lock Button**: Toggle to lock/unlock node (prevents manual movement)
  - **[⬌] Suppress Indent Button**: Toggle to suppress visual indentation for children (keeps parent-child relationship, removes left margin offset)
  - **Calculated numbering prefix**: Auto-displayed based on position
- **Toolbar** (floating or fixed top):
  - Bold, Italic, Underline
  - Insert Table, Insert Image
- **Bottom Actions**:
  - [Export PDF] button
  - [Toggle Army Symbol] checkbox (removes images from top half of first page)
  - Auto-save indicator: "Saved 2 seconds ago"

**Shadcn Components**: `Button`, `Toggle`, `DropdownMenu`, `Tooltip`

### Notion-like Editor Features

Based on Tiptap's Notion-like template:

1. **Slash commands** (optional for MVP): Type `/` to insert elements (table, image)
2. **Drag handles**: Appear on hover to left of each paragraph
3. **Block-based**: Each paragraph is a distinct, selectable block
4. **Keyboard shortcuts**:
   - `Tab`: Indent paragraph (increase level)
   - `Shift+Tab`: Outdent paragraph (decrease level)
   - `Cmd+Z` / `Ctrl+Z`: Undo
   - `Cmd+Shift+Z` / `Ctrl+Y`: Redo

**Tiptap Extensions Used**:
- `@tiptap/extension-drag-handle-react`: For drag functionality
- Custom `MilitaryParagraph` node: For numbering/indentation
- `@tiptap/extension-table`: For editable tables
- `@tiptap/extension-image`: For image nodes
- `@tiptap/starter-kit`: Basic formatting (bold, italic, etc.)

---

## Smart Paragraph Logic & Indentation Rules

### Core Behaviors

#### 1. Vertical Dragging (Reordering)
**When a user drags a paragraph up or down**:
- **All descendants move**: The selected node AND all children, grandchildren, and nested descendants move as a complete subtree
- **Parent node numbering updates**: The moved parent node gets renumbered based on its new position
- **Children numbering unchanged**: Child nodes maintain their numbering style relative to the parent
- **Locked nodes**: Nodes with a lock 🔒 cannot be dragged manually, but they still update if their parent moves or if siblings change

**Example - Moving parent with nested children**:
```
Before:
1. Mission
   a. Intent
      1) Commander's Intent
      2) Concept of Operations
   b. Tasks
2. Execution

Drag "1. Mission" (with all nested children) below "2. Execution":

After:
1. Execution
2. Mission
   a. Intent
      1) Commander's Intent
      2) Concept of Operations
   b. Tasks
```
**Note**: "2. Mission" is renumbered from "1." but children "a., b." and grandchildren "1), 2)" remain unchanged relative to their parent.

#### 2. Horizontal Adjustment (Indent/Outdent)

**Indent Button [→] Rules**:
1. **Maximum depth**: Cannot indent beyond 7 levels (configurable)
2. **Parent requirement**: Must have a paragraph above it (becomes new parent)
3. **Parent numbering updates**: The moved node's number changes based on new level (e.g., "2." → "a.")
4. **All descendants indent**: Children, grandchildren, and all nested descendants indent with the parent
5. **Descendant numbering preserved**: Children maintain their numbering style relative to the parent (e.g., if parent moves to "a.", child "1)" stays "1)")
6. **Locked nodes**: Cannot be indented manually, but indent if parent indents

**Outdent Button [←] Rules**:
1. **Minimum depth**: Cannot outdent beyond level 0
2. **All descendants outdent**: Children, grandchildren, and all nested descendants outdent with parent
3. **Descendant numbering preserved**: Children maintain relative numbering
4. **Locked nodes**: Cannot be outdented manually, but outdent if parent outdents

**Example - Indent with nested children**:
```
Before:
1. Mission
2. Execution
   a. Concept
      1) Phase 1

User selects "2. Execution" and clicks [→]:

After:
1. Mission
   a. Execution
      1) Concept
         a) Phase 1
```
**Note**: "2. Execution" becomes "a. Execution", child "a. Concept" becomes "1) Concept", grandchild "1) Phase 1" becomes "a) Phase 1".

**Example - Outdent with nested children**:
```
Before:
1. Mission
   a. Intent
      1) Commander's Intent
         a) Vision

User selects "a. Intent" and clicks [←]:

After:
1. Mission
2. Intent
   a. Commander's Intent
      1) Vision
```
**Note**: "a. Intent" becomes "2. Intent", "1) Commander's Intent" becomes "a. Commander's Intent", "a) Vision" becomes "1) Vision".

#### 3. Node Lock Feature

**Lock Button [🔒]**:
- **Purpose**: Prevents a node from being dragged or manually indented/outdented
- **Behavior**:
  - Locked node cannot be moved by user
  - Locked node still updates its numbering if siblings change
  - Locked node still moves if its parent is moved
  - Locked node still indents/outdents if its parent indents/outdents
- **Visual indicator**: Lock icon appears next to node in editor and table of contents
- **Use case**: Prevent accidental movement of critical sections (e.g., "1. Situation" in an OPORD)

**Example - Locked node updates when sibling moves**:
```
Before:
1. Mission 🔒 (locked)
2. Execution
3. Sustainment

User drags "3. Sustainment" above "2. Execution":

After:
1. Mission 🔒 (still locked, numbering unchanged)
2. Sustainment
3. Execution
```

#### 4. Visual Indent Suppression

**Suppress Indent Button [⬌]**:
- **Purpose**: Removes visual left margin indentation for children while preserving parent-child relationships and numbering hierarchy
- **Behavior**:
  - When enabled on a node, all children align at the **same left margin** as the parent
  - Children maintain their **logical indent level** and **numbering style** (e.g., "a)", "(1)", etc.)
  - Parent-child relationships intact: moving/deleting parent still affects children
  - Recursive vs. Immediate: User can choose to apply to all descendants or just immediate children
- **Visual indicator**: ⬌ icon appears next to node in editor
- **Use case**: Army memorandums often require flush-left formatting for certain sections while maintaining numbering hierarchy

**Example - Suppress Indent Applied**:
```
Normal indentation:
1. Mission
   a. Intent
   b. Tasks
      1) Task 1
      2) Task 2

With "Suppress Child Indent" on "1. Mission":
1. Mission ⬌
a. Intent       ← Same margin as "1.", but still child of "1."
b. Tasks        ← Same margin as "1.", but still child of "1."
1) Task 1       ← Same margin as "1.", but still grandchild of "1." > "b."
2) Task 2       ← Same margin as "1.", but still grandchild of "1." > "b."

With "Suppress Child Indent" on "b. Tasks" only (immediate children):
1. Mission
   a. Intent
   b. Tasks ⬌
   1) Task 1    ← Same margin as "b.", but still child of "b."
   2) Task 2    ← Same margin as "b.", but still child of "b."
```

**Technical Implementation**:
- When calculating `leftMarginInches`, check if parent has `suppressChildIndent: true`
- If true, use parent's margin instead of incrementing by 0.25"
- Numbering logic remains unchanged (based on logical indent level, not visual margin)

#### 5. Sibling Indent Continuation

**Problem**: When creating multiple siblings at a deeper level, then outdenting, the numbering should continue from where it left off at the shallower level.

**Rule**: The editor tracks the last numbering count at each indent level. When outdenting back to a previous level, numbering continues from the last count.

**Example**:
```
Before:
1. Mission
2. Execution

User creates siblings by indenting "2. Execution" and adding paragraphs:

1. Mission
   a. Execution
   b. New sibling 1
   c. New sibling 2

User outdents "c. New sibling 2":

After:
1. Mission
   a. Execution
   b. New sibling 1
2. New sibling 2  ← Continues from "1." (picks up count of 2)
```

**Technical Implementation**:
- Maintain a counter array for each indent level: `[1, 2, 0, 0, 0, 0, 0, 0]` (8 levels)
- When moving to a deeper level, reset deeper counters
- When returning to a shallower level, resume count from stored value
- Recalculate after every indent/outdent/drag operation

#### 6. Automatic Renumbering

**Trigger**: Any change to paragraph position or indent level

**Algorithm** (pseudocode):
```typescript
function recalculateNumbering(nodes: MilitaryParagraphNode[]): MilitaryParagraphNode[] {
  const counters: Record<number, number> = {} // Track count at each level

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const level = node.attrs.indentLevel

    // Reset deeper level counters when returning to shallower level
    for (let l = level + 1; l <= 5; l++) {
      counters[l] = 0
    }

    // Increment counter at current level
    counters[level] = (counters[level] || 0) + 1

    // Determine numbering style and format
    const style = getNumberingStyleForLevel(level)
    const number = formatNumber(counters[level], style)

    node.attrs.calculatedNumber = number
    node.attrs.leftMarginInches = level * 0.25 // ¼" per level
  }

  return nodes
}

function formatNumber(count: number, style: string): string {
  switch (style) {
    case 'numeric': return `${count}.`
    case 'alpha': return `${String.fromCharCode(96 + count)}.` // a, b, c
    case 'parenNumeric': return `(${count})`
    case 'parenAlpha': return `(${String.fromCharCode(96 + count)})`
    case 'dashNumeric': return `${count}-`
    case 'dashAlpha': return `${String.fromCharCode(96 + count)}-`
    default: return `${count}.`
  }
}
```

### Edge Cases & Special Rules

#### Case 1: Indenting the first paragraph
- **Rule**: First paragraph (top of document) can be any level
- **Rationale**: User may upload partial document starting with "a." (which is level 1)

#### Case 2: Indenting beyond logical parent
**Problem**: User tries to indent "c." to level 2, but previous paragraph "b." is level 1

```
Before:
a. Item one
b. Item two
c. Item three

User selects "c." and clicks [→] twice:
```

**Rule**: Can only indent **one level deeper** than previous paragraph
- First [→] click: "c." becomes (1) (level 2, child of "b.")
- Second [→] click: Disabled or shows error "Cannot indent further without parent"

#### Case 3: Deleting a parent paragraph
**Problem**: User deletes "1." which has children "a." and "b."

**Rule**: Children outdent by 1 level and renumber
```
Before:
1. Mission
   a. Intent
   b. Concept
2. Execution

User deletes "1.":

After:
1. Intent
2. Concept
3. Execution
```

#### Case 4: Dragging a child away from parent
**Problem**: User drags "a." (child of "1.") to below "2."

```
Before:
1. Mission
   a. Intent
2. Execution

Drag "a." below "2.":

After:
1. Mission
2. Execution
   a. Intent
```

**Rule**: Child adopts new parent based on **position and indent level match**
- If dropped at same indent level as "2.", becomes sibling: "3. Intent"
- If dropped indented under "2.", becomes child: "a. Intent"

**Implementation**: On drop, compare indent level of dropped node with surrounding nodes to determine relationship

---

## Document Upload & Export

### Upload Flow

1. **User selects file** (Word .docx or PDF)
2. **File reader** loads content
3. **Parser extracts text and structure**:
   - **Word**: `mammoth.js` extracts HTML, detect outline levels
   - **PDF**: `pdf.js` extracts text, regex detects numbering
4. **Convert to Tiptap nodes**:
   - Apply `militaryParagraph` type
   - Set `indentLevel` based on detected numbering
   - Preserve images/tables as separate nodes
5. **Save to IndexedDB** with metadata
6. **Load into editor**

### Export Flow

#### PDF Export
1. **User clicks [Export PDF]**
2. **Apply AR 25-50 formatting**:
   - Inject CSS for 1" margins, Arial 12pt
   - Calculate left margins based on `leftMarginInches` attribute
   - Apply single/double spacing rules
3. **Optional: Toggle Army Symbol**:
   - If enabled, remove any `<img>` nodes in top 50% of first page
4. **Generate PDF** using `jsPDF` or `html2pdf.js`
5. **Download** as `{documentTitle}.pdf`

**Example CSS for Export**:
```css
@page {
  margin: 1in;
}

body {
  font-family: Arial, sans-serif;
  font-size: 12pt;
  line-height: 1.0; /* Single-spaced */
}

.military-paragraph {
  margin-bottom: 12pt; /* Double-space between paragraphs */
}

.military-paragraph.indent-0 { margin-left: 0in; }
.military-paragraph.indent-1 { margin-left: 0.25in; }
.military-paragraph.indent-2 { margin-left: 0.5in; }
.military-paragraph.indent-3 { margin-left: 0.75in; }
.military-paragraph.indent-4 { margin-left: 1.0in; }
.military-paragraph.indent-5 { margin-left: 1.25in; }
```

#### JSON Export
1. **User clicks [Export JSON]** (or auto-backup)
2. **Serialize Tiptap document** to JSON
3. **Download** as `{documentTitle}.json`

**Use case**: Backup, migration, or importing into future versions of the app

---

## Shadcn UI Components

Shadcn UI is a collection of re-usable components built with Radix UI and Tailwind CSS.

### Selected Components for MVP

| Component | Usage | Location |
|-----------|-------|----------|
| `Button` | New Doc, Upload, Export, Indent/Outdent controls | All panels |
| `ResizablePanel` | Three-panel layout (Document List, TOC, Editor) | Main layout |
| `ScrollArea` | Document list, Table of contents | Left/middle panels |
| `Card` | Document list items | Left panel |
| `DropdownMenu` | Document actions (Rename, Delete), User menu | Left panel, header |
| `Tooltip` | Hover hints for drag handles, indent buttons | Editor |
| `Toggle` | Army symbol export option | Export controls |
| `Input` | Document title editing, search | Left panel |
| `Dialog` | Upload modal, Delete confirmation | Modals |
| `Separator` | Visual dividers between sections | All panels |
| `Badge` | Document type indicator (OPORD, MEMO, etc.) | Document list |

### Custom Components

| Component | Description |
|-----------|-------------|
| `TiptapEditor` | Wrapper for Tiptap with custom MilitaryParagraph nodes |
| `DragHandleButton` | Drag handle with visual hover effect (disabled for locked nodes) |
| `IndentControls` | [←] [→] buttons for paragraph indentation (disabled for locked nodes) |
| `LockButton` | [🔒] toggle button to lock/unlock node |
| `SuppressIndentButton` | [⬌] toggle button to suppress visual indentation for children (preserves parent-child relationship) |
| `TableOfContents` | Tree view of document structure with lock indicators |
| `DocumentListItem` | Card with title, metadata, actions |

---

## Implementation Plan

### Phase 1: Core Editor 
**Goal**: Basic Tiptap editor with custom MilitaryParagraph nodes

**Tasks**:
1. Set up Next.js project with TypeScript, Tailwind, Shadcn UI
2. Integrate Clerk authentication
3. Create custom `MilitaryParagraph` node extension
4. Implement basic editor with drag-and-drop (using `@tiptap/extension-drag-handle-react`)
5. Build indent/outdent buttons
6. Implement auto-numbering logic (recalculate on change)
7. Create three-panel layout with Shadcn `ResizablePanel`

**Deliverable**: Editor that can create/edit numbered paragraphs with drag and indent controls

### Phase 2: Document Upload & Parsing
**Goal**: Parse Word/PDF uploads into Tiptap nodes

**Tasks**:
1. Integrate `mammoth.js` for Word parsing
2. Integrate `pdf.js` for PDF text extraction
3. Write regex-based node detection (numbering patterns, spacing)
4. Map extracted content to `MilitaryParagraph` nodes
5. Preserve images and tables as separate nodes
6. Build upload UI (drag-drop zone, file picker)

**Deliverable**: Users can upload Word/PDF and see content in editor

### Phase 3: Local Storage & Document Management
**Goal**: IndexedDB integration, document list, auto-save

**Tasks**:
1. Set up Dexie.js with schema
2. Implement CRUD operations
3. Build document selector panel (left sidebar)
4. Add auto-save (debounced, every 2 seconds)
5. Implement search/filter by title
6. Build table of contents panel (middle sidebar)
7. Make TOC clickable (jump to paragraph)

**Deliverable**: Users can save, load, and manage multiple documents

### Phase 4: Export & AR 25-50 Formatting
**Goal**: PDF export with formatting rules applied

**Tasks**:
1. Integrate `jsPDF` or `html2pdf.js`
2. Write CSS for AR 25-50 compliance (margins, fonts, spacing)
3. Implement Army symbol toggle logic (remove top-page images)
4. Build export UI (button, progress indicator)
5. Add JSON export functionality
6. Create introductory guide document (loads on first visit)

**Deliverable**: Fully functional MVP with export capability

### Phase 5: Testing & Refinement
**Goal**: Bug fixes, edge cases, UX polish

**Tasks**:
1. Test drag-and-drop edge cases (orphaned children, deep nesting)
2. Test upload parsing with real Army documents
3. Validate AR 25-50 compliance in exported PDFs
4. Optimize performance (large documents, auto-save lag)
5. Add keyboard shortcuts (Tab/Shift+Tab for indent)
6. User testing with Army staff officers
7. Fix bugs, refine UI based on feedback

**Deliverable**: Production-ready MVP

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
- `MilitaryParagraph` node: Attributes, rendering
- Numbering logic: `recalculateNumbering()` function
- IndexedDB operations: CRUD functions
- Upload parsers: `mammoth.js` and `pdf.js` wrappers

### Integration Tests (Cypress)
- End-to-end flow: Upload → Edit → Save → Export
- Drag-and-drop: Reordering paragraphs, renumbering
- Indent/outdent: Hierarchical changes, children following parent
- Auto-save: Verify IndexedDB updates after edits
- Table of contents: Sync with editor changes

### Edge Case Testing
- **Quota exceeded**: Simulate IndexedDB storage limit
- **Large documents**: 100+ paragraphs, 10MB files
- **Malformed uploads**: PDFs with no text, Word docs with odd formatting
- **Deep nesting**: 5+ indent levels
- **Orphaned children**: Delete parent, verify children outdent
- **Concurrent edits**: Rapid typing during auto-save

### User Acceptance Testing
- **Pilot group**: 3-5 Army staff officers
- **Scenarios**:
  1. Upload an existing OPORD, restructure paragraphs, export
  2. Create a new memorandum from scratch
  3. Test indent controls vs. Word's outline levels
- **Feedback**: Usability, time savings, bugs

---

## Deployment and Maintenance

### Deployment
- **Platform**: Vercel (automatic Next.js optimization)
- **Environment Variables**:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
- **Custom domain** (optional): `armydocs.app` or similar
- **HTTPS**: Enforced by Vercel

### Monitoring
- **Error tracking**: Sentry for client-side errors
- **Analytics**: Vercel Analytics (page views, performance)
- **User feedback**: In-app feedback button → email or issue tracker

### Maintenance
- **Quarterly updates**: Check browser API changes (IndexedDB, Tiptap updates)
- **AR 25-50 updates**: Monitor regulation changes, update formatting rules
- **Feature requests**: Collect from users, prioritize in backlog
- **Security patches**: Clerk and dependency updates

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Browser quota limits** | Users can't save more documents | Handle errors, show storage usage, prompt cleanup |
| **Data loss on device wipe** | Users lose all documents | Emphasize JSON export, auto-download backups |
| **Incomplete upload parsing** | Missing content or wrong structure | Provide manual correction tools, improve regex over time |
| **Tiptap performance with large docs** | Editor lag | Optimize rendering, lazy-load TOC, paginate long documents |
| **AR 25-50 non-compliance in exports** | Documents rejected by command | User testing with real docs, refine CSS rules |
| **Authentication breaches** | Unauthorized access | Rely on Clerk's security, enforce strong passwords |

---

## Open Questions & Future Discussions

### Questions to Resolve Before Development

1. **Exact AR 25-50 Numbering Rules**:
   - Confirm indent levels and numbering styles (currently using: 1. → a. → 1) → a) → (1) → (a) → 1- → a-)
   - Get example documents to reverse-engineer rules

2. **Header/Footer Requirements**:
   - Do memos need office symbols, date headers?
   - Signature block format and placement?

3. **Table Formatting**:
   - AR 25-50 rules for table borders, spacing, fonts?

4. **Image Handling**:
   - Max image size before warning user?
   - Allowed formats (PNG, JPG, SVG)?


---

## Conclusion

This specification defines an MVP for a **rapid Army document formatting tool** that addresses a critical pain point for staff officers: hours spent on formatting compliance. By leveraging a Notion-like Tiptap editor with custom paragraph nodes, drag-and-drop reorganization, and automatic AR 25-50 formatting on export, the app aims to reduce formatting time from **hours to minutes**.

**Next steps**:
1. Review and refine AR 25-50 formatting rules
2. Validate technical approach (Tiptap custom nodes, drag-and-drop)
3. Proceed with Phase 1 implementation (core editor)
4. Iterate based on user testing

**Document Status**: Ready for development after final rule clarifications.
