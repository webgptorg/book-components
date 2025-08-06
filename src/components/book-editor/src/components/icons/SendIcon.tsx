import React from 'react';

interface SendIconProps {
    size: number;
    onClick?: React.MouseEventHandler<SVGSVGElement>;
    className?: string;
}

/**
 * Simple send icon component
 */
export function SendIcon({ size, onClick, className }: SendIconProps) {
    const style: React.CSSProperties = {
        width: size,
        height: size,
        cursor: onClick ? 'pointer' : 'default',
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
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
