import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './Modal.module.css';


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <div className={styles.wrapper}>
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                        >
                            <div className={styles.header}>
                                <h2 className={styles.title}>{title}</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={onClose}
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={styles.body}>
                                {children}
                            </div>

                            {footer && (
                                <div className={styles.footer}>
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
