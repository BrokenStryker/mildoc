# Tiptap Notion-like Editor Integration Guide

This document explains how to adapt the Tiptap Notion-like Editor template for our Military Document Formatter application.

---

## Overview

The Tiptap Notion-like Editor template provides a fully-featured rich text editor with:
- ✅ Drag-and-drop block reordering
- ✅ Slash commands for quick formatting
- ✅ Floating toolbar
- ✅ Real-time collaboration (optional)
- ✅ AI assistance (optional)
- ✅ Image uploads
- ✅ Code blocks, tables, lists, and more

**Our customization goals**:
1. Replace default paragraph nodes with our `MilitaryParagraph` node (auto-numbering, indent controls)
2. Add custom insertable elements (Office Symbol, Subject, References, etc.)
3. Integrate with our four-panel layout (Ribbon → Docs → TOC → Editor)
4. Add AR 25-50 formatting on PDF export

---

## Architecture

### Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ App Layout (Dashboard)                                          │
│ ┌──────┬────────────┬────────────┬──────────────────────────┐   │
│ │      │            │            │                          │   │
│ │Ribbon│ Document   │    TOC     │   Editor Container       │   │
│ │      │ Selector   │            │   ┌──────────────────┐   │   │
│ │      │            │            │   │ NotionEditor     │   │   │
│ │      │            │            │   │ (Tiptap Template)│   │   │
│ │      │            │            │   │                  │   │   │
│ │      │            │            │   │ + Custom         │   │   │
│ │      │            │            │   │   Extensions     │   │   │
│ │      │            │            │   └──────────────────┘   │   │
│ └──────┴────────────┴────────────┴──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Edit → Tiptap Editor → Custom Extensions (MilitaryParagraph, etc.)
     ↓                              ↓
IndexedDB (Auto-save)          TOC Update (Real-time)
     ↓                              ↓
Export → Apply AR 25-50 → Generate PDF
```

---

## Step 1: Create Custom MilitaryParagraph Extension

The default Tiptap paragraph doesn't support our military numbering system. We need to create a custom extension.

**File**: `src/lib/tiptap/extensions/military-paragraph.ts`

```typescript
import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface MilitaryParagraphOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    militaryParagraph: {
      setMilitaryParagraph: () => ReturnType
      indent: () => ReturnType
      outdent: () => ReturnType
      toggleLock: () => ReturnType
      toggleSuppressIndent: () => ReturnType
    }
  }
}

export const MilitaryParagraph = Node.create<MilitaryParagraphOptions>({
  name: 'militaryParagraph',

  priority: 1000, // Higher than default paragraph

  group: 'block',

  content: 'inline*',

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      indentLevel: {
        default: 0,
        parseHTML: element => parseInt(element.getAttribute('data-indent-level') || '0'),
        renderHTML: attributes => ({ 'data-indent-level': attributes.indentLevel }),
      },
      numberingStyle: {
        default: 'numeric',
        parseHTML: element => element.getAttribute('data-numbering-style') || 'numeric',
        renderHTML: attributes => ({ 'data-numbering-style': attributes.numberingStyle }),
      },
      calculatedNumber: {
        default: '',
        parseHTML: element => element.getAttribute('data-calculated-number') || '',
        renderHTML: attributes => ({ 'data-calculated-number': attributes.calculatedNumber }),
      },
      leftMarginInches: {
        default: 0,
        parseHTML: element => parseFloat(element.getAttribute('data-left-margin') || '0'),
        renderHTML: attributes => ({ 'data-left-margin': attributes.leftMarginInches }),
      },
      isLocked: {
        default: false,
        parseHTML: element => element.getAttribute('data-locked') === 'true',
        renderHTML: attributes => ({ 'data-locked': attributes.isLocked }),
      },
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
      { tag: 'p', priority: 50 }, // Lower priority than specific match
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'p',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-military-paragraph': 'true',
        class: `military-paragraph indent-${node.attrs.indentLevel}`,
      }),
      0, // Content slot
    ]
  },

  addCommands() {
    return {
      setMilitaryParagraph: () => ({ commands }) => {
        return commands.setNode(this.name)
      },
      indent: () => ({ tr, state, dispatch }) => {
        const { from } = state.selection
        const node = state.doc.nodeAt(from)

        if (!node || node.type.name !== this.name) return false
        if (node.attrs.indentLevel >= 7) return false // Max level
        if (node.attrs.isLocked) return false // Can't indent locked nodes

        if (dispatch) {
          tr.setNodeMarkup(from, undefined, {
            ...node.attrs,
            indentLevel: node.attrs.indentLevel + 1,
          })
        }

        return true
      },
      outdent: () => ({ tr, state, dispatch }) => {
        const { from } = state.selection
        const node = state.doc.nodeAt(from)

        if (!node || node.type.name !== this.name) return false
        if (node.attrs.indentLevel <= 0) return false // Min level
        if (node.attrs.isLocked) return false // Can't outdent locked nodes

        if (dispatch) {
          tr.setNodeMarkup(from, undefined, {
            ...node.attrs,
            indentLevel: node.attrs.indentLevel - 1,
          })
        }

        return true
      },
      toggleLock: () => ({ tr, state, dispatch }) => {
        const { from } = state.selection
        const node = state.doc.nodeAt(from)

        if (!node || node.type.name !== this.name) return false

        if (dispatch) {
          tr.setNodeMarkup(from, undefined, {
            ...node.attrs,
            isLocked: !node.attrs.isLocked,
          })
        }

        return true
      },
      toggleSuppressIndent: () => ({ tr, state, dispatch }) => {
        const { from } = state.selection
        const node = state.doc.nodeAt(from)

        if (!node || node.type.name !== this.name) return false

        if (dispatch) {
          tr.setNodeMarkup(from, undefined, {
            ...node.attrs,
            suppressChildIndent: !node.attrs.suppressChildIndent,
          })
        }

        return true
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Tab': () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
    }
  },
})
```

---

## Step 2: Modify NotionEditor to Use MilitaryParagraph

**File**: `src/components/tiptap-templates/notion/notion-like-editor.tsx`

Find the extensions array and add/replace the paragraph extension:

```typescript
import { MilitaryParagraph } from '@/lib/tiptap/extensions/military-paragraph'
import { Paragraph } from '@tiptap/extension-paragraph' // Import default paragraph

// ... in NotionEditor component

const extensions = [
  StarterKit.configure({
    paragraph: false, // Disable default paragraph
    // ... other starter kit options
  }),
  MilitaryParagraph.configure({
    HTMLAttributes: {
      class: 'military-paragraph',
    },
  }),
  // ... other extensions (DragHandle, Collaboration, AI, etc.)
]
```

---

## Step 3: Create Custom Node Renderers

### MilitaryParagraph Renderer with Controls

**File**: `src/components/tiptap-templates/notion/nodes/military-paragraph-node.tsx`

```typescript
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  AlignJustify
} from 'lucide-react'

export const MilitaryParagraphNode = ({ node, updateAttributes, editor }: any) => {
  const { indentLevel, isLocked, suppressChildIndent, calculatedNumber } = node.attrs

  const handleIndent = () => {
    if (!isLocked && indentLevel < 7) {
      editor.commands.indent()
    }
  }

  const handleOutdent = () => {
    if (!isLocked && indentLevel > 0) {
      editor.commands.outdent()
    }
  }

  const handleToggleLock = () => {
    editor.commands.toggleLock()
  }

  const handleToggleSuppressIndent = () => {
    updateAttributes({ suppressChildIndent: !suppressChildIndent })
  }

  return (
    <NodeViewWrapper className="military-paragraph-wrapper">
      <div className="flex items-start gap-2">
        {/* Numbering */}
        <span className="text-sm text-muted-foreground min-w-[40px]">
          {calculatedNumber}
        </span>

        {/* Content */}
        <NodeViewContent className="flex-1" />

        {/* Controls (appear on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleOutdent}
                disabled={isLocked || indentLevel === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Outdent</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleIndent}
                disabled={isLocked || indentLevel === 7}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Indent</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleToggleLock}
              >
                {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isLocked ? 'Unlock' : 'Lock'} paragraph</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleToggleSuppressIndent}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle suppress child indent</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </NodeViewWrapper>
  )
}
```

---

## Step 4: Create Custom Insertable Elements

### Office Symbol Node

**File**: `src/lib/tiptap/extensions/office-symbol-node.ts`

```typescript
import { Node, mergeAttributes } from '@tiptap/core'

export const OfficeSymbolNode = Node.create({
  name: 'officeSymbol',
  group: 'block',
  content: 'inline*',
  atom: true,

  addAttributes() {
    return {
      officeSymbol: { default: '' },
      arims: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-office-symbol]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-office-symbol': 'true' }),
      `${node.attrs.officeSymbol}${node.attrs.arims ? ` (${node.attrs.arims})` : ''}`,
    ]
  },

  addCommands() {
    return {
      insertOfficeSymbol: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },
})
```

### Add to Insert Menu

**File**: `src/components/tiptap-templates/notion/ui/insert-element-menu.tsx`

```typescript
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export const InsertElementMenu = ({ editor }: { editor: any }) => {
  const handleInsertOfficeSymbol = () => {
    editor.commands.insertOfficeSymbol({ officeSymbol: '', arims: '' })
  }

  const handleInsertSubject = () => {
    editor.commands.insertSubject({ subjectText: '', showPrefix: true })
  }

  // ... other insert handlers

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Insert Element
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleInsertOfficeSymbol}>
          Office Symbol
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleInsertSubject}>
          Subject Line
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.commands.insertReferences()}>
          References Section
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.commands.insertTimeZone()}>
          Time Zone
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.commands.insertTaskOrganization()}>
          Task Organization
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.commands.insertSignatureBlock()}>
          Signature Block
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Step 5: Auto-Numbering Plugin

Create a plugin to automatically recalculate numbering when paragraphs are reordered or indented.

**File**: `src/lib/tiptap/extensions/auto-numbering-plugin.ts`

```typescript
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { getNumberingStyleForLevel, formatNumber } from '@/lib/tiptap/numbering'

export const AutoNumberingPluginKey = new PluginKey('autoNumbering')

export const AutoNumberingPlugin = new Plugin({
  key: AutoNumberingPluginKey,

  appendTransaction(transactions, oldState, newState) {
    // Only recalculate if document structure changed
    const docChanged = transactions.some(tr => tr.docChanged)
    if (!docChanged) return null

    const tr = newState.tr
    const counters: Record<number, number> = {}
    let changed = false

    newState.doc.descendants((node, pos) => {
      if (node.type.name !== 'militaryParagraph') return

      const level = node.attrs.indentLevel

      // Reset deeper level counters
      for (let l = level + 1; l <= 7; l++) {
        counters[l] = 0
      }

      // Increment counter at current level
      counters[level] = (counters[level] || 0) + 1

      // Calculate new number
      const style = getNumberingStyleForLevel(level)
      const newNumber = formatNumber(counters[level], style)

      // Update if changed
      if (node.attrs.calculatedNumber !== newNumber) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          calculatedNumber: newNumber,
          leftMarginInches: level * 0.25,
        })
        changed = true
      }
    })

    return changed ? tr : null
  },
})
```

**Add to extensions**:

```typescript
import { AutoNumberingPlugin } from '@/lib/tiptap/extensions/auto-numbering-plugin'

const extensions = [
  // ... other extensions
  new Extension({ plugins: [AutoNumberingPlugin] }),
]
```

---

## Step 6: Integration with Four-Panel Layout

**File**: `src/app/(dashboard)/dashboard/page.tsx`

```typescript
'use client'

import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable'
import { Ribbon } from '@/components/layout/Ribbon'
import { DocumentSelector } from '@/components/layout/DocumentSelector'
import { TableOfContents } from '@/components/layout/TableOfContents'
import { NotionEditor } from '@/components/tiptap-templates/notion/notion-like-editor'
import { useDocumentStore } from '@/stores/documentStore'

export default function DashboardPage() {
  const { currentDocumentId, currentDocument } = useDocumentStore()

  return (
    <div className="h-screen flex">
      {/* Ribbon */}
      <Ribbon />

      {/* Four-Panel Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Document Selector */}
        <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
          <DocumentSelector />
        </ResizablePanel>

        <ResizableHandle />

        {/* Table of Contents */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <TableOfContents documentId={currentDocumentId} />
        </ResizablePanel>

        <ResizableHandle />

        {/* Editor */}
        <ResizablePanel defaultSize={65} minSize={50}>
          <div className="h-full p-8">
            {currentDocument ? (
              <NotionEditor
                room={`doc-${currentDocumentId}`}
                placeholder="Start writing your military document..."
                initialContent={currentDocument.content}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a document to begin editing
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
```

---

## Step 7: Export with AR 25-50 Formatting

**File**: `src/lib/exporters/pdfExporter.ts`

```typescript
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { applyAR2550Formatting } from './formatters/ar25-50-formatter'
import { applyClassificationMarkings } from './formatters/classificationMarkers'

export async function exportToPDF(
  editorHTML: string,
  settings: ExportSettings
): Promise<Blob> {
  // 1. Apply AR 25-50 formatting
  const formattedHTML = applyAR2550Formatting(editorHTML, settings)

  // 2. Apply classification markings
  const withClassification = applyClassificationMarkings(formattedHTML, settings)

  // 3. Convert to PDF
  const element = document.createElement('div')
  element.innerHTML = withClassification
  element.style.width = '8.5in'
  element.style.padding = '1in'
  element.style.fontFamily = 'Arial, sans-serif'
  element.style.fontSize = '12pt'

  document.body.appendChild(element)

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  })

  document.body.removeChild(element)

  const pdf = new jsPDF('p', 'in', 'letter')
  const imgData = canvas.toDataURL('image/png')
  pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11)

  return pdf.output('blob')
}
```

---

## Summary

**What we've integrated**:
1. ✅ Custom `MilitaryParagraph` extension with auto-numbering
2. ✅ Indent/outdent controls with lock functionality
3. ✅ Custom insertable elements (Office Symbol, Subject, etc.)
4. ✅ Auto-numbering plugin for real-time updates
5. ✅ Four-panel layout with Notion Editor embedded
6. ✅ PDF export with AR 25-50 formatting

**Next steps**:
- Implement remaining custom nodes (References, TimeZone, TaskOrganization, SignatureBlock, CrestImage)
- Connect to IndexedDB for auto-save
- Build TOC component that reads from editor state
- Create Settings panel for numbering customization

**Document Status**: Ready for Phase 1 implementation.
