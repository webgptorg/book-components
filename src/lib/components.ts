import { COMPONENTS_DATA } from './components-data';

export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  version: string;
  repository: string;
  dependencies: Record<string, string>;
  props: Record<string, {
    type: string;
    default?: any;
    description: string;
    required?: boolean;
  }>;
  types?: Record<string, any>;
  features: string[];
  examples: Array<{
    title: string;
    code: string;
  }>;
}

export function getAllComponents(): ComponentMetadata[] {
  return COMPONENTS_DATA.sort((a, b) => a.name.localeCompare(b.name));
}

export function getComponentById(id: string): ComponentMetadata | null {
  const components = getAllComponents();
  return components.find(component => component.id === id) || null;
}

export function getComponentsByCategory(): Record<string, ComponentMetadata[]> {
  const components = getAllComponents();
  const categorized: Record<string, ComponentMetadata[]> = {};

  for (const component of components) {
    if (!categorized[component.category]) {
      categorized[component.category] = [];
    }
    categorized[component.category].push(component);
  }

  return categorized;
}

export function searchComponents(query: string): ComponentMetadata[] {
  const components = getAllComponents();
  const lowercaseQuery = query.toLowerCase();

  return components.filter(component => 
    component.name.toLowerCase().includes(lowercaseQuery) ||
    component.description.toLowerCase().includes(lowercaseQuery) ||
    component.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    component.category.toLowerCase().includes(lowercaseQuery)
  );
}
