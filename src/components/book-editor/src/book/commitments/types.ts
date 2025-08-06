/**
 * Book commitment types
 */
export type BookCommitment = 
    | 'PERSONA'
    | 'KNOWLEDGE'
    | 'STYLE'
    | 'RULE'
    | 'RULES'
    | 'SAMPLE'
    | 'EXAMPLE'
    | 'FORMAT'
    | 'MODEL'
    | 'ACTION'
    | 'PROFILE_IMAGE'
    | 'NOTE'
    | 'EXPECT'
    | 'SCENARIO'
    | 'SCENARIOS'
    | 'BEHAVIOUR'
    | 'BEHAVIOURS'
    | 'AVOID'
    | 'AVOIDANCE'
    | 'GOAL'
    | 'GOALS'
    | 'CONTEXT';

/**
 * Base class for commitment definitions
 */
export abstract class CommitmentDefinition {
    constructor(public readonly type: BookCommitment) {}
}

/**
 * Simple implementation for basic commitments
 */
export class BasicCommitmentDefinition extends CommitmentDefinition {
    constructor(type: BookCommitment) {
        super(type);
    }
}
