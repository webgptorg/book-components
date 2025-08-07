'use client';

import React, { useCallback, useState } from 'react';

interface BookEditorProps {
    placeholder?: string;
    rows?: number;
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export default function BookEditor({
    placeholder = 'Start writing your book...',
    rows = 6,
    className = '',
    value: controlledValue,
    onChange,
}: BookEditorProps) {
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
