import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: boolean;
}

export const Card = ({ children, className = '', hoverEffect = false, ...props }: CardProps) => {
    return (
        <motion.div
            className={`glass-panel ${className}`}
            {...props}
            whileHover={hoverEffect ? { y: -5, boxShadow: 'var(--shadow-glow)' } : undefined}
            transition={{ duration: 0.2 }}
            style={{
                padding: '1.5rem',
                ...props.style
            }}
        >
            {children}
        </motion.div>
    );
};
