import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import styles from './Button.module.css';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        children,
        variant = 'primary',
        size = 'md',
        isLoading,
        leftIcon,
        rightIcon,
        className = '',
        disabled,
        ...props
    }, ref) => {

        const baseClass = styles.button;
        const variantClass = styles[`variant-${variant}`];
        const sizeClass = styles[`size-${size}`];

        return (
            <motion.button
                ref={ref}
                className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
                disabled={disabled || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {isLoading && <span className={styles.loader}></span>}

                {!isLoading && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
                        <span className={styles.content}>{children as React.ReactNode}</span>
                        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
                    </span>
                )}

                {variant === 'primary' && (
                    <div className={styles.glow} aria-hidden="true" />
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
