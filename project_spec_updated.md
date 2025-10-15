# Military Document Formatter - Updated Project Specification

**Description**: This specification outlines the plan for building a Next.js web application that enables Army staff officers to rapidly format sensitive documents according to AR 25-50 standards. The app uses Tiptap with a Notion-like UI for intuitive paragraph restructuring, Clerk for authentication, and IndexedDB for local browser storage. The core value proposition is reducing document formatting time from hours to minutes through intelligent node-based editing and automatic formatting application on export.

---

## Key Updates from User Feedback

### 1. **Modular, Document-Agnostic Approach**
- **No automatic document type detection** - The editor treats all documents generically
- Users manually add document-specific elements (Office Symbol, Subject lines, References, etc.) as modular components
- Users can add/delete sections at will to transform any document into a Memo, OPORD, FRAGO, or WARNORD
- All formatting rules are applied **only on PDF export**, not in the editor

### 2. **Left Ribbon Navigation**
- New **far-left ribbon** (collapsed by default, ~50px width) containing:
  - Clerk user profile avatar/menu
  - Settings button (for numbering pattern customization, keyboard shortcuts, etc.)
  - Other quick-access controls
- Layout becomes: **Ribbon → Document Selector → TOC → Editor**

### 3. **Infinite Scroll Editor (No Page Breaks)**
- Editor displays as an **infinite scrolling canvas** with no page break previews
- Page breaks, continuation headers, and widow/orphan prevention are calculated and applied **only during PDF export**
- Improves editing UX by removing visual clutter

### 4. **Modular Document Elements**
- **Office Symbol, Subject, References, Time Zone, Task Organization, Signature Blocks, etc.** are **insertable elements**, not auto-generated
- User selects from a toolbar/menu to insert these elements
- Elements can be edited inline in the editor or via a popup/modal
- Elements can be dragged, reordered, or deleted like other nodes

### 5. **References Section Behavior**
- **"References:" label** appears as a standalone line (no number)
- If numbered items (1., 2., 3.) appear below "References:", they are formatted with 0.25" indent
- If no numbered items follow, the references section remains as plain text inline
- Numbered references are **drag-and-drop within the references section only** (isolated from main document paragraphs)

### 6. **Signature Block Simplification**
- **Single signature block only** in MVP
- No rank validation, no automatic positioning by seniority
- User has full control over signature block content and placement

### 7. **Classification Markings on Export**
- User selects classification level from settings: "U" (Unclassified), "CUI" (Controlled Unclassified Information), etc.
- Option to display full text ("UNCLASSIFIED", "CONTROLLED UNCLASSIFIED INFORMATION") or abbreviation ("U", "CUI")
- Classification markings applied **automatically to top and bottom of every page on PDF export**

### 8. **Date Input - No Validation**
- Date fields are simple text inputs
- No format validation or auto-correction
- User responsible for correct formatting per AR 25-50 (e.g., "5 January 2018" for OPORDs)

### 9. **Crest Image - Hosted Asset**
- Army crest image lives on the hosted website (static asset)
- User clicks a button to insert crest
- Crest positioned at 0.5" from top, 0.5" from left on export

### 10. **Table Formatting on Export**
- Tables span full width (left margin to right margin)
- If table doesn't fit on one page:
  - Table is split at page break
  - Continuation page displays: **"Table continued from previous page"** above the rest of the table
- Table content follows AR 25-50 formatting (Arial 12pt, 1" margins)

### 11. **Keyboard Shortcuts - User Customizable**
- All keyboard shortcuts configurable in settings
- Default shortcuts: Tab (indent), Shift+Tab (outdent), Ctrl+Z (undo), Ctrl+Y (redo)
- User can remap or disable shortcuts

### 12. **Error Handling & User Feedback**
- Intelligent error handling with user-friendly messages
- Graceful degradation for parse failures, quota exceeded, malformed uploads
- Error recovery options (e.g., manual node correction, retry parse, clear cache)

### 13. **Performance - Lazy Loading**
- Lazy load document content in editor
- Virtual scrolling for TOC with 100+ items
- Debounced auto-save (2 seconds) to prevent lag
- Optimize rendering for documents up to 10MB

### 14. **Undo/Redo - Session-Based Only**
- Undo/redo buttons in Tiptap editor
- Undo history persists **only during active session**
- If user closes browser and returns, undo history is lost (starts fresh from last auto-save)
- No multi-version document history in MVP

### 15. **Removed from MVP**
- ~~User testing~~ (handled manually by client)
- ~~Onboarding guide document~~ (handled manually by client)

---

## Updated Implementation Plan

### Phase 1: Core Editor & Ribbon Layout
**Goal**: Basic Tiptap editor with custom MilitaryParagraph nodes and left ribbon

**Tasks**:
1. Set up Next.js project with TypeScript, Tailwind, Shadcn UI
2. Integrate Clerk authentication
3. Create **left ribbon** with profile avatar and settings button
4. Create **four-panel layout**: Ribbon → Document Selector → TOC → Editor
5. Create custom `MilitaryParagraph` node extension
6. Implement drag-and-drop (using `@tiptap/extension-drag-handle-react`)
7. Build indent/outdent buttons
8. Implement auto-numbering logic (recalculate on change)
9. Add undo/redo buttons (Tiptap history extension)

**Deliverable**: Editor with numbered paragraphs, drag/indent controls, and collapsible ribbon

---

### Phase 2: Modular Document Elements
**Goal**: Insertable document-specific elements (Office Symbol, Subject, References, etc.)

**Tasks**:
1. Create **InsertElementMenu** toolbar in editor
2. Build custom Tiptap nodes for:
   - **OfficeSymbolNode** (text input with ARIMS field)
   - **SubjectNode** (text input with "SUBJECT:" prefix option)
   - **ReferencesNode** (container with drag-and-drop numbered list)
   - **TimeZoneNode** (text input)
   - **TaskOrganizationNode** (text input)
   - **SignatureBlockNode** (name, rank, branch inputs)
3. Allow inline editing or popup modal for element details
4. Make elements draggable and deletable
5. Build **ReferencesSection** with isolated drag-and-drop for numbered items (no interaction with main document)

**Deliverable**: Users can insert and customize document-specific elements

---

### Phase 3: Document Upload & Parsing
**Goal**: Parse Word/PDF uploads into Tiptap nodes

**Tasks**:
1. Integrate `mammoth.js` for Word parsing
2. Integrate `pdf.js` for PDF text extraction
3. Write regex-based node detection (numbering patterns, spacing)
4. Map extracted content to `MilitaryParagraph` nodes
5. Preserve images and tables as separate nodes
6. Build upload UI (drag-drop zone, file picker)
7. Add error handling for parse failures (show warnings, allow manual correction)

**Deliverable**: Users can upload Word/PDF and see content in editor

---

### Phase 4: Local Storage & Document Management
**Goal**: IndexedDB integration, document list, auto-save

**Tasks**:
1. Set up Dexie.js with schema
2. Implement CRUD operations
3. Build document selector panel (sidebar to right of ribbon)
4. Add auto-save (debounced, every 2 seconds)
5. Implement search/filter by title
6. Build table of contents panel (auto-generated, clickable)
7. Lazy load document content (virtual scrolling for TOC)
8. Add error handling for quota exceeded (show storage usage, prompt cleanup)

**Deliverable**: Users can save, load, and manage multiple documents

---

### Phase 5: Settings Panel & Customization
**Goal**: User-configurable settings for numbering patterns, keyboard shortcuts, classification

**Tasks**:
1. Build **Settings Panel** (opens from ribbon)
2. Create **Numbering Pattern Editor**:
   - Visual UI for customizing hierarchy (Level 0: 1., Level 1: a., etc.)
   - Save per-document or global presets
3. Create **Keyboard Shortcuts Editor**:
   - List all shortcuts with editable key bindings
   - Validate conflicts, show warnings
4. Create **Classification Settings**:
   - Dropdown for level (U, CUI, S, TS, etc.)
   - Toggle for full text vs. abbreviation
5. Create **Crest Image Selector**:
   - Display hosted crest image
   - Button to insert into document at 0.5" from top/left

**Deliverable**: Users can customize numbering, shortcuts, classification, and insert crest

---

### Phase 6: PDF Export with AR 25-50 Formatting
**Goal**: PDF export with all formatting rules applied

**Tasks**:
1. Integrate `jsPDF` or `html2pdf.js`
2. Write **Export CSS** for AR 25-50 compliance:
   - 1" margins all sides
   - Arial 12pt font
   - Single-spaced text, double-spaced between paragraphs
   - Correct indentation (0.25" increments per level)
   - Two spaces after periods (optional auto-format)
3. Implement **Page Break Logic**:
   - Calculate page breaks based on content height
   - Apply continuation headers for Memos (office symbol + subject)
   - Apply classification markings to top/bottom of every page
4. Implement **Table Continuation Logic**:
   - Split tables at page breaks
   - Insert "Table continued from previous page" text
5. Implement **Army Symbol Toggle** (remove images from top 50% of first page)
6. Add **JSON export** functionality
7. Build export UI (button, progress indicator, preview modal)
8. Add error handling for export failures (show error, retry, download partial)

**Deliverable**: Fully functional PDF export with AR 25-50 formatting

---

### Phase 7: Polish & Edge Case Handling
**Goal**: Bug fixes, performance optimization, UX refinements

**Tasks**:
1. Test drag-and-drop edge cases (orphaned children, deep nesting)
2. Optimize performance for large documents (10MB+, 100+ paragraphs)
3. Validate AR 25-50 compliance in exported PDFs
4. Add keyboard shortcuts for common actions
5. Refine error messages (user-friendly, actionable)
6. Add loading states, progress indicators
7. Fix bugs from internal testing

**Deliverable**: Production-ready MVP

---

## Updated Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React 18+, TypeScript
- **Editor**: Tiptap 3.x
  - `@tiptap/react`
  - `@tiptap/starter-kit`
  - `@tiptap/extension-table`
  - `@tiptap/extension-image`
  - `@tiptap/extension-history` (undo/redo)
  - **`@tiptap-pro/extension-drag-handle-react`** (Tiptap Pro - requires authentication)
  - Custom nodes: `MilitaryParagraph`, `OfficeSymbol`, `Subject`, `References`, `TimeZone`, `TaskOrganization`, `SignatureBlock`
- **Authentication**: Clerk (Next.js SDK)
- **Storage**: IndexedDB via `dexie.js`
- **Styling**: Tailwind CSS + Shadcn UI components
- **Document Parsing**: `mammoth.js` (Word), `pdfjs-dist` (PDF)
- **PDF Export**: `jsPDF` with `html2canvas` for custom AR 25-50 CSS
- **State Management**: Zustand for editor state, document list, settings
- **Deployment**: Vercel

### Tiptap Pro Access
- **Registry**: `https://registry.tiptap.dev/`
- **Auth Token**: Stored in `.npmrc` (excluded from version control)
- **Setup**: See `SETUP.md` for configuration instructions

---

## Updated User Interface Design

### Four-Panel Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Military Document Formatter               [User Menu ▼] [⚙️]   │
├──┬───────────┬─────────────────┬──────────────────────────────────────────┤
│  │           │                 │                                          │
│🏠│ 📂 DOCS   │  📑 TOC         │  📝 EDITOR                               │
│⚙️│           │                 │                                          │
│👤│ [+ New]   │  1. Mission     │  [+ Insert Element ▼]                    │
│  │ [📤 Up]   │    a. Intent    │                                          │
│  │           │    b. Concept   │  [⠿] [←→] 1. Mission Statement:         │
│  │ ──────────│  2. Execution   │        The purpose of this operation... │
│  │           │    a. Scheme    │                                          │
│  │ 📄 Doc 1  │       (1) Phase │  [⠿] [←→] 2. Execution:                 │
│  │  2h ago   │  3. Sustainment │        The following tasks...           │
│  │           │                 │                                          │
│  │ 📝 Doc 2  │                 │  [Export PDF ⬇️] [Export JSON 💾]         │
│  │  1d ago   │                 │  Saved 2 seconds ago                     │
│  │           │                 │                                          │
│  │ 🗑️ (12)   │                 │                                          │
│  │           │                 │                                          │
└──┴───────────┴─────────────────┴──────────────────────────────────────────┘
  ↑      ↑            ↑                    ↑
Ribbon  Resizable  Auto-generated    Infinite scroll editor
(50px)  Sidebar    from nodes        with modular elements
```

### Ribbon Panel (Far Left, ~50px width, collapsible)
- **🏠 Home Icon**: Return to dashboard
- **⚙️ Settings Icon**: Open settings panel
- **👤 Profile Icon**: Clerk user menu (logout, account)
- **Collapse/Expand Button**: Show/hide ribbon

### Document Selector Panel (Left, ~200px width, resizable)
- [+ New Document] button
- [📤 Upload Document] button
- Document list (title, time ago, icon)
- 🗑️ Trash bin with count

### Table of Contents Panel (Middle-left, ~250px width, resizable)
- Auto-generated from nodes
- Clickable navigation
- Lock indicators (🔒)
- Collapsible

### Editor Panel (Right, remaining width)
- **[+ Insert Element]** dropdown menu with:
  - Office Symbol
  - Subject Line
  - References Section
  - Time Zone
  - Task Organization
  - Signature Block
  - Crest Image
  - Table
  - Image
- **Tiptap editor** with infinite scroll
- **Paragraph controls**: [⠿] drag, [←→] indent, [🔒] lock, [⬌] suppress indent
- **Toolbar**: Bold, italic, underline
- **Bottom bar**: Export buttons, auto-save indicator

---

## Updated AR 25-50 Formatting Rules (Applied on Export Only)

### Margins
- 1" all sides

### Font
- Arial 12pt (body text)

### Spacing
- Single-spaced within paragraphs
- Double-spaced between paragraphs
- Two spaces after periods (optional auto-format on export)

### Paragraph Indentation
- Level 0: 0" (flush left)
- Level 1: 0.25"
- Level 2: 0.5"
- Level 3: 0.75"
- Level 4: 1.0"
- Level 5: 1.25"
- Level 6: 1.5"
- Level 7: 1.75"

### Classification Markings
- Applied to **top and bottom of every page**
- User selects level in settings (U, CUI, S, TS, etc.)
- User selects format (abbreviation or full text)

### Crest Positioning
- 0.5" from top, 0.5" from left (if inserted by user)

### Table Formatting
- Span full width (left to right margin)
- If split across pages, insert "Table continued from previous page" on continuation

### Page Breaks
- Calculated on export (no preview in editor)
- Prevent widow/orphan lines where possible
- Apply continuation headers for Memos (office symbol + subject on subsequent pages)

---

## Custom Tiptap Nodes

### 1. MilitaryParagraph
- Attributes: `indentLevel`, `numberingStyle`, `calculatedNumber`, `leftMarginInches`, `isLocked`, `suppressChildIndent`
- Draggable, indent/outdent controls
- Auto-numbering based on hierarchy

### 2. OfficeSymbolNode
- Attributes: `officeSymbol`, `arims` (optional)
- Renders as: `{officeSymbol} ({arims})`
- Inline editable or popup modal

### 3. SubjectNode
- Attributes: `subjectText`, `showPrefix` (boolean for "SUBJECT:" prefix)
- Inline editable

### 4. ReferencesNode
- Container node with nested `ReferenceItemNode` children
- `ReferenceItemNode` has drag-and-drop **only within References section**
- Attributes: `referenceText`
- Renders as: `1. {referenceText}`, `2. {referenceText}`, etc.

### 5. TimeZoneNode
- Attributes: `timeZone`
- Inline editable

### 6. TaskOrganizationNode
- Attributes: `taskOrg`
- Inline editable or multi-line text area

### 7. SignatureBlockNode
- Attributes: `name`, `rank`, `branch`, `title`
- Renders as:
  ```
  {name}
  {rank}, {branch}
  {title}
  ```
- Inline editable or popup modal

### 8. CrestImageNode
- Displays hosted Army crest image
- Fixed position: 0.5" from top, 0.5" from left on export
- Draggable in editor for visual reference, but position locked on export

---

## Updated IndexedDB Schema

```typescript
export interface Document {
  id: string // UUID
  title: string
  content: object // Tiptap JSON structure (includes modular elements)
  settings: {
    numberingPattern: NumberingPattern[] // Custom hierarchy
    classification: 'U' | 'CUI' | 'S' | 'TS' | 'SCI' | null
    classificationFormat: 'abbreviation' | 'full' // "U" vs "UNCLASSIFIED"
    keyboardShortcuts: Record<string, string> // Action → Key binding
  }
  metadata: {
    createdAt: number
    lastModified: number
    originalFileName: string
  }
}

export interface NumberingPattern {
  level: number // 0-7
  style: 'numeric' | 'alpha' | 'numParen' | 'alphaParen' | 'parenNumeric' | 'parenAlpha' | 'dashNumeric' | 'dashAlpha'
  example: string // "1.", "a.", "(1)", etc.
}
```

---

## Error Handling Strategy

### Upload Errors
- **Parse failure**: Show warning "Unable to parse document. Content may be missing." → Offer "Retry" or "Edit Manually"
- **Unsupported format**: Show error "File format not supported. Please upload .docx or .pdf"

### Storage Errors
- **Quota exceeded**: Show error "Storage full. Please delete old documents or export to JSON." → Offer "View Storage Usage" or "Delete Documents"
- **IndexedDB unavailable**: Show error "Browser storage unavailable. Please enable IndexedDB or use a different browser."

### Export Errors
- **PDF generation failure**: Show error "Export failed. Please try again or export as JSON." → Offer "Retry" or "Export JSON"
- **Large document warning**: If document >10MB, show warning "Large document may take longer to export."

### Network Errors
- **Clerk auth failure**: Show error "Authentication failed. Please log in again."

---

## Conclusion

This updated specification reflects a **modular, user-driven approach** where:
- Users have full control over document structure (no auto-detection)
- All formatting rules are applied **only on PDF export**
- Editor is an **infinite canvas** with no page break previews
- **Ribbon navigation** provides quick access to settings and profile
- **Insertable elements** allow users to create Memos, OPORDs, FRAGORDs, WARNORDs without restrictions

**Next Steps**:
1. Create detailed file structure document (see `file_structure.md`)
2. Begin Phase 1 implementation (Core Editor & Ribbon Layout)
3. Iterate based on internal testing

**Document Status**: Ready for development.
