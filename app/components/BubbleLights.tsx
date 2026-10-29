"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  speedY: number;
  swaySpeed: number;
  swayAmount: number;
  swayAngle: number;
  baseAlpha: number;
  currentAlpha: number;
  pulseSpeed: number;
  pulseAngle: number;
  depth: 0 | 1 | 2; // 0: bokeh large, 1: mid orb, 2: sharp ember
  color: {
    core: string;
    mid: string;
    outer: string;
  };
  lifespan: number;
  maxLifespan: number;
}

export default function BubbleLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Particle color palettes inspired by incandescent embers and bubble lights
    const palettes = [
      // Golden Amber
      {
        core: "rgba(255, 245, 210, ",
        mid: "rgba(255, 170, 45, ",
        outer: "rgba(255, 75, 15, 0)",
      },
      // Fiery Orange-Red
      {
        core: "rgba(255, 220, 180, ",
        mid: "rgba(255, 100, 20, ",
        outer: "rgba(220, 30, 10, 0)",
      },
      // Brilliant Neon Amber
      {
        core: "rgba(255, 255, 230, ",
        mid: "rgba(255, 140, 30, ",
        outer: "rgba(255, 40, 10, 0)",
      },
      // Deep Crimson Glow
      {
        core: "rgba(255, 190, 160, ",
        mid: "rgba(240, 50, 20, ",
        outer: "rgba(180, 15, 5, 0)",
      },
    ];

    const createParticle = (initialRandomY = false): Particle => {
      const depthRand = Math.random();
      let depth: 0 | 1 | 2;
      let baseRadius: number;
      let speedY: number;
      let baseAlpha: number;

      if (depthRand < 0.25) {
        // Large bokeh bubble (background)
        depth = 0;
        baseRadius = 12 + Math.random() * 14;
        speedY = 0.2 + Math.random() * 0.25;
        baseAlpha = 0.22 + Math.random() * 0.2;
      } else if (depthRand < 0.65) {
        // Medium glowing orb (midground)
        depth = 1;
        baseRadius = 5 + Math.random() * 6;
        speedY = 0.35 + Math.random() * 0.4;
        baseAlpha = 0.5 + Math.random() * 0.3;
      } else {
        // Sharp sparkling ember (foreground)
        depth = 2;
        baseRadius = 1.8 + Math.random() * 2.5;
        speedY = 0.55 + Math.random() * 0.55;
        baseAlpha = 0.8 + Math.random() * 0.2;
      }

      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      const maxLifespan = height * (0.65 + Math.random() * 0.4);

      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + Math.random() * 30,
        radius: baseRadius,
        baseRadius,
        speedY,
        swaySpeed: 0.012 + Math.random() * 0.025,
        swayAmount: 0.4 + Math.random() * 0.8,
        swayAngle: Math.random() * Math.PI * 2,
        baseAlpha,
        currentAlpha: 0,
        pulseSpeed: 0.02 + Math.random() * 0.035,
        pulseAngle: Math.random() * Math.PI * 2,
        depth,
        color: palette,
        lifespan: initialRandomY ? Math.random() * maxLifespan : 0,
        maxLifespan,
      };
    };

    // Instantiate particles across the bottom
    const particleCount = 85;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    // Optional mouse repulsion / interaction
    let mouseX = -9999;
    let mouseY = -9999;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Additive blending for luminous glowing bokeh lights
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion update
        p.lifespan += p.speedY;
        p.y -= p.speedY;
        p.swayAngle += p.swaySpeed;
        p.pulseAngle += p.pulseSpeed;

        p.x += Math.sin(p.swayAngle) * p.swayAmount;

        // Subtle gentle drift away from cursor if nearby
        if (mouseX > 0 && mouseY > 0) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const force = (1 - dist / 90) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Calculate smooth alpha fade in/out
        const progress = Math.min(p.lifespan / p.maxLifespan, 1);
        let fadeFactor = 1;

        // Fade in rapidly at bottom
        if (progress < 0.15) {
          fadeFactor = progress / 0.15;
        }
        // Fade out gracefully at top
        else if (progress > 0.6) {
          fadeFactor = 1 - (progress - 0.6) / 0.4;
        }

        const pulseFactor = 0.8 + 0.2 * Math.sin(p.pulseAngle);
        p.currentAlpha = p.baseAlpha * fadeFactor * pulseFactor;

        // Draw particle if visible
        if (p.currentAlpha > 0.01 && p.y >= -30 && p.y <= height + 30) {
          const drawRadius = p.baseRadius * (0.9 + 0.15 * Math.sin(p.pulseAngle));

          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            drawRadius * 2.8
          );

          gradient.addColorStop(0, `${p.color.core}${p.currentAlpha})`);
          gradient.addColorStop(0.35, `${p.color.mid}${p.currentAlpha * 0.75})`);
          gradient.addColorStop(0.7, `${p.color.mid}${p.currentAlpha * 0.25})`);
          gradient.addColorStop(1, p.color.outer);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawRadius * 2.8, 0, Math.PI * 2);
          ctx.fill();

          // Extra bright center core for foreground embers
          if (p.depth === 2 && p.currentAlpha > 0.3) {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.currentAlpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, drawRadius * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Reset if reached max height or offscreen
        if (progress >= 1 || p.y < -30) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="cta-bubble-lights-container" aria-hidden="true">
      {/* Radiant baseline ambient orange-red glow */}
      <div className="cta-lights-ambient-glow" />
      <canvas ref={canvasRef} className="cta-bubble-lights-canvas" />
    </div>
  );
}
