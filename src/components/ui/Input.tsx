import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, leftIcon, className = '', ...props }, ref) => {
        return (
            <div className={`${styles.wrapper} ${className}`}>
                {label && <label className={styles.label}>{label}</label>}

                <div className={styles.inputContainer}>
                    {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
                    <input
                        ref={ref}
                        className={`${styles.input} ${leftIcon ? styles.hasIcon : ''} ${error ? styles.error : ''}`}
                        {...props}
                    />
                    <div className={styles.borderGlow} />
                </div>

                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
