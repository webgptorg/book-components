# AgentBookEditor - Standalone Component

A standalone React component extracted from Promptbook Studio for creating and editing AI agents with a beautiful book-style interface.

## Installation

```bash
npm install @promptbook/book-editor
```

## Usage

```tsx
import React, { useState } from 'react';
import { AgentBookEditor, validateAgentSource, INITIAL_AGENT_SOURCE } from '@promptbook/book-editor';

function MyApp() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleSubmit = async (agentData) => {
    console.log('Agent data:', agentData.agentSource);
    // Handle the agent data here
    setIsEditorOpen(false);
  };

  const handleClose = () => {
    setIsEditorOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsEditorOpen(true)}>
        Create Agent
      </button>
      
      {isEditorOpen && (
        <AgentBookEditor
          mode="create"
          onSubmit={handleSubmit}
          onClose={handleClose}
          abTestText={{
            singular: "agent",
            singularCapitalized: "Agent",
            createCapitalized: "Create Agent"
          }}
          backgroundImage="https://example.com/background.jpg"
          initialAgentSource={INITIAL_AGENT_SOURCE}
        />
      )}
    </div>
  );
}
```

## Props

### AgentBookEditorProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mode` | `'create' \| 'edit'` | ✅ | Editor mode |
| `onSubmit` | `(agentData: { agentSource: string_agent_source }) => Promise<void> \| void` | ✅ | Called when form is submitted |
| `onClose` | `() => void` | ✅ | Called when editor is closed |
| `abTestText` | `{ singular: string; singularCapitalized: string; createCapitalized: string }` | ✅ | Text labels for the interface |
| `backgroundImage` | `string` | ✅ | URL for the bookmark background image |
| `initialAgentSource` | `string_agent_source` | ❌ | Initial content for edit mode |
| `prefillAgentSource` | `string_agent_source` | ❌ | Prefill content for create mode |
| `onExport` | `() => void` | ❌ | Called when export button is clicked (edit mode only) |
| `className` | `string` | ❌ | Additional CSS class for the component |
| `bookContainerClassName` | `string` | ❌ | CSS class for book container |
| `bookmarkClassName` | `string` | ❌ | CSS class for bookmark |
| `bookPagesClassName` | `string` | ❌ | CSS class for book pages |
| `leftPageClassName` | `string` | ❌ | CSS class for left page |
| `rightPageClassName` | `string` | ❌ | CSS class for right page |

## Features

- **Book-style Interface**: Beautiful book-like design with pages and bookmark
- **Syntax Highlighting**: Highlights commitment keywords (PERSONA, KNOWLEDGE, etc.)
- **Auto-save**: Automatic saving in edit mode
- **File Upload**: Drag & drop or click to upload knowledge files
- **Responsive**: Works on desktop and mobile devices
- **TypeScript**: Full TypeScript support with proper types

## Agent Source Format

The component works with agent sources that follow this format:

```
Agent Name

PERSONA A description of the agent's personality and role

KNOWLEDGE https://example.com/knowledge-source.pdf
KNOWLEDGE Additional knowledge content

STYLE Write in a professional tone

RULE Always be helpful and accurate
```

## Commitment Types

The following commitment types are supported and will be highlighted:

- `PERSONA` - Agent personality and role
- `KNOWLEDGE` - Knowledge sources and content
- `STYLE` - Writing style guidelines
- `RULE`/`RULES` - Behavioral rules
- `SAMPLE`/`EXAMPLE` - Example interactions
- `FORMAT` - Output format specifications
- `MODEL` - Model-specific instructions
- `ACTION` - Available actions
- `PROFILE_IMAGE` - Agent avatar
- `NOTE` - Additional notes

## Styling

The component comes with built-in styles that create a book-like appearance. You can customize the appearance by:

1. Passing custom CSS classes via the className props
2. Overriding CSS custom properties:

```css
:root {
  --book-font-family: 'Your Font', serif;
  --cancel-button-background-color: #ff6b6b;
  --cancel-button-hover-background-color: #ff5252;
  --cancel-button-hover-text-color: white;
}
```

## File Upload Integration

To handle file uploads, you need to implement an upload endpoint at `/api/upload-knowledge` that accepts FormData with a `knowledgeSource` field and returns:

```json
{
  "knowledgeSourceUrl": "https://example.com/uploaded-file.pdf"
}
```

Or you can override the upload behavior by customizing the `handleFilesDropped` function.

## Dependencies

- React 18+
- Next.js 13+ (for Image component and CSS modules)
- TypeScript 4.9+

## License

See LICENSE file for details.
