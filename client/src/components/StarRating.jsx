import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./styles/StarRating.module.css";
import { IoStarHalf } from "react-icons/io5";

const StarRating = ({
    value,
    size,
    onChange,
    readonly = false,
    color = "var(--indigo)"
}) => {
    if(readonly && value == null) return "N/A";
    const [hoveredRating, setHoveredRating] = useState(0);

    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;

    const sizeClass = {
        "sm": styles.sm,
        "xs": styles.xs,
        "md": styles.md,
        "lg": styles.lg,
        "xl": styles.xl
    }[size] || styles.md;

    const handleClick = (rating) => {
        if (!readonly && onChange) {
            onChange(rating);
        }
    };

    return (
        <div className={styles.starRatingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    className={`${styles.starButton} ${sizeClass}`}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHoveredRating(star)}
                    onMouseLeave={() => !readonly && setHoveredRating(0)}
                    disabled={readonly}
                    whileHover={!readonly && { scale: 1.2 }}
                    whileTap={!readonly && { scale: 0.9 }}
                >
                    {star <= (hoveredRating || fullStars) ? (
                        <FaStar style={{ color }} />
                    ) : hasHalfStar && star === fullStars + 1 ? (
                        <IoStarHalf style={{ color }} />
                    ) : (
                        <FaRegStar className={styles.starEmpty} />
                    )}
                </motion.button>
            ))}
            {!readonly && (
                <span className={styles.ratingValue}>
                    {value > 0 ? `${value}/5` : 'Select rating'}
                </span>
            )}
        </div>
    );
};

export default StarRating;