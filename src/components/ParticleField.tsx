import React, { useEffect, useRef } from 'react';
type ParticleFieldProps = {
  className?: string;
  dark?: boolean;
};
export function ParticleField({
  className = '',
  dark = false
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animation = 0;
    let pointer = {
      x: -1000,
      y: -1000
    };
    const particles = Array.from(
      {
        length: 58
      },
      (_, index) => ({
        x: Math.random(),
        y: 0.38 + Math.random() * 0.62,
        r: 1.2 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.00014,
        vy: (Math.random() - 0.5) * 0.00012,
        phase: index * 0.7
      })
    );
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
      );
    };
    const draw = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0.25 || particle.y > 1) particle.vy *= -1;
        const px = particle.x * width;
        const py = particle.y * height;
        const distance = Math.hypot(px - pointer.x, py - pointer.y);
        const glow = Math.max(0, 1 - distance / 200);
        const alpha =
        0.35 + Math.sin(time / 700 + particle.phase) * 0.2 + glow * 0.3;
        ctx.beginPath();
        ctx.fillStyle = dark ?
        `rgba(83, 255, 209, ${alpha})` :
        `rgba(0, 157, 131, ${alpha})`;
        ctx.shadowBlur = 8 + glow * 13;
        ctx.shadowColor = dark ? '#56fbd0' : '#00ba97';
        ctx.arc(
          px + glow * 9,
          py - glow * 7,
          particle.r + glow * 1.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      animation = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', move);
    animation = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', move);
    };
  }, [dark]);
  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true" />);


}