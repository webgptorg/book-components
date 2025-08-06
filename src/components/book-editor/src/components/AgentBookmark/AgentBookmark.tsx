import React from 'react';
import { CancelIcon } from '../icons/CancelIcon';
import { SendIcon } from '../icons/SendIcon';
import { UploadIcon } from '../icons/UploadIcon';
import { classNames } from '../../utils/classNames';
import styles from './AgentBookmark.module.css';

interface AgentBookmarkProps {
    backgroundImage: string;
    onClose: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isSubmitDisabled: boolean;
    submitTitle: string;
    className?: string;
    hideSubmitButton?: boolean;
    onExport?: () => void;
    showExportButton?: boolean;
    onUpload?: (files: FileList) => void;
    showUploadButton?: boolean;
}

/**
 * Shared bookmark component for agent modals with background image and action buttons
 */
export function AgentBookmark({
    backgroundImage,
    onClose,
    onSubmit,
    isSubmitting,
    isSubmitDisabled,
    submitTitle,
    className,
    hideSubmitButton = false,
    onExport,
    showExportButton = false,
    onUpload,
    showUploadButton = false,
}: AgentBookmarkProps) {
    const handleUploadClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '*/*';
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0 && onUpload) {
                onUpload(target.files);
            }
        };
        input.click();
    };

    return (
        <div className={classNames(styles.bookmark, className)} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className={styles.bookmarkContent}>
                <div className={styles.bookmarkButtons}>
                    <button data-button-type="custom" className={styles.closeButton} onClick={onClose} title="Close">
                        <CancelIcon size={25} enforceMode={'DARK'} />
                    </button>
                    {showUploadButton && onUpload && (
                        <button
                            data-button-type="custom"
                            className={styles.uploadButton}
                            onClick={handleUploadClick}
                            title="Upload Files"
                        >
                            <UploadIcon size={25} />
                        </button>
                    )}
                    {showExportButton && onExport && (
                        <button
                            data-button-type="custom"
                            className={styles.exportButton}
                            onClick={onExport}
                            title="Export Agent"
                        >
                            👁️
                        </button>
                    )}
                    {!hideSubmitButton && (
                        <button
                            data-button-type="custom"
                            className={styles.saveButton}
                            onClick={onSubmit}
                            disabled={isSubmitting || isSubmitDisabled}
                            title={submitTitle}
                        >
                            <SendIcon size={25} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
