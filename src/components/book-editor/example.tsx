import { useState } from 'react';
import {
  AgentBookEditor,
  INITIAL_AGENT_SOURCE,
  type AgentBookEditorProps,
  type string_agent_source
} from './src/index';

/**
 * Example usage of the AgentBookEditor component
 */
export function ExampleApp() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<string_agent_source>(INITIAL_AGENT_SOURCE);

  const handleCreateSubmit: AgentBookEditorProps['onSubmit'] = async (agentData) => {
    console.log('Creating new agent:', agentData.agentSource);
    
    // Here you would typically save the agent to your backend
    // await saveAgent(agentData.agentSource);
    
    setCurrentAgent(agentData.agentSource);
    setIsCreateModalOpen(false);
    
    alert('Agent created successfully!');
  };

  const handleEditSubmit: AgentBookEditorProps['onSubmit'] = async (agentData) => {
    console.log('Updating agent:', agentData.agentSource);
    
    // Here you would typically update the agent in your backend
    // await updateAgent(agentData.agentSource);
    
    setCurrentAgent(agentData.agentSource);
    setIsEditModalOpen(false);
    
    alert('Agent updated successfully!');
  };

  const handleExport = () => {
    console.log('Exporting agent:', currentAgent);
    
    // Create a downloadable file
    const blob = new Blob([currentAgent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AgentBookEditor Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New Agent
        </button>
        
        <button 
          onClick={() => setIsEditModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edit Current Agent
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3>Current Agent:</h3>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          fontSize: '14px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          {currentAgent}
        </pre>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <AgentBookEditor
          mode="create"
          onSubmit={handleCreateSubmit}
          onClose={() => setIsCreateModalOpen(false)}
          abTestText={{
            singular: "agent",
            singularCapitalized: "Agent",
            createCapitalized: "Create Agent"
          }}
          backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
          initialAgentSource={INITIAL_AGENT_SOURCE}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <AgentBookEditor
          mode="edit"
          onSubmit={handleEditSubmit}
          onClose={() => setIsEditModalOpen(false)}
          onExport={handleExport}
          abTestText={{
            singular: "agent",
            singularCapitalized: "Agent",
            createCapitalized: "Create Agent"
          }}
          backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
          initialAgentSource={currentAgent}
        />
      )}
    </div>
  );
}

export default ExampleApp;
