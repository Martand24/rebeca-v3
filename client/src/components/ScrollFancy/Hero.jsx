import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAuth } from "../../AuthContext";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);

const GsapScrubber = () => {
    const canvasRef = useRef(null);
    const sectionRef = useRef(null);
    const wordsRef = useRef([]);
    const { preloadedImages } = useAuth(); // Images are already Image objects from Loader

    const words = ["Welcome", "To", "Rebeca"];
    const totalFrames = 120;

    useEffect(() => {
        // 1. Guard clause: Wait until images exist in context
        if (!preloadedImages || preloadedImages.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const scrubberState = { frame: 0 };

        // 2. Optimized Render Function
        const render = () => {
            const img = preloadedImages[Math.round(scrubberState.frame)];
            if (!img) return;

            const imgRatio = img.width / img.height;
            const canvasRatio = canvas.width / canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imgRatio;
                drawHeight = canvas.height;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // 3. Handle Resizing Separately (Not in render loop)
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        // Initial setup
        handleResize();
        window.addEventListener("resize", handleResize);

        // 4. GSAP Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=600%",
                scrub: true, // Slightly lower scrub for smoother follow
                pin: true,
                anticipatePin: 1,
            },
        });

        // Image Sequence Animation
        tl.to(
            scrubberState,
            {
                frame: preloadedImages.length - 1,
                snap: "frame",
                ease: "none",
                onUpdate: render,
            },
            0,
        );

        // Text Animations
        const wordConfigs = [
            { start: 0, end: 0.10 }, // "Welcome" - Quick in and out
            { start: 0.1, end: 0.2 }, // "To" - Quick in and out
            { start: 0.3, end: 1.5 }, // "Rebeca" - Starts later, stays until the end
        ];
        words.forEach((_, i) => {
            const config = wordConfigs[i];
            if (!config) return;

            // ANIMATE IN
            tl.to(
                wordsRef.current[i],
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.1, // Controls speed of fade-in
                    ease: "power2.out",
                },
                config.start,
            );

            // ANIMATE OUT (Skip for the last word)
            if (i !== words.length - 1) {
                tl.to(
                    wordsRef.current[i],
                    {
                        opacity: 0,
                        y: -40,
                        filter: "blur(20px)",
                        duration: 0.1, // Controls speed of fade-out
                        ease: "power2.in",
                    },
                    config.end,
                );
            }
        });
        return () => {
            window.removeEventListener("resize", handleResize);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, [preloadedImages]); // Re-run once images arrive from AuthContext

    return (
        <section ref={sectionRef} style={{ overflow: "hidden", backgroundColor: "#000" }}>
            <div
                style={{
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {words.map((word, index) => (
                    <h1
                        key={index}
                        ref={(el) => (wordsRef.current[index] = el)}
                        style={{
                            position: "absolute",
                            zIndex: 10,
                            color: "white",
                            fontSize: "clamp(4rem, 10vw, 10rem)",
                            fontWeight: "900",
                            textTransform: "uppercase",
                            opacity: 0,
                            transform: "translateY(40px)",
                            filter: "blur(20px)",
                            pointerEvents: "none",
                            textAlign: "center",
                            fontFamily: "Sedgwick Ave Display, sans-serif",
                        }}
                    >
                        {word}
                    </h1>
                ))}

                <canvas ref={canvasRef} style={{ display: "block", position: "absolute", top: 0, left: 0 }} />

                <IconButton
                    onClick={() => {
                        gsap.to(window, {
                            duration: 7, // SET YOUR SPEED HERE (in seconds)
                            scrollTo: {
                                y: "#are-you-ready",
                                autoKill: true, // Allows user to interrupt the scroll by manual scrolling
                            },
                            // ease: "power2.inOut", // Makes the start/end feel smoother
                        });
                    }}
                    sx={{
                        position: "absolute",

                        bottom: 40,

                        zIndex: 20,

                        color: "white",

                        border: "1.5px solid rgba(255, 255, 255, 0.5)",

                        animation: "bounce 2s infinite",

                        backdropFilter: "blur(10px)",
                    }}
                >
                    <KeyboardArrowDownIcon fontSize="large" />
                </IconButton>
            </div>
        </section>
    );
};

export default GsapScrubber;
