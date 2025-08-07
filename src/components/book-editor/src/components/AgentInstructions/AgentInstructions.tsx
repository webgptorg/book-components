'use client';


interface AgentInstructionsProps {
    className?: string;
    rightPageLinesClassName?: string;
}

/**
 * Shared instructions component for agent creation and editing
 */
export function AgentInstructions({

    className,
    rightPageLinesClassName,
}: AgentInstructionsProps) {

    return (
        <div className={className}>
            <div className={rightPageLinesClassName}></div>
        </div>
    );
}
