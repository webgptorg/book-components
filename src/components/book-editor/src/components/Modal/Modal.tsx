import React, { ReactNode, useEffect } from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Modal.module.css';

export interface ModalProps {
    title: ReactNode;
    children: ReactNode;
    zIndex?: number;
    isDisabled?: boolean;
    size?: 'FULL' | 'MEDIUM' | 'CONTENT';
    className?: string;
    rootClassName?: string;
    isTopBarHidden?: boolean;
    isCloseable?: boolean;
    closeIcon?: '✖' | '✔';
    onClose?: () => void;
}

/**
 * Simple modal component for the book editor
 */
export function Modal({
    zIndex = 3000,
    title,
    children,
    isDisabled = false,
    size = 'FULL',
    className,
    rootClassName,
    isTopBarHidden = false,
    isCloseable = false,
    closeIcon = '✖',
    onClose,
}: ModalProps) {
    // Disable scrolling on whole page when modal is open
    useEffect(() => {
        const bodyScrollPrevent = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains(styles.overlay!)) {
                event.preventDefault();
                return false;
            }
        };

        document.body.addEventListener('wheel', bodyScrollPrevent, { passive: false });
        document.body.addEventListener('touchmove', bodyScrollPrevent, { passive: false });

        return () => {
            document.body.removeEventListener('wheel', bodyScrollPrevent);
            document.body.removeEventListener('touchmove', bodyScrollPrevent);
        };
    }, []);

    return (
        <div className={classNames('webgpt-controls', rootClassName, styles.container)} style={{ zIndex }}>
            {!isCloseable || isDisabled ? (
                <div className={styles.overlay} style={{ zIndex: zIndex - 1 }} />
            ) : (
                <div onClick={onClose} className={styles.overlay} style={{ zIndex: zIndex - 1 }} />
            )}

            <dialog
                open
                className={classNames(
                    styles.Modal,
                    styles[size.toLowerCase() + 'Size'],
                    isDisabled && styles.isDisabled,
                    isTopBarHidden && styles.isTopBarHidden,
                )}
                style={{ zIndex }}
            >
                {!isTopBarHidden && (
                    <div className={styles.bar}>
                        <div className={styles.title}>
                            <h2>{title}</h2>
                        </div>
                        <div className={styles.icons}>
                            {isCloseable && onClose && (
                                <button data-button-type="custom" onClick={onClose}>
                                    {closeIcon}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className={classNames(styles.content, className)}>{children}</div>
            </dialog>
        </div>
    );
}
