import { BookCommitment } from './types';

/**
 * Creates a regex pattern for matching commitment types in text
 * @param commitment The commitment type to create a regex for
 * @returns RegExp that matches the commitment pattern
 */
export function createCommitmentTypeRegex(commitment: BookCommitment): RegExp {
    // Create a regex that matches the commitment type at the beginning of a line
    // followed by optional whitespace and content
    const pattern = `^${commitment}(?:\\s|$)`;
    return new RegExp(pattern, 'gm');
}
