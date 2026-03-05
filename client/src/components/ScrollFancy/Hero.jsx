import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { IconButton, Fade } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

gsap.registerPlugin(ScrollTrigger);

const GsapScrubber = () => {
    const canvasRef = useRef(null);
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const wordsRef = useRef([]);
    const scrollTop = document.getElementById("are-you-ready");

    const words = ["Welcome", "To", "Rebeca", "", ""];
    const totalFrames = 120;
    const getFrameUrl = (index) => `/rebeca-pink-frames/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.webp`;

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const airpods = { frame: 0 };
        const images = [];

        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            img.src = getFrameUrl(i);
            images.push(img);
        }

        const render = () => {
            const img = images[airpods.frame];
            if (!img) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

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

        // Show button once the first image loads
        images[0].onload = () => {
            render();
        };

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=500%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        tl.to(
            airpods,
            {
                frame: totalFrames - 1,
                snap: "frame",
                ease: "none",
                onUpdate: render,
            },
            0,
        );

        words.forEach((_, i) => {
            const targetFrame = (i + 1) * 12;
            const startTime = targetFrame / totalFrames;

            tl.to(
                wordsRef.current[i],
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.05,
                    ease: "power2.out",
                },
                startTime - 0.05,
            );

            if (i !== 2) {
                tl.to(
                    wordsRef.current[i],
                    {
                        opacity: 0,
                        y: -40,
                        filter: "blur(20px)",
                        duration: 0.05,
                        ease: "power2.in",
                    },
                    startTime + 0.05,
                );
            }
        });

        window.addEventListener("resize", render);
        return () => {
            window.removeEventListener("resize", render);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} style={{ overflow: "hidden", backgroundColor: "#000" }}>
            <div
                ref={containerRef}
                style={{
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 0,
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
                            fontSize: "clamp(5rem, 12vw, 12rem)",
                            fontWeight: "900",
                            textTransform: "uppercase",
                            opacity: 0,
                            transform: "translateY(40px)",
                            filter: "blur(20px)",
                            pointerEvents: "none",
                            textAlign: "center",
                            fontFamily: "Sedgwick Ave Display, -apple-system, sans-serif",
                            textShadow: "0,0,10px #000"
                        }}
                    >
                        {word}
                    </h1>
                ))}

                <canvas ref={canvasRef} style={{ display: "block" }} />

                {/* --- THE SCROLL BUTTON --- */}

                <IconButton
                    onClick={() =>
                        window.scrollTo({
                            top: scrollTop.offsetTop,
                            behavior: "smooth",
                        })
                    }
                    sx={{
                        position: "absolute",
                        bottom: 40,
                        zIndex: 20,
                        color: "white",
                        border: "1.5px solid rgba(255, 255, 255, 0.53)",
                        animation: "bounce 2s infinite",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 0 10px #000",
                        bgcolor: "var(--accent2)"
                    }}
                >
                    <KeyboardArrowDownIcon fontSize="large" />
                </IconButton>

                <style>
                    {`
                        @keyframes bounce {
                            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                            40% { transform: translateY(-10px); }
                            60% { transform: translateY(-5px); }
                        }
                    `}
                </style>
            </div>
        </section>
    );
};

export default GsapScrubber;
