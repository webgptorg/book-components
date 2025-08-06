import React from 'react';

interface AgentInstructionsProps {
    singularCapitalized: string;
    singular: string;
    mode?: 'create' | 'edit';
    className?: string;
    rightPageLinesClassName?: string;
}

/**
 * Shared instructions component for agent creation and editing
 */
export function AgentInstructions({
    singularCapitalized,
    singular,
    mode = 'create',
    className,
    rightPageLinesClassName,
}: AgentInstructionsProps) {
    const isEditing = mode === 'edit';

    return (
        <div className={className}>
            <div className={rightPageLinesClassName}></div>
        </div>
    );
}
