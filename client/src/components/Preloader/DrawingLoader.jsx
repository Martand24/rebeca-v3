import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAuth } from "../../AuthContext";
const styles = {
    wrapper: {
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        background: "#000",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        color: "white",
        opacity: 1,
        fontWeight: "300",
        fontSize: "1rem",
        textAlign: "center",
        width: "80%",
        zIndex: 100000,
    },
};

const DrawingLoader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const totalFrames = 120;
    const { updateHeroAssets } = useAuth();

    // 1. ASSET LOADING LOGIC
    useEffect(() => {
        let loadedCount = 0;
        const preloadedImages = [];

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.src = `/rebeca-pink-frames/ezgif-frame-${i.toString().padStart(3, "0")}.webp`;
            preloadedImages.push(img);

            const handleLoad = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                    updateHeroAssets(preloadedImages);
                    setIsLoaded(true); // This triggers the second useEffect
                }
            };

            img.onload = handleLoad;
            img.onerror = handleLoad;
        }
    }, [updateHeroAssets]); // Only run once on mount

    // 2. EXIT ANIMATION LOGIC
    useEffect(() => {
        if (isLoaded) {
            const tl = gsap.timeline({
                onComplete: onComplete,
                delay: 0.5, // Small delay so user sees the ripples finish
            });

            tl.to(containerRef.current, {
                opacity: 0,
                filter: "blur(10px)", // Correct way to do blur in GSAP
                duration: 0.8,
                ease: "power2.inOut",
            });
        }
    }, [isLoaded, onComplete]);

    return (
        <div ref={containerRef} style={styles.wrapper}>
            {/* SVG Content Remains the same */}
            <svg viewBox="0 0 100 100" width="200" height="200" style={{ display: "block" }}>
                <style>
                    {`
                      .ripple { transform-origin: 50px 50px; animation: ripple-expand 0.8s ease-out infinite; }
                      .delay { animation-delay: 0.4s; }
                      @keyframes ripple-expand {
                        0% { transform: scale(0.3); opacity: 1; }
                        100% { transform: scale(2.5); opacity: 0; }
                      }
                    `}
                </style>
                <circle className="ripple" strokeWidth="2" stroke="#ff00f9" fill="none" r="15" cy="50" cx="50" />
                <circle className="ripple delay" strokeWidth="2" stroke="#6e28ff" fill="none" r="15" cy="50" cx="50" />
            </svg>
            <p style={styles.loadingText}>Preparing the stage for Rebeca...</p>
        </div>
    );
};
export default DrawingLoader;