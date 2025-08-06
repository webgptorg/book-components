import { validateAgentSource } from './types/string_agent_source';

/**
 * Default agent name for AI avatars
 */
export const DEFAULT_AGENT_NAME = 'AI Avatar';

/**
 * Initial agent source for new agents
 */
export const INITIAL_AGENT_SOURCE = validateAgentSource(
    `${DEFAULT_AGENT_NAME}

PERSONA A friendly AI assistant that helps you with your tasks

`
);

/**
 * Upload response interface for knowledge sources
 */
export interface UploadWallpaperResponse {
    knowledgeSourceUrl: string;
}
