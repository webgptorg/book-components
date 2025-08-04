import { ComponentMetadata } from './components';

export const COMPONENTS_DATA: ComponentMetadata[] = [
  {
    "id": "textarea-with-counter",
    "name": "Textarea with Counter",
    "description": "A textarea component with real-time word and character counting, perfect for forms with length limits.",
    "category": "Form Controls",
    "tags": ["textarea", "counter", "form", "input", "validation"],
    "author": "Promptbook Team",
    "version": "1.0.0",
    "repository": "https://github.com/webgptorg/promptbook-components",
    "dependencies": {
      "react": "^18.0.0 || ^19.0.0",
      "tailwindcss": "^3.0.0 || ^4.0.0"
    },
    "props": {
      "placeholder": {
        "type": "string",
        "default": "Start typing...",
        "description": "Placeholder text for the textarea"
      },
      "maxLength": {
        "type": "number",
        "default": 500,
        "description": "Maximum number of characters allowed"
      },
      "rows": {
        "type": "number",
        "default": 4,
        "description": "Number of visible text lines"
      },
      "className": {
        "type": "string",
        "default": "",
        "description": "Additional CSS classes"
      },
      "value": {
        "type": "string",
        "description": "Controlled value (optional)"
      },
      "onChange": {
        "type": "(value: string) => void",
        "description": "Callback when value changes (for controlled mode)"
      }
    },
    "features": [
      "Real-time word counting",
      "Character limit enforcement",
      "Visual feedback when approaching limit",
      "Controlled and uncontrolled modes",
      "Responsive design",
      "Accessible keyboard navigation"
    ],
    "examples": [
      {
        "title": "Basic Usage",
        "code": "<TextareaWithCounter placeholder=\"Enter your message...\" />"
      },
      {
        "title": "With Custom Limit",
        "code": "<TextareaWithCounter maxLength={1000} rows={6} />"
      },
      {
        "title": "Controlled Mode",
        "code": "<TextareaWithCounter value={text} onChange={setText} />"
      }
    ]
  },
  {
    "id": "mermaid-social-graph",
    "name": "Mermaid Social Graph",
    "description": "A dynamic social network graph visualization using Mermaid.js, perfect for displaying relationships between people, organizations, and groups.",
    "category": "Data Visualization",
    "tags": ["mermaid", "graph", "social", "network", "visualization", "diagram"],
    "author": "Promptbook Team",
    "version": "1.0.0",
    "repository": "https://github.com/webgptorg/promptbook-components",
    "dependencies": {
      "react": "^18.0.0 || ^19.0.0",
      "mermaid": "^10.0.0",
      "tailwindcss": "^3.0.0 || ^4.0.0"
    },
    "props": {
      "nodes": {
        "type": "Node[]",
        "description": "Array of nodes representing entities in the graph",
        "required": true
      },
      "edges": {
        "type": "Edge[]",
        "description": "Array of edges representing relationships between nodes",
        "required": true
      },
      "className": {
        "type": "string",
        "default": "",
        "description": "Additional CSS classes"
      },
      "theme": {
        "type": "'default' | 'dark' | 'forest' | 'neutral'",
        "default": "default",
        "description": "Mermaid theme for the graph"
      },
      "direction": {
        "type": "'TB' | 'TD' | 'BT' | 'RL' | 'LR'",
        "default": "TB",
        "description": "Direction of the graph layout"
      }
    },
    "types": {
      "Node": {
        "id": "string",
        "label": "string",
        "type": "'person' | 'organization' | 'group' (optional)"
      },
      "Edge": {
        "from": "string",
        "to": "string",
        "label": "string (optional)",
        "type": "'friend' | 'colleague' | 'family' | 'follows' | 'member' (optional)"
      }
    },
    "features": [
      "Interactive social network visualization",
      "Multiple node types (person, organization, group)",
      "Various relationship types with different visual styles",
      "Customizable themes and layouts",
      "Responsive design",
      "Loading states and error handling",
      "Built on Mermaid.js for reliability"
    ],
    "examples": [
      {
        "title": "Basic Usage",
        "code": "<MermaidSocialGraph nodes={nodes} edges={edges} />"
      },
      {
        "title": "With Custom Theme",
        "code": "<MermaidSocialGraph nodes={nodes} edges={edges} theme=\"dark\" />"
      },
      {
        "title": "Horizontal Layout",
        "code": "<MermaidSocialGraph nodes={nodes} edges={edges} direction=\"LR\" />"
      }
    ]
  }
];
