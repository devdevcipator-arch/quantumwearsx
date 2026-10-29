"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseRadius: number;
  speedY: number;
  swaySpeed: number;
  swayAmount: number;
  swayAngle: number;
  baseAlpha: number;
  currentAlpha: number;
  pulseSpeed: number;
  pulseAngle: number;
  color: {
    core: string;
    mid: string;
    outer: string;
  };
}

export default function BubbleLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Pure deep crimson, ruby, and brand red palettes (NO yellow, NO amber)
    const redPalettes = [
      // Vibrant Crimson
      {
        core: "rgba(255, 45, 50, ",
        mid: "rgba(220, 18, 26, ",
        outer: "rgba(160, 0, 12, 0)",
      },
      // Deep Ruby Red
      {
        core: "rgba(240, 30, 38, ",
        mid: "rgba(185, 10, 20, ",
        outer: "rgba(110, 0, 8, 0)",
      },
      // Brilliant Scarlet
      {
        core: "rgba(255, 60, 65, ",
        mid: "rgba(210, 15, 22, ",
        outer: "rgba(140, 0, 14, 0)",
      },
      // Muted Wine Red
      {
        core: "rgba(225, 35, 42, ",
        mid: "rgba(165, 10, 18, ",
        outer: "rgba(95, 0, 10, 0)",
      },
    ];

    const createParticle = (randomY = false): Particle => {
      const typeRand = Math.random();
      let baseRadius: number;
      let speedY: number;
      let baseAlpha: number;

      if (typeRand < 0.22) {
        // Soft background bokeh bubble
        baseRadius = 14 + Math.random() * 12;
        speedY = 0.35 + Math.random() * 0.3;
        baseAlpha = 0.16 + Math.random() * 0.12;
      } else if (typeRand < 0.72) {
        // Mid-sized floating red orb
        baseRadius = 5 + Math.random() * 6;
        speedY = 0.5 + Math.random() * 0.45;
        baseAlpha = 0.38 + Math.random() * 0.22;
      } else {
        // Delicate red ember
        baseRadius = 2.5 + Math.random() * 2.5;
        speedY = 0.65 + Math.random() * 0.5;
        baseAlpha = 0.6 + Math.random() * 0.25;
      }

      const color = redPalettes[Math.floor(Math.random() * redPalettes.length)];

      return {
        x: Math.random() * width,
        // If randomY, scatter vertically across the full height on first render;
        // Otherwise, spawn below the bottom edge.
        y: randomY ? Math.random() * height : height + 15 + Math.random() * 35,
        baseRadius,
        speedY,
        swaySpeed: 0.008 + Math.random() * 0.016,
        swayAmount: 0.3 + Math.random() * 0.6,
        swayAngle: Math.random() * Math.PI * 2,
        baseAlpha,
        currentAlpha: 0,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        pulseAngle: Math.random() * Math.PI * 2,
        color,
      };
    };

    // Uncrowded, sparse count (24 particles instead of 85)
    const particleCount = 24;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Additive screen blending for smooth luminous red glow
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move upward from bottom to top
        p.y -= p.speedY;
        p.swayAngle += p.swaySpeed;
        p.pulseAngle += p.pulseSpeed;
        p.x += Math.sin(p.swayAngle) * p.swayAmount;

        // Calculate smooth entry at bottom and graceful exit at top
        let verticalFade = 1;
        // Fade in as it emerges from the bottom
        if (p.y > height - 70) {
          verticalFade = Math.max(0, (height - p.y) / 70);
        }
        // Fade out as it reaches the top of the section
        else if (p.y < 80) {
          verticalFade = Math.max(0, p.y / 80);
        }

        const pulse = 0.85 + 0.15 * Math.sin(p.pulseAngle);
        p.currentAlpha = p.baseAlpha * verticalFade * pulse;

        // Draw particle if visible
        if (p.currentAlpha > 0.01 && p.y >= -40 && p.y <= height + 40) {
          const drawRadius = p.baseRadius * (0.92 + 0.1 * Math.sin(p.pulseAngle));

          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            drawRadius * 2.4
          );

          gradient.addColorStop(0, `${p.color.core}${p.currentAlpha})`);
          gradient.addColorStop(0.45, `${p.color.mid}${p.currentAlpha * 0.65})`);
          gradient.addColorStop(0.8, `${p.color.mid}${p.currentAlpha * 0.2})`);
          gradient.addColorStop(1, p.color.outer);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawRadius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Reset to bottom once it has traveled past the top of the section
        if (p.y < -35) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="cta-bubble-lights-container" aria-hidden="true">
      <div className="cta-lights-ambient-glow" />
      <canvas ref={canvasRef} className="cta-bubble-lights-canvas" />
    </div>
  );
}
