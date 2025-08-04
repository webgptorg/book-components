import { getAllComponents } from '@/lib/components';

export default function TestPage() {
  try {
    const components = getAllComponents();
    return (
      <div className="p-8">
        <h1>Test Page</h1>
        <p>Found {components.length} components</p>
        <pre>{JSON.stringify(components, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1>Error</h1>
        <p>Error loading components: {String(error)}</p>
      </div>
    );
  }
}
