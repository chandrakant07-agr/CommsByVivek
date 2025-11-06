import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles/Ripples.module.css';

/**
 * Ripples Component
 * 
 * A reusable ripple effect component that can be wrapped around buttons or clickable elements.
 * Creates a smooth, animated ripple effect on click with customizable color and duration.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The button or element to wrap
 * @param {string} [props.color] - Ripple color (default: uses accent color from theme)
 * @param {number} [props.duration=0.6] - Animation duration in seconds
 * @param {number} [props.size=100] - Size of ripple as percentage of container
 * @param {string} [props.className] - Additional CSS classes for container
 * @param {Function} [props.onClick] - Click handler function
 * 
 */

const Ripples = ({
    children,
    color = "rgba(255, 255, 255, 0.4)",
    duration = 0.6,
    size = 200,
    className = "",
    onClick,
    ...props
}) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = (event) => {
        const container = event.currentTarget;
        const rect = container.getBoundingClientRect();

        // Calculate ripple position relative to container
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Calculate size based on container dimensions
        const rippleSize = Math.max(rect.width, rect.height);

        // Create new ripple with unique id
        const newRipple = {
            id: Date.now() + Math.random(), // More unique ID
            x,
            y,
            size: rippleSize * (size / 100)
        };

        setRipples((prevRipples) => [...prevRipples, newRipple]);

        // Remove ripple after animation completes
        setTimeout(() => {
            setRipples((prevRipples) =>
                prevRipples.filter((ripple) => ripple.id !== newRipple.id)
            );
        }, duration * 1000);

        // Call parent onClick if provided
        if(onClick) {
            onClick(event);
        }
    };

    return (
        <div
            className={`${styles.rippleContainer} ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}

            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        className={styles.ripple}
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            backgroundColor: color,
                        }}
                        initial={{
                            width: 0,
                            height: 0,
                            opacity: 0.6,
                        }}
                        animate={{
                            width: ripple.size,
                            height: ripple.size,
                            opacity: 0,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        transition={{
                            duration: duration,
                            ease: 'easeOut',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Ripples;
