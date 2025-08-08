'use client';

import { DEFAULT_BOOK, getAllCommitmentDefinitions, validateBook } from '@promptbook/core';
import type { string_book } from '@promptbook/types';
import React, { useCallback, useState } from 'react';

interface BookEditorProps {
    /**
     * Additional CSS classes to apply to the textarea.
     *
     * Note: Not using `string_css_class` from `@promptbook/types` because its logic is not connected anyway with the Promptbook
     */
    className?: string;

    /**
     * The book which is being edited.
     */
    value?: string_book;

    /**
     * Callback function to handle changes in the book content.
     */
    onChange?: (value: string_book) => void;
}

export default function BookEditor(props: BookEditorProps) {
    const { className = '', value: controlledValue, onChange } = props;
    const [internalValue, setInternalValue] = useState<string_book>(DEFAULT_BOOK);

    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = event.target.value;
            if (controlledValue !== undefined) {
                onChange?.(validateBook(newValue));
            } else {
                setInternalValue(validateBook(newValue));
            }
        },
        [controlledValue, onChange],
    );

    return (
        <div className={`w-full ${className}`}>
            <textarea
                value={value}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
            {getAllCommitmentDefinitions().map(({ type }) => (
                <div key={type} className="mt-2">
                    <h4 className="text-lg font-semibold text-gray-900">{type}</h4>
                </div>
            ))}
        </div>
    );
}
