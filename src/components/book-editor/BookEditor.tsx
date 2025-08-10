'use client';

import { DEFAULT_BOOK, getAllCommitmentDefinitions, validateBook } from '@promptbook/core';
import type { string_book } from '@promptbook/types';
import { Libre_Baskerville } from 'next/font/google';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const libreBaskerville = Libre_Baskerville({
    subsets: ['latin'],
    weight: ['400', '700'],
});

interface BookEditorProps {
    /**
     * Additional CSS classes to apply to the editor container.
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

/**
 * Escape HTML to safely render user text inside a <pre> with dangerouslySetInnerHTML.
 */
function escapeHtml(input: string): string {
    return input.replaceAll(/&/g, '&').replaceAll(/</g, '<').replaceAll(/>/g, '>');
}

/**
 * Escape text for safe use inside a RegExp pattern.
 */
function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get current "word" around a caret index. We treat A–Z, a–z, 0–9, dash, and underscore as word chars.
 */
function getCurrentWord(text: string, caret: number) {
    let start = caret;
    while (start > 0 && /[A-Za-z0-9_-]/.test(text[start - 1] || '')) start--;
    let end = caret;
    while (end < text.length && /[A-Za-z0-9_-]/.test(text[end] || '')) end++;
    const word = text.slice(start, caret);
    return { start, end, word };
}

/**
 * Renders a book editor component that allows users to edit a book's content.
 * - Uses Libre Baskerville font with larger readable sizing
 * - Lined paper look with a subtle center fold line
 * - Tall editor area
 * - Highlights commitment keywords (PERSONA, KNOWLEDGE, EXAMPLE, ...) using @promptbook/core helpers
 * - Tailwind CSS styling
 * - Intellisense for commitment keywords (Ctrl+Space to open suggestions or type an uppercase prefix)
 *
 * Note on highlighting:
 * A transparent textarea is overlaid on top of a highlighted <pre>.
 * We sync scroll positions so the highlight stays aligned with typed text.
 */
export default function BookEditor(props: BookEditorProps) {
    const { className = '', value: controlledValue, onChange } = props;
    const [internalValue, setInternalValue] = useState<string_book>(DEFAULT_BOOK);

    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlightRef = useRef<HTMLPreElement>(null);
    const mirrorRef = useRef<HTMLDivElement>(null);

    const [lineHeight, setLineHeight] = useState<number>(32);

    // Intellisense state
    const [caretIndex, setCaretIndex] = useState<number>(0);
    const [isSuggestOpen, setIsSuggestOpen] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [suggestions, setSuggestions] = useState<
        { type: string; description?: string | null }[]
    >([]);
    const [caretPos, setCaretPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    // Gather definitions once (types, descriptions, docs)
    const definitions = useMemo(() => getAllCommitmentDefinitions(), []);
    // Build the regex for commitment types using @promptbook/core
    const typeRegex = useMemo(() => {
        const allTypes = definitions.map(({ type }) => String(type));
        const pattern = `\\b(?:${allTypes.map((t) => escapeRegex(t)).join('|')})\\b`;
        return new RegExp(pattern, 'gmi');
    }, [definitions]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = event.target.value;
            const next = validateBook(newValue);
            if (controlledValue !== undefined) {
                onChange?.(next);
            } else {
                setInternalValue(next);
            }
            setCaretIndex(event.target.selectionStart ?? next.length);
        },
        [controlledValue, onChange],
    );

    const handleScroll = useCallback((event: React.UIEvent<HTMLTextAreaElement>) => {
        const t = event.currentTarget;
        if (highlightRef.current) {
            highlightRef.current.scrollTop = t.scrollTop;
            highlightRef.current.scrollLeft = t.scrollLeft;
        }
        // keep caret position in sync when scrolling
        updateCaretPosition();
    }, []);

    const handleSelect = useCallback((event: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const el = event.currentTarget;
        setCaretIndex(el.selectionStart ?? 0);
    }, []);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        const measure = () => {
            const cs = window.getComputedStyle(el);
            const lh = parseFloat(cs.lineHeight || '0');
            if (!Number.isNaN(lh) && lh > 0) {
                setLineHeight(lh);
            }
        };

        // Initial measure
        measure();

        // Re-measure after fonts load (metrics can change once font renders)
        const fontsReady: Promise<unknown> | undefined = (document as Document & {
            fonts?: { ready?: Promise<unknown> };
        }).fonts?.ready;
        if (fontsReady && typeof (fontsReady as Promise<unknown>).then === 'function') {
            fontsReady
                .then(() => {
                    measure();
                })
                .catch(() => {
                    /* ignore */
                });
        }

        // Re-measure on resize
        window.addEventListener('resize', measure);
        return () => {
            window.removeEventListener('resize', measure);
        };
    }, []);

    // Generate highlighted HTML version of the current text
    const highlightedHtml = useMemo(() => {
        const text = value ?? '';
        const r = typeRegex;

        let lastIndex = 0;
        let out = '';

        text.replace(r, (match, ...args) => {
            const index = args[args.length - 2] as number; // offset
            out += escapeHtml(text.slice(lastIndex, index));
            out += `<span class="text-indigo-700 font-semibold">${escapeHtml(match)}</span>`;
            lastIndex = index + match.length;
            return match;
        });

        out += escapeHtml(text.slice(lastIndex));
        return out;
    }, [value, typeRegex]);

    // Mirror HTML up to caret, used to measure the caret position for suggestion overlay
    const mirrorHtml = useMemo(() => {
        const t = value ?? '';
        const upto = t.slice(0, caretIndex);
        // We do not include highlighting in mirror; it just needs layout wrapping to mimic textarea
        return `${escapeHtml(upto)}<span id="caret-marker"></span>`;
    }, [value, caretIndex]);

    // Update caret pixel position from mirror
    const updateCaretPosition = useCallback(() => {
        const mirror = mirrorRef.current;
        const container = containerRef.current;
        const ta = textareaRef.current;

        if (!mirror || !container || !ta) return;

        const marker = mirror.querySelector('#caret-marker') as HTMLElement | null;
        if (!marker) return;

        const containerRect = container.getBoundingClientRect();
        const markerRect = marker.getBoundingClientRect();

        // Position relative to the container; adjust for textarea scroll
        const left = markerRect.left - containerRect.left - (ta.scrollLeft || 0);
        const top =
            markerRect.top - containerRect.top - (ta.scrollTop || 0); /* caret baseline position */

        setCaretPos({
            left: Math.max(0, left),
            top: Math.max(0, top),
        });
    }, []);

    // Recompute caret pixel position when value, caret, or lineHeight changes
    useEffect(() => {
        updateCaretPosition();
    }, [mirrorHtml, lineHeight, updateCaretPosition]);

    // Compute suggestions from current word
    const recomputeSuggestions = useCallback(
        (openAll: boolean = false) => {
            const t = value ?? '';
            const { start, word } = getCurrentWord(t, caretIndex);

            const prefix = word || '';
            const isUppercasePrefix = /^[A-Z][A-Z0-9_-]*$/.test(prefix);

            let list = definitions.map((d) => ({ type: String(d.type), description: d.description }));
            if (!openAll && prefix.length > 0) {
                const up = prefix.toUpperCase();
                list = list.filter((d) => d.type.startsWith(up));
            }

            // Show only if there is reasonable trigger
            const shouldOpen = openAll || (isUppercasePrefix && list.length > 0);

            setSuggestions(list.slice(0, 20));
            setActiveIndex(0);
            setIsSuggestOpen(shouldOpen);

            // Ensure caret pixel position is up-to-date for popup placement
            updateCaretPosition();
        },
        [definitions, value, caretIndex, updateCaretPosition],
    );

    // Key handling for suggestions
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            // Ctrl/Cmd + Space to force open all suggestions
            if ((e.ctrlKey || e.metaKey) && (e.code === 'Space' || e.key === ' ')) {
                e.preventDefault();
                recomputeSuggestions(true);
                return;
            }

            if (isSuggestOpen) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
                    return;
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveIndex((i) => Math.max(i - 1, 0));
                    return;
                }
                if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    const sel = suggestions[activeIndex];
                    if (sel) {
                        applySuggestion(sel.type);
                    } else {
                        setIsSuggestOpen(false);
                    }
                    return;
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsSuggestOpen(false);
                    return;
                }
            }

            // For general typing, recompute suggestions on next tick (after value updates)
            // We do a microtask after event to let onChange run first
            queueMicrotask(() => recomputeSuggestions(false));
        },
        [isSuggestOpen, suggestions, activeIndex, recomputeSuggestions],
    );

    // When clicking inside editor, recompute suggestions to reflect new caret position
    const handleClick = useCallback(() => {
        recomputeSuggestions(false);
    }, [recomputeSuggestions]);

    function setBookValue(next: string) {
        const validated = validateBook(next);
        if (controlledValue !== undefined) {
            onChange?.(validated);
        } else {
            setInternalValue(validated);
        }
    }

    // Apply selected suggestion by replacing current word's prefix
    const applySuggestion = useCallback(
        (type: string) => {
            const t = value ?? '';
            const { start, end } = getCurrentWord(t, caretIndex);
            const before = t.slice(0, start);
            const after = t.slice(end);

            // If inserting in the middle of a line, keep a single space after the keyword
            const insert = type + (after.startsWith(' ') ? '' : ' ');

            const next = before + insert + after;
            setBookValue(next);

            const newCaret = (before + type).length + 1; // after the space
            requestAnimationFrame(() => {
                const el = textareaRef.current;
                if (el) {
                    el.focus();
                    el.setSelectionRange(newCaret, newCaret);
                }
                setCaretIndex(newCaret);
                setIsSuggestOpen(false);
            });
        },
        [value, caretIndex],
    );

    return (
        <div className={`w-full ${className}`} ref={containerRef}>
            <div
                className={[
                    'relative overflow-hidden rounded-2xl border border-gray-300/80 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-300/40',
                    'transition-shadow duration-200 hover:shadow-md',
                    libreBaskerville.className,
                ].join(' ')}
            >
                {/* Lined paper background (built into highlight layer styles) */}
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'none' }} />

                {/* Highlight layer */}
                <pre
                    ref={highlightRef}
                    aria-hidden
                    className={[
                        'absolute inset-0 overflow-auto pointer-events-none',
                        'whitespace-pre-wrap',
                        'text-gray-900',
                        'text-lg md:text-xl',
                        'py-6 md:py-8',
                        'pl-[46px] pr-[46px]',
                        // Ensure highlighted text sits below the textarea but remains visible
                        'z-10',
                    ].join(' ')}
                    style={{
                        lineHeight: `${lineHeight}px`,
                        backgroundImage: `linear-gradient(90deg, transparent 30px, rgba(59,130,246,0.3) 30px, rgba(59,130,246,0.3) 31px, transparent 31px), repeating-linear-gradient(0deg, transparent, transparent calc(${lineHeight}px - 1px), rgba(0,0,0,0.06) ${lineHeight}px)`,
                        backgroundAttachment: 'local',
                        backgroundOrigin: 'padding-box, content-box',
                        backgroundClip: 'padding-box, content-box',
                        overflowWrap: 'break-word',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />

                {/* Mirror layer (invisible) to measure caret position for suggestions */}
                <div
                    ref={mirrorRef}
                    aria-hidden
                    className={[
                        'absolute inset-0 overflow-hidden',
                        'whitespace-pre-wrap',
                        'text-lg md:text-xl',
                        'py-6 md:py-8',
                        'pl-[46px] pr-[46px]',
                        libreBaskerville.className,
                    ].join(' ')}
                    style={{
                        // Must match textarea text flow but not be visible
                        lineHeight: `${lineHeight}px`,
                        visibility: 'hidden',
                        pointerEvents: 'none',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                    }}
                    dangerouslySetInnerHTML={{ __html: mirrorHtml }}
                />

                {/* Editor (transparent text, visible caret) */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onScroll={handleScroll}
                    onSelect={handleSelect}
                    onKeyDown={handleKeyDown}
                    onClick={handleClick}
                    className={[
                        'relative z-20 w-full',
                        // Taller editor area
                        'h-[28rem] md:h-[36rem]',
                        // Typography
                        'text-transparent caret-gray-900 selection:bg-indigo-200/60',
                        'text-lg md:text-xl',
                        libreBaskerville.className,
                        // Layout and visuals
                        'bg-transparent outline-none resize-none',
                        'py-6 md:py-8',
                        'pl-[46px] pr-[46px]',
                    ].join(' ')}
                    style={{ lineHeight: `${lineHeight}px` }}
                    spellCheck={false}
                />

                {/* Intellisense suggestions popup */}
                {isSuggestOpen && suggestions.length > 0 && (
                    <div
                        className="absolute z-30 max-h-64 w-[min(520px,calc(100%-4rem))] overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
                        style={{
                            // Position popup under the caret; offset by line height for below-caret
                            top: Math.min(
                                Math.max(0, caretPos.top + lineHeight + 8),
                                // keep within container height
                                (textareaRef.current?.clientHeight || 0) - 16,
                            ),
                            left: Math.max(16, Math.min(caretPos.left + 46, (textareaRef.current?.clientWidth || 0) - 200)),
                        }}
                    >
                        <ul className="py-1">
                            {suggestions.map((s, i) => (
                                <li
                                    key={s.type + '_' + i}
                                    className={[
                                        'px-3 py-2 text-sm cursor-pointer',
                                        i === activeIndex ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50',
                                    ].join(' ')}
                                    onMouseDown={(e) => {
                                        // prevent textarea blur
                                        e.preventDefault();
                                        applySuggestion(s.type);
                                    }}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-xs md:text-sm text-indigo-700">{s.type}</span>
                                        {s.description ? (
                                            <span className="text-gray-600 line-clamp-2">{s.description}</span>
                                        ) : null}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-200 px-3 py-1 text-[11px] text-gray-500">
                            Press Enter/Tab to insert • Esc to close • Ctrl+Space to see all
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
