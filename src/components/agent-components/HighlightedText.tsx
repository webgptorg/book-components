import React, { useMemo } from 'react';
import { getAllCommitmentTypes } from '../../../book/commitments';
import { createCommitmentTypeRegex } from '../../../book/commitments/_misc/createCommitmentRegex';
import styles from './AgentBookEditor.module.css';

interface HighlightedTextProps {
    text: string;
    className?: string;
}

/**
 * Component that renders text with highlighted keywords
 */
export function HighlightedText({ text, className }: HighlightedTextProps) {
    // Memoize the highlighted text to prevent unnecessary re-renders
    const highlightedContent = useMemo(() => {
        const renderTextWithHighlights = (inputText: string) => {
            if (!inputText) return [inputText];

            const parts: React.ReactNode[] = [];
            let lastIndex = 0;

            // Find all keyword matches
            const matches: Array<{ start: number; end: number; text: string }> = [];

            for (const commitment of getAllCommitmentTypes()) {
                const commitmentRegex = createCommitmentTypeRegex(commitment);

                let match;
                const tempText = inputText; // Reset string for each keyword search
                while ((match = commitmentRegex.exec(tempText)) !== null) {
                    matches.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        text: match[0],
                    });

                    // Prevent infinite loop on zero-length matches
                    if (match[0].length === 0) {
                        commitmentRegex.lastIndex++;
                    }
                }
            }

            // Sort matches by position and remove overlaps
            matches.sort((a, b) => a.start - b.start);

            // Remove overlapping matches (keep the first one)
            const filteredMatches: Array<{ start: number; end: number; text: string }> = [];
            for (let i = 0; i < matches.length; i++) {
                const match = matches[i];
                if (!match) continue;

                const lastMatch = filteredMatches[filteredMatches.length - 1];

                if (!lastMatch || match.start >= lastMatch.end) {
                    filteredMatches.push(match);
                }
            }

            // Build the result with highlighted keywords
            filteredMatches.forEach((match, index) => {
                // Add text before the match
                if (match.start > lastIndex) {
                    parts.push(inputText.slice(lastIndex, match.start));
                }

                // Add the highlighted keyword
                parts.push(
                    <span className={styles.keyword} key={`highlight-${index}`}>
                        {match.text}
                    </span>,
                );

                lastIndex = match.end;
            });

            // Add remaining text
            if (lastIndex < inputText.length) {
                parts.push(inputText.slice(lastIndex));
            }

            return parts.length > 0 ? parts : [inputText];
        };

        return renderTextWithHighlights(text);
    }, [text]);

    return (
        <div
            className={className}
            style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                // Ensure exact text rendering match with textarea
                fontVariantLigatures: 'none',
                fontKerning: 'none',
                textRendering: 'geometricPrecision',
            }}
        >
            {highlightedContent}
        </div>
    );
}
