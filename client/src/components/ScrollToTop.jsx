import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { FaCircleChevronUp } from "react-icons/fa6";
import styles from './styles/ScrollToTop.module.css';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const { scrollY } = useScroll();

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        if(location.hash) return;

        handleScrollToTop();
    }, [location.pathname, location.hash]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsVisible(latest > 300);
    });

    return (
        <button onClick={handleScrollToTop} aria-label="Scroll to top"
            className={`${styles.scrollToTop} ${isVisible ? styles.visible : styles.hidden}`}
        >
            <FaCircleChevronUp />
        </button>
    );
};

export default ScrollToTop;