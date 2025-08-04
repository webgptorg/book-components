import React, { useCallback, useEffect, useRef, useState } from 'react';
import { INITIAL_AGENT_SOURCE } from '../../../../config';
import { string_agent_source, validateAgentSource } from '../../../book-agent-source/string_agent_source';
import { UploadWallpaperResponse } from '../../../pages/api/upload-knowledge';
import { classNames } from '../../../utils/classNames';
import { spaceTrim } from '../../../utils/organization/spaceTrim';
import { Modal } from '../Modal/00-Modal';
import styles from './AgentBookEditor.module.css';
import { AgentBookmark } from './AgentBookmark';
import { AgentForm } from './AgentForm';
import { AgentInstructions } from './AgentInstructions';

export interface AgentBookEditorProps {
    mode: 'create' | 'edit';
    initialAgentSource?: string_agent_source;
    onSubmit: (agentData: { agentSource: string_agent_source }) => Promise<void> | void;
    onClose: () => void;
    onExport?: () => void;
    abTestText: {
        singular: string;
        singularCapitalized: string;
        createCapitalized: string;
    };
    backgroundImage: string;
    className?: string;
    bookContainerClassName?: string;
    bookmarkClassName?: string;
    bookPagesClassName?: string;
    leftPageClassName?: string;
    rightPageClassName?: string;
    prefillAgentSource?: string_agent_source;
}

/**
 * Shared book-style editor component for agent creation and editing
 */
export function AgentBookEditor({
    mode,
    initialAgentSource = INITIAL_AGENT_SOURCE,
    onSubmit,
    onClose,
    onExport,
    abTestText,
    backgroundImage,
    className,
    bookContainerClassName,
    bookmarkClassName,
    bookPagesClassName,
    leftPageClassName,
    rightPageClassName,
    prefillAgentSource = validateAgentSource(''),
}: // <- Prompt: Do not allow to pass multiple class names into the component, allow to pass only one `className` which will be applied to the root element and all other elements will use the styles defined in the component's CSS module, apply this rule to all components in the project
AgentBookEditorProps) {
    const [agentSource, setAgentSource] = useState<string_agent_source>(
        validateAgentSource(prefillAgentSource || initialAgentSource),
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSavedDescription, setLastSavedDescription] = useState(prefillAgentSource || initialAgentSource);

    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const originalContentRef = useRef(prefillAgentSource || initialAgentSource);
    const onSubmitRef = useRef(onSubmit);

    // Update onSubmit ref when prop changes
    useEffect(() => {
        onSubmitRef.current = onSubmit;
    }, [onSubmit]);

    // Update description when initialAgentSource changes (for edit mode)
    useEffect(() => {
        if (mode === 'edit' && initialAgentSource && initialAgentSource !== originalContentRef.current) {
            setAgentSource(initialAgentSource);
            setLastSavedDescription(initialAgentSource);
            originalContentRef.current = initialAgentSource;
        } else if (mode === 'create' && prefillAgentSource && prefillAgentSource !== originalContentRef.current) {
            setAgentSource(prefillAgentSource);
            setLastSavedDescription(prefillAgentSource);
            originalContentRef.current = prefillAgentSource;
        }
    }, [mode, initialAgentSource, prefillAgentSource]);

    // Track unsaved changes - optimize to prevent unnecessary re-renders
    useEffect(() => {
        const hasChanges = agentSource.trim() !== originalContentRef.current.trim();
        setHasUnsavedChanges(hasChanges);
    }, [agentSource]);

    // Auto-save functionality for edit mode
    const performAutoSave = useCallback(
        async (agentSource: string_agent_source) => {
            if (mode !== 'edit' || !agentSource.trim() || agentSource.trim() === lastSavedDescription.trim()) {
                return;
            }

            try {
                await onSubmitRef.current({
                    agentSource,
                });

                setLastSavedDescription(agentSource);
                setHasUnsavedChanges(false);
                originalContentRef.current = agentSource;
            } catch (err) {
                // Silently handle auto-save errors to avoid disrupting user experience
                console.warn('Auto-save failed:', err);
            }
        },
        [mode, lastSavedDescription],
    );

    // Force save any pending changes
    const forceSave = useCallback(async () => {
        if (mode === 'edit' && agentSource.trim() !== lastSavedDescription.trim()) {
            // Clear any pending auto-save timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
                autoSaveTimeoutRef.current = null;
            }

            // Perform immediate save
            await performAutoSave(agentSource);
        }
    }, [mode, agentSource, lastSavedDescription, performAutoSave]);

    // Prevent browser close when there are unsaved changes
    useEffect(() => {
        if (hasUnsavedChanges) {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                // For edit mode, try to save before unload
                if (mode === 'edit') {
                    // Note: We can't use async operations in beforeunload, so we'll just warn
                    e.preventDefault();
                    e.returnValue =
                        'You have unsaved changes that will be saved automatically. Are you sure you want to leave?';
                    return 'You have unsaved changes that will be saved automatically. Are you sure you want to leave?';
                } else {
                    // For create mode, warn about losing changes
                    e.preventDefault();
                    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                    return 'You have unsaved changes. Are you sure you want to leave?';
                }
            };

            const handlePopState = async (e: PopStateEvent) => {
                if (hasUnsavedChanges) {
                    if (mode === 'edit') {
                        // For edit mode, try to save before navigation
                        try {
                            await forceSave();
                        } catch (err) {
                            const confirmLeave = window.confirm(
                                'Failed to save your changes. Are you sure you want to leave? Your changes will be lost.',
                            );
                            if (!confirmLeave) {
                                e.preventDefault();
                                window.history.pushState(null, '', window.location.href);
                                return;
                            }
                        }
                    } else {
                        // For create mode, just confirm
                        const confirmLeave = window.confirm(
                            'You have unsaved changes. Are you sure you want to leave?',
                        );
                        if (!confirmLeave) {
                            e.preventDefault();
                            window.history.pushState(null, '', window.location.href);
                            return;
                        }
                    }
                }
            };

            // Prevent browser close/refresh
            window.addEventListener('beforeunload', handleBeforeUnload);

            // Prevent navigation via browser back/forward buttons
            window.addEventListener('popstate', handlePopState);

            // Push a state to handle back button
            window.history.pushState(null, '', window.location.href);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [mode, hasUnsavedChanges, forceSave]);

    // Auto-save with debounce - use a more stable approach
    useEffect(() => {
        if (mode === 'edit' && agentSource.trim() !== lastSavedDescription.trim()) {
            // Clear existing timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            // Set new timeout for auto-save
            autoSaveTimeoutRef.current = setTimeout(() => {
                performAutoSave(agentSource);
            }, 2000); // Increased to 2 seconds to reduce interference
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [agentSource, mode, lastSavedDescription, performAutoSave]);

    // Cleanup: Save any pending changes when component unmounts
    useEffect(() => {
        return () => {
            // Clear timeout on unmount
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            // For edit mode, try to save any pending changes on unmount
            // Note: This is a best-effort attempt, as the component is unmounting
            if (mode === 'edit' && agentSource.trim() !== lastSavedDescription.trim()) {
                // Use a synchronous approach since we can't await in cleanup
                try {
                    // Call onSubmit synchronously if possible
                    const result = onSubmitRef.current({
                        agentSource,
                    });

                    // If onSubmit returns a promise, we can't wait for it in cleanup
                    // but at least we've initiated the save
                    if (result instanceof Promise) {
                        result.catch((err) => console.warn('Failed to save on unmount:', err));
                    }
                } catch (err) {
                    console.warn('Failed to save on unmount:', err);
                }
            }
        };
    }, [mode, agentSource, lastSavedDescription]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agentSource.trim()) {
            setError(`${abTestText.singularCapitalized} description is required`);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onSubmit({
                agentSource,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to ${mode} ${abTestText.singular}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = async () => {
        // For create mode, show confirmation if there are unsaved changes
        if (mode === 'create' && hasUnsavedChanges) {
            const confirmClose = window.confirm(
                'You have unsaved changes. Are you sure you want to close without saving?',
            );
            if (!confirmClose) {
                return;
            }
        }

        // For edit mode, always save pending changes before closing
        if (mode === 'edit' && hasUnsavedChanges) {
            try {
                await forceSave();
            } catch (err) {
                // If save fails, show warning and ask user what to do
                const confirmCloseWithoutSave = window.confirm(
                    'Failed to save your changes. Do you want to close without saving? Your changes will be lost.',
                );
                if (!confirmCloseWithoutSave) {
                    return;
                }
            }
        }

        onClose();
    };

    const handleBookmarkSubmit = () => {
        if (agentSource.trim()) {
            const syntheticEvent = {
                preventDefault: () => {},
            } as React.FormEvent;
            handleSubmit(syntheticEvent);
        }
    };

    const getSubmitTitle = () => {
        if (isSubmitting) {
            return mode === 'create' ? 'Creating...' : 'Saving...';
        }
        return mode === 'create' ? abTestText.createCapitalized : 'Update';
    };

    // Handle file uploads for knowledge sources (from drag & drop)
    const handleFilesDropped = useCallback(async (files: Array<File>) => {
        // First, filter files and confirm multimedia files
        const filesToProcess: Array<File> = [];
        for (const file of files) {
            if (
                /^(image|audio|video)/.test(file.type) &&
                !confirm(
                    spaceTrim(
                        (block) => `
                            Agent source is not designed to handle multimedia files.
                            File:
                            ${block(file.name)}
                            Do you still want to continue?
                        `,
                    ),
                )
            ) {
                continue;
            }
            filesToProcess.push(file);
        }


        // Then upload files and update with URLs
        let processedFileIndex = 0;
        for (const file of filesToProcess) {
            try {
                const formData = new FormData();
                formData.append('knowledgeSource', file);

                // Note: [🛹] Not using `promptbookStudioFetch`
                const response = await fetch('/api/upload-knowledge', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok === false) {
                    throw new Error(`Upload knowledge source failed with status ${response.status}`);
                }

                const uploadWallpaperResponse = (await response.json()) as UploadWallpaperResponse;
                const { knowledgeSourceUrl } = uploadWallpaperResponse;

                console.info(`🌏 ${knowledgeSourceUrl}`);

                // Update the correct KNOWLEDGE commitment with the actual URL
                setAgentSource((currentAgentSource) => {
                    return validateAgentSource(
                        spaceTrim(
                            (block) => `
                                ${block(currentAgentSource)}
                                KNOWLEDGE ${knowledgeSourceUrl}
                            `,
                        ),
                    );
                });
            } catch (error) {
                console.error('Failed to upload knowledge source:', error);

                throw error;
            }
            processedFileIndex++;
        }
    }, []);

    // Handle file uploads for knowledge sources (from upload button)
    const handleFilesUploaded = useCallback(
        async (fileList: FileList) => {
            const files = Array.from(fileList);
            await handleFilesDropped(files);
        },
        [handleFilesDropped],
    );

    return (
        <Modal
            title=""
            isCloseable
            isTopBarHidden
            onClose={handleClose}
            className={classNames(styles.AgentBookEditor, className)}
            rootClassName={styles.AgentBookEditorRoot}
            size="CONTENT"
        >
            <div className={classNames(styles.bookContainer, bookContainerClassName)}>
                <AgentBookmark
                    backgroundImage={backgroundImage}
                    onClose={handleClose}
                    onSubmit={handleBookmarkSubmit}
                    onExport={onExport}
                    isSubmitting={isSubmitting}
                    isSubmitDisabled={!agentSource.trim()}
                    submitTitle={getSubmitTitle()}
                    className={classNames(styles.bookmark, bookmarkClassName)}
                    hideSubmitButton={mode === 'edit'}
                    showExportButton={mode === 'edit' && !!onExport}
                    onUpload={handleFilesUploaded}
                    showUploadButton={true}
                />

                <div className={classNames(styles.bookPages, bookPagesClassName)}>
                    <AgentForm
                        description={agentSource}
                        onDescriptionChange={setAgentSource}
                        onSubmit={handleSubmit}
                        placeholder={`First line will be the ${abTestText.singular} name...`}
                        isSubmitting={isSubmitting}
                        error={error}
                        className={classNames(styles.leftPage, leftPageClassName)}
                        textareaClassName={styles.textarea}
                        textareaContainerClassName={styles.textareaContainer}
                        highlightOverlayClassName={styles.highlightOverlay}
                        highlightedTextClassName={styles.highlightedText}
                        errorClassName={styles.error}
                        onFilesDropped={handleFilesDropped}
                    />

                    <AgentInstructions
                        singularCapitalized={abTestText.singularCapitalized}
                        singular={abTestText.singular}
                        mode={mode}
                        className={classNames(styles.rightPage, rightPageClassName)}
                        rightPageLinesClassName={styles.rightPageLines}
                    />
                </div>
            </div>
        </Modal>
    );
}
