import { AgentBookEditor } from '@/components/book-editor/src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO_any = any;

export default function PlaygroundPage() {
    return (
        <div>
            <AgentBookEditor
                mode="edit"
                initialAgentSource={'xxx' as TODO_any}
                onSubmit={(agentSource: TODO_any /* string_agent_source */) => {
                    console.log('onSubmit', agentSource);
                }}
                onClose={() => {
                    console.log('onClose');
                    return null as TODO_any;
                }}
                onExport={() => {
                    console.log('onExport');
                    return null as TODO_any;
                }}
                abTestText={{
                    singular: 'xxx1',
                    singularCapitalized: 'xxx2',
                    createCapitalized: 'xxx3',
                }}
                backgroundImage={'xxx' as TODO_any}
                className="agent-book-editor"
                prefillAgentSource={'xxx' as TODO_any}
            />
        </div>
    );
}
