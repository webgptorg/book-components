import React from 'react';

interface CancelIconProps {
    size: number;
    onClick?: React.MouseEventHandler<SVGSVGElement>;
    className?: string;
    enforceMode?: 'LIGHT' | 'DARK';
}

/**
 * Simple cancel/close icon component
 */
export function CancelIcon({ size, onClick, className, enforceMode }: CancelIconProps) {
    const style: React.CSSProperties = {
        width: size,
        height: size,
        cursor: onClick ? 'pointer' : 'default',
        filter: enforceMode === 'LIGHT' ? 'hue-rotate(180deg) invert(100%) saturate(300%)' : undefined,
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            onClick={onClick}
        >
            <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
