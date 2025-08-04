import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Promisable } from 'type-fest';
import { string_agent_source, validateAgentSource } from '../../../book-agent-source/string_agent_source';
import { classNames } from '../../../utils/classNames';
import { HighlightedText } from './HighlightedText';

interface AgentFormProps {
    description: string;
    onDescriptionChange: (value: string_agent_source) => void;
    onSubmit: (e: React.FormEvent) => void;
    placeholder: string;
    isSubmitting: boolean;
    error: string | null;
    formId?: string;
    className?: string;
    textareaClassName?: string;
    textareaContainerClassName?: string;
    highlightOverlayClassName?: string;
    highlightedTextClassName?: string;
    errorClassName?: string;
    onFilesDropped?: (files: Array<File>) => Promisable<void>;
}

/**
 * Shared form component for agent creation and editing
 */
export function AgentForm({
    description,
    onDescriptionChange,
    onSubmit,
    placeholder,
    isSubmitting,
    error,
    formId,
    className,
    textareaClassName,
    textareaContainerClassName,
    highlightOverlayClassName,
    highlightedTextClassName,
    errorClassName,
    onFilesDropped,
}: AgentFormProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlightOverlayRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isFilesOver, setIsFilesOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Stable change handler to prevent cursor jumps
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = validateAgentSource(e.target.value);
            onDescriptionChange(newValue);
        },
        [onDescriptionChange],
    );

    // Synchronize scroll position between textarea and highlight overlay
    const syncScrollPosition = useCallback(() => {
        if (textareaRef.current && highlightOverlayRef.current) {
            const textarea = textareaRef.current;
            const overlay = highlightOverlayRef.current;

            // Ensure overlay content height matches textarea content height
            const textareaScrollHeight = textarea.scrollHeight;
            const overlayChild = overlay.firstElementChild as HTMLElement;
            if (overlayChild) {
                overlayChild.style.minHeight = `${textareaScrollHeight}px`;
            }

            // Immediate sync for better responsiveness
            overlay.scrollTop = textarea.scrollTop;
            overlay.scrollLeft = textarea.scrollLeft;

            // Also use requestAnimationFrame for additional smoothness
            requestAnimationFrame(() => {
                // Double-check the heights match
                if (overlayChild && textarea.scrollHeight !== overlayChild.scrollHeight) {
                    overlayChild.style.minHeight = `${textarea.scrollHeight}px`;
                }
                overlay.scrollTop = textarea.scrollTop;
                overlay.scrollLeft = textarea.scrollLeft;
            });
        }
    }, []);

    // Set up scroll synchronization
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Add multiple event listeners for comprehensive sync
        textarea.addEventListener('scroll', syncScrollPosition, { passive: true });
        textarea.addEventListener('input', syncScrollPosition, { passive: true });
        textarea.addEventListener('keydown', syncScrollPosition, { passive: true });
        textarea.addEventListener('keyup', syncScrollPosition, { passive: true });
        textarea.addEventListener('mousedown', syncScrollPosition, { passive: true });
        textarea.addEventListener('mouseup', syncScrollPosition, { passive: true });
        textarea.addEventListener('touchstart', syncScrollPosition, { passive: true });
        textarea.addEventListener('touchend', syncScrollPosition, { passive: true });
        textarea.addEventListener('touchmove', syncScrollPosition, { passive: true });

        // Also sync on resize to handle screen resolution changes
        const handleResize = () => {
            // Small delay to ensure layout is complete
            setTimeout(syncScrollPosition, 0);
            // Additional sync after a longer delay for complex layout changes
            setTimeout(syncScrollPosition, 100);
        };

        const handleOrientationChange = () => {
            // Longer delay for orientation changes
            setTimeout(syncScrollPosition, 200);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);

        // Initial sync with multiple attempts to ensure it works
        syncScrollPosition();
        setTimeout(syncScrollPosition, 0);
        setTimeout(syncScrollPosition, 50);
        setTimeout(syncScrollPosition, 100);

        return () => {
            textarea.removeEventListener('scroll', syncScrollPosition);
            textarea.removeEventListener('input', syncScrollPosition);
            textarea.removeEventListener('keydown', syncScrollPosition);
            textarea.removeEventListener('keyup', syncScrollPosition);
            textarea.removeEventListener('mousedown', syncScrollPosition);
            textarea.removeEventListener('mouseup', syncScrollPosition);
            textarea.removeEventListener('touchstart', syncScrollPosition);
            textarea.removeEventListener('touchend', syncScrollPosition);
            textarea.removeEventListener('touchmove', syncScrollPosition);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [syncScrollPosition]);

    // Set up Intersection Observer to detect when component becomes visible
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        // Sync when component becomes visible
                        setTimeout(syncScrollPosition, 0);
                        setTimeout(syncScrollPosition, 50);
                        setTimeout(syncScrollPosition, 100);
                    } else {
                        setIsVisible(false);
                    }
                });
            },
            { threshold: 0.1 },
        );

        observer.observe(textarea);

        return () => {
            observer.disconnect();
        };
    }, [syncScrollPosition]);

    // Sync scroll position when description changes (for external updates)
    useEffect(() => {
        syncScrollPosition();
    }, [description, syncScrollPosition]);

    // Additional sync when component becomes visible
    useEffect(() => {
        if (isVisible) {
            // Multiple sync attempts when component becomes visible
            syncScrollPosition();
            setTimeout(syncScrollPosition, 0);
            setTimeout(syncScrollPosition, 50);
            setTimeout(syncScrollPosition, 100);
            setTimeout(syncScrollPosition, 200);
        }
    }, [isVisible, syncScrollPosition]);

    // File drop handlers
    const handleDragEnter = useCallback((event: React.DragEvent) => {
        if (!onFilesDropped) return;
        event.stopPropagation();
        event.preventDefault();
        setIsFilesOver(true);
    }, [onFilesDropped]);

    const handleDragOver = useCallback((event: React.DragEvent) => {
        if (!onFilesDropped) return;
        event.stopPropagation();
        event.preventDefault();
        setIsFilesOver(true);
    }, [onFilesDropped]);

    const handleDragLeave = useCallback((event: React.DragEvent) => {
        if (!onFilesDropped) return;
        event.stopPropagation();
        event.preventDefault();
        setIsFilesOver(false);
    }, [onFilesDropped]);

    const handleDrop = useCallback(async (event: React.DragEvent) => {
        if (!onFilesDropped) return;

        event.preventDefault();
        event.stopPropagation();
        setIsFilesOver(false);

        try {
            setIsUploading(true);
            const files = Array.from(event.dataTransfer.files);
            await onFilesDropped(files);
        } catch (error) {
            console.error('File drop error:', error);
        } finally {
            setIsUploading(false);
        }
    }, [onFilesDropped]);

    return (
        <div className={className}>
            <form id={formId} onSubmit={onSubmit} className="form">
                <div
                    className={classNames(
                        textareaContainerClassName,
                        isFilesOver && 'files-over',
                        isUploading && 'uploading'
                    )}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <textarea
                        ref={textareaRef}
                        id="agent-description"
                        value={description}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={textareaClassName}
                        disabled={isSubmitting || isUploading}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                    />
                    <div ref={highlightOverlayRef} className={highlightOverlayClassName}>
                        <HighlightedText text={description || placeholder} className={highlightedTextClassName} />
                    </div>

                    {isFilesOver && onFilesDropped && (
                        <div className="file-drop-overlay">
                            Drop knowledge files here...
                        </div>
                    )}

                    {isUploading && (
                        <div className="file-upload-overlay">
                            Uploading knowledge...
                        </div>
                    )}
                </div>

                {error && <div className={errorClassName}>{error}</div>}
            </form>
        </div>
    );
}
