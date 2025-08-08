'use client';

import type { PipelineString } from '@promptbook/types';
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
    value?: PipelineString;

    /**
     * Callback function to handle changes in the book content.
     */
    onChange?: (value: PipelineString) => void;
}

export default function BookEditor(props: BookEditorProps) {
    const { className = '', value: controlledValue, onChange } = props;
    const [internalValue, setInternalValue] = useState('');

    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            if (controlledValue !== undefined) {
                onChange?.(newValue);
            } else {
                setInternalValue(newValue);
            }
        },
        [controlledValue, onChange],
    );

    return (
        <div className={`w-full ${className}`}>
            <textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
        </div>
    );
}
