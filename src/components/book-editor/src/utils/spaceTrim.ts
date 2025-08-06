/**
 * Utility function to trim spaces and handle multiline strings
 * This is a simplified version of the spaceTrim function from the original codebase
 */
export function spaceTrim(template: (block: (content: string) => string) => string): string {
    const block = (content: string) => content;
    const result = template(block);
    
    // Remove leading and trailing whitespace from each line
    // and remove empty lines at the beginning and end
    const lines = result.split('\n');
    
    // Find first and last non-empty lines
    let firstNonEmpty = 0;
    let lastNonEmpty = lines.length - 1;
    
    while (firstNonEmpty < lines.length && lines[firstNonEmpty]?.trim() === '') {
        firstNonEmpty++;
    }
    
    while (lastNonEmpty >= 0 && lines[lastNonEmpty]?.trim() === '') {
        lastNonEmpty--;
    }
    
    // Extract the relevant lines and find minimum indentation
    const relevantLines = lines.slice(firstNonEmpty, lastNonEmpty + 1);
    
    if (relevantLines.length === 0) {
        return '';
    }
    
    // Find minimum indentation (excluding empty lines)
    let minIndent = Infinity;
    for (const line of relevantLines) {
        if (line.trim() !== '') {
            const indent = line.length - line.trimStart().length;
            minIndent = Math.min(minIndent, indent);
        }
    }
    
    if (minIndent === Infinity) {
        minIndent = 0;
    }
    
    // Remove the minimum indentation from all lines
    const trimmedLines = relevantLines.map(line => {
        if (line.trim() === '') {
            return '';
        }
        return line.slice(minIndent);
    });
    
    return trimmedLines.join('\n');
}
