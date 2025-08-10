'use client';

import { DEFAULT_BOOK, getAllCommitmentDefinitions, parseAgentSource } from '@promptbook/core';
import type { string_book } from '@promptbook/types';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import BookEditor from './BookEditor';

/**
 * Renders a preview of `<BookEditor />` component.
 */
export default function BookEditorPreview() {
    const [book, setBook] = useState<string_book>(DEFAULT_BOOK);

    const bookParsed = useMemo(() => {
        return parseAgentSource(book);
    }, [book]);

    // Commitment definitions manual (navigable)
    const definitions = useMemo(() => getAllCommitmentDefinitions(), []);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selected = definitions[selectedIndex];

    return (
        <div className={`w-full`}>
            <BookEditor value={book} onChange={setBook} />

            <h2 className="text-lg font-semibold mt-6 mb-2">Parsed Book Content</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{JSON.stringify(bookParsed, null, 4)}</code>
            </pre>

            <h2 className="text-lg font-semibold mt-6 mb-2">Commitment Definitions (Manual)</h2>
            <div className="flex gap-4">
                {/* Navigation list */}
                <div className="w-64 shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                        {definitions.map((d, i) => (
                            <li key={String(d.type)}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedIndex(i)}
                                    className={[
                                        'w-full text-left px-3 py-2 transition-colors',
                                        i === selectedIndex
                                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                            : 'hover:bg-gray-50',
                                    ].join(' ')}
                                >
                                    {String(d.type)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Details */}
                <div className="flex-1 border border-gray-200 rounded-lg p-4 min-h-[10rem] bg-white">
                    {selected ? (
                        <div>
                            <div className="mb-3">
                                <div className="text-sm uppercase text-gray-500 tracking-wide">Commitment</div>
                                <div className="text-xl font-semibold">{String(selected.type)}</div>
                                {/* Optional documentation text */}
                                {(() => {
                                    const doc = (selected as unknown as { documentation?: unknown })?.documentation;
                                    return typeof doc === 'string' && doc.trim() ? (
                                        <div className="mt-1 text-sm text-gray-600 break-words">{doc}</div>
                                    ) : null;
                                })()}
                            </div>

                            {/* Description in Markdown */}
                            <div className="text-gray-800">
                                <ReactMarkdown>
                                    {typeof selected.description === 'string'
                                        ? selected.description
                                        : String(selected.description ?? '')}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500">No commitment definitions found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
