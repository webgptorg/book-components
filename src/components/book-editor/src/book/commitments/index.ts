import { BookCommitment, CommitmentDefinition, BasicCommitmentDefinition } from './types';

/**
 * Registry of all available commitment definitions
 * This array contains instances of all commitment definitions
 * This is the single source of truth for all commitments in the system
 */
export const COMMITMENT_REGISTRY: Array<CommitmentDefinition> = [
    // Fully implemented commitments
    new BasicCommitmentDefinition('PERSONA'),
    new BasicCommitmentDefinition('KNOWLEDGE'),
    new BasicCommitmentDefinition('STYLE'),
    new BasicCommitmentDefinition('RULE'),
    new BasicCommitmentDefinition('RULES'),
    new BasicCommitmentDefinition('SAMPLE'),
    new BasicCommitmentDefinition('EXAMPLE'),
    new BasicCommitmentDefinition('FORMAT'),
    new BasicCommitmentDefinition('MODEL'),
    new BasicCommitmentDefinition('ACTION'),
    new BasicCommitmentDefinition('PROFILE_IMAGE'),
    new BasicCommitmentDefinition('NOTE'),

    // Not yet implemented commitments (using placeholder)
    new BasicCommitmentDefinition('EXPECT'),
    new BasicCommitmentDefinition('SCENARIO'),
    new BasicCommitmentDefinition('SCENARIOS'),
    new BasicCommitmentDefinition('BEHAVIOUR'),
    new BasicCommitmentDefinition('BEHAVIOURS'),
    new BasicCommitmentDefinition('AVOID'),
    new BasicCommitmentDefinition('AVOIDANCE'),
    new BasicCommitmentDefinition('GOAL'),
    new BasicCommitmentDefinition('GOALS'),
    new BasicCommitmentDefinition('CONTEXT'),
];

/**
 * Gets a commitment definition by its type
 * @param type The commitment type to look up
 * @returns The commitment definition or undefined if not found
 */
export function getCommitmentDefinition(type: BookCommitment): CommitmentDefinition | undefined {
    return COMMITMENT_REGISTRY.find((def) => def.type === type);
}

/**
 * Gets all available commitment definitions
 * @returns Array of all commitment definitions
 */
export function getAllCommitmentDefinitions(): CommitmentDefinition[] {
    return [...COMMITMENT_REGISTRY];
}

/**
 * Gets all available commitment types
 * @returns Array of all commitment types
 */
export function getAllCommitmentTypes(): BookCommitment[] {
    return COMMITMENT_REGISTRY.map((def) => def.type);
}

/**
 * Checks if a commitment type is supported
 * @param type The commitment type to check
 * @returns True if the commitment type is supported
 */
export function isCommitmentSupported(type: BookCommitment): boolean {
    return COMMITMENT_REGISTRY.some((def) => def.type === type);
}

/**
 * Creates a custom commitment registry with only specified commitments
 * This is useful for customers who want to disable certain commitments
 *
 * @param enabledCommitments Array of commitment types to enable
 * @returns New registry with only the specified commitments
 */
export function createCustomCommitmentRegistry(enabledCommitments: BookCommitment[]): CommitmentDefinition[] {
    return COMMITMENT_REGISTRY.filter((def) => enabledCommitments.includes(def.type));
}
