import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const DrawingLoader = ({ onComplete }) => {
    const pathRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const totalFrames = 120;

    useEffect(() => {
        // 2. Preloading Logic
        let loadedCount = 0;
        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.src = `/assets/rebeca-pink-frames/ezgif-frame-${i.toString().padStart(3, "0")}.webp`;

            const handleLoad = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                  setIsLoaded(true);
                }
            };

            img.onload = handleLoad;
            img.onerror = handleLoad; // Safety check
        }

        // 3. Exit Animation
        if (isLoaded) {
            const tl = gsap.timeline({
                onComplete: onComplete,
            });

            tl.to(containerRef.current, {
                opacity: 0,
                blur: 10,
                duration: 0.8,
                ease: "power2.inOut",
            });
        }
    }, [isLoaded, onComplete]);

    return (
        <div ref={containerRef} style={styles.wrapper}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="200"
                height="200"
                style={{ display: "block", background: "transparent" }}
            >
                <style>
                    {`
      .ripple {
        transform-origin: 50px 50px;
        animation: ripple-expand 0.8s ease-out infinite;
      }
      .delay {
        animation-delay: 0.5s;
      }
      @keyframes ripple-expand {
        0% { transform: scale(0.3); opacity: 1; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    `}
                </style>
                <g>
                    <circle className="ripple" strokeWidth="2" stroke="#ff00f9" fill="none" r="15" cy="50" cx="50" />
                    <circle
                        className="ripple delay"
                        strokeWidth="2"
                        stroke="#6e28ff"
                        fill="none"
                        r="15"
                        cy="50"
                        cx="50"
                    />
                </g>
            </svg>
            <p style={styles.loadingText}>Preparing the stage for something special...</p>
        </div>
    );
};

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
        width: "100%",
        fontSize: "1rem",
        textAlign: "center",
        width: "80%",
        zIndex: 100000,
    },
};

export default DrawingLoader;
