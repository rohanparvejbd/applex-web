"use client";
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

const InteractiveWave = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Configuration for 3 distinct, beautiful wave layers
        // Colors are based on Applex brand (blues and purples)
        const waves = [
            { yOffset: 0.45, length: 0.003, amplitude: 45, speed: 0.015, color: 'rgba(37, 99, 235, 0.12)' },   // Base blue
        ];

        let time = 0;
        // Start mouse off-screen
        let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 }; 
        let targetMouse = { x: -1000, y: -1000 };
        let canvasW, canvasH;
        let bounds;
        
        // Fluid smooth state for scroll sloshing
        let currentSmoothedScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        let currentDisplacement = 0;
        let ripples = [];

        const resize = () => {
            const parent = canvas.parentElement;
            // High-DPI display support for crisp rendering
            const dpr = window.devicePixelRatio || 1;
            canvasW = parent.offsetWidth;
            canvasH = parent.offsetHeight || 450;
            
            canvas.width = canvasW * dpr;
            canvas.height = canvasH * dpr;
            ctx.scale(dpr, dpr);
            
            bounds = canvas.getBoundingClientRect();
        };

        window.addEventListener('resize', resize);
        
        // Use ResizeObserver as a fallback to detect container size changes
        const observer = new ResizeObserver(resize);
        if (canvas.parentElement) {
            observer.observe(canvas.parentElement);
        }

        // Global mouse tracking so it works even when hovering over links with z-index
        const onMouseMove = (e) => {
            if (!bounds) return;
            targetMouse.x = e.clientX - bounds.left;
            targetMouse.y = e.clientY - bounds.top;
        };

        const onMouseLeave = () => {
            targetMouse.x = -1000;
            targetMouse.y = -1000;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseout', onMouseLeave); // when mouse leaves the browser window
        const onScroll = () => { 
            bounds = canvas.getBoundingClientRect(); 
        };
        window.addEventListener('scroll', onScroll);

        const onClick = (e) => {
            if (!bounds) return;
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;
            
            // Create a ripple if click is roughly in or near the footer area
            if (y > -400 && y < canvasH + 200) {
                ripples.push({ x, time: 0, strength: 150 });
            }
        };
        window.addEventListener('click', onClick);

        resize();

        // Render loop
        const draw = () => {
            ctx.clearRect(0, 0, canvasW, canvasH);
            
            // Smoothly interpolate mouse position for fluid interaction
            mouse.x += (targetMouse.x - mouse.x) * 0.1;
            mouse.y += (targetMouse.y - mouse.y) * 0.1;
            
            // --- Smooth Fluid Sloshing for Scroll ---
            const targetScrollY = window.scrollY;
            
            // 1. Calculate how far behind the smoothed scroll is from the actual scroll
            const deltaY = targetScrollY - currentSmoothedScrollY;
            
            // 2. Smoothed scroll slowly catches up
            currentSmoothedScrollY += deltaY * 0.05;
            
            // 3. Map this delta to a target displacement using tanh for a buttery smooth curve that naturally caps at ~100px
            const targetDisplacement = Math.tanh(deltaY * 0.005) * 100;
            
            // 4. The actual water displacement smoothly chases the target displacement to prevent ANY instantaneous jumps
            currentDisplacement += (targetDisplacement - currentDisplacement) * 0.15;
            // ------------------------------------------------

            // Update ripple states once per frame
            ripples.forEach(r => r.time += 1.2);
            ripples = ripples.filter(r => r.time < 150);
            
            waves.forEach((wave, index) => {
                // Parallax the scroll effect per layer (front layer moves more)
                const scrollEffect = currentDisplacement * (0.8 + index * 0.35);
                // Apply displacement
                const waveBaseY = canvasH * wave.yOffset - scrollEffect;
                
                ctx.beginPath();
                ctx.moveTo(0, canvasH);
                ctx.lineTo(0, waveBaseY);
                
                // Draw wave path
                for (let x = 0; x <= canvasW; x += 4) {
                    // Primary sine wave
                    let waveY = Math.sin(x * wave.length + time * wave.speed) * wave.amplitude;
                    // Secondary organic modifier
                    waveY += Math.sin(x * (wave.length * 2.1) - time * (wave.speed * 1.3)) * (wave.amplitude * 0.3);

                    // 1. Physics-based Mouse Interaction (Repel effect)
                    const dx = x - mouse.x;
                    const pointY = waveBaseY + waveY;
                    const dy = mouse.y - pointY;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    const influenceRadius = 220; // Increased radius for more interaction
                    
                    if (dist < influenceRadius) {
                        const force = (influenceRadius - dist) / influenceRadius;
                        // Smooth easing out (cubic)
                        const easeForce = force * force * (3 - 2 * force); 
                        
                        // Push away direction (up or down)
                        const pushDirection = dy > 0 ? -1 : 1;
                        const pushStrength = 90; // Increased displacement
                        
                        waveY += easeForce * pushStrength * pushDirection; 
                    }

                    // 2. Ripple Interaction (from clicks)
                    let rippleEffect = 0;
                    ripples.forEach(ripple => {
                        const rDist = Math.abs(x - ripple.x);
                        const radius = ripple.time * 8; // Speed of ripple expanding
                        const ringDist = Math.abs(rDist - radius);
                        
                        if (ringDist < 120) {
                            const decay = Math.max(0, 1 - ripple.time / 150);
                            // Bell curve envelope for the ring
                            const envelope = Math.exp(-(ringDist * ringDist) / 1000);
                            // Sine wave for the actual ripple crests
                            rippleEffect += envelope * decay * ripple.strength * Math.cos(ringDist * 0.08);
                        }
                    });
                    
                    // Different layers react to ripples slightly differently for parallax depth
                    waveY += rippleEffect * (0.6 + index * 0.2);

                    ctx.lineTo(x, waveBaseY + waveY);
                }
                
                ctx.lineTo(canvasW, canvasH);
                ctx.closePath();
                
                ctx.fillStyle = wave.color;
                ctx.fill();
            });
            
            time++;
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseout', onMouseLeave);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('click', onClick);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <canvas
                ref={canvasRef}
                className="absolute bottom-0 left-0 w-full h-[350px] md:h-[450px]"
            />
            {/* Floating Logo naturally bobbing over the waves */}
            <div className="absolute bottom-[205px] md:bottom-[255px] left-[50%] md:left-[55%] z-10 animate-wave-ride transform -translate-x-1/2">
                <Image
                    src="/Applex Logo.png"
                    alt="Applex Logo watermark"
                    width={280}
                    height={280}
                    className="w-48 md:w-72 h-auto object-contain opacity-[0.15] drop-shadow-md"
                    unoptimized
                />
            </div>
            
            <style jsx>{`
                @keyframes waveRide {
                    0% { transform: translate(-50%, 20px) rotate(-3deg); }
                    25% { transform: translate(-50%, -10px) rotate(1deg); }
                    50% { transform: translate(-50%, 15px) rotate(-1deg); }
                    75% { transform: translate(-50%, -15px) rotate(2deg); }
                    100% { transform: translate(-50%, 20px) rotate(-3deg); }
                }
                .animate-wave-ride {
                    animation: waveRide 18s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default InteractiveWave;
