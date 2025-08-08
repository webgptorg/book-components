'use client';

import { DEFAULT_BOOK, getAllCommitmentDefinitions, parseAgentSource } from '@promptbook/core';
import type { string_book } from '@promptbook/types';
import React, { useMemo, useState } from 'react';
import BookEditor from './BookEditor';

/**
 * Renders a preview of `<BookEditor />` component.
 */
export default function BookEditorPreview() {
    const [book, setBook] = useState<string_book>(DEFAULT_BOOK);

    const bookParsed = useMemo(() => {
        return parseAgentSource(book);
    }, [book]);

    return (
        <div className={`w-full`}>
            <BookEditor value={book} onChange={setBook} />

            <h2 className="text-lg font-semibold mt-6 mb-2">Parsed Book Content</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{JSON.stringify(bookParsed, null, 4)}</code>
            </pre>

            <h2 className="text-lg font-semibold mt-6 mb-2">Commitment Definitions</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>
                    {getAllCommitmentDefinitions().map(({ type }) => (
                        <React.Fragment key={type}>
                            {type}
                            <br />
                        </React.Fragment>
                    ))}
                </code>
            </pre>
        </div>
    );
}
