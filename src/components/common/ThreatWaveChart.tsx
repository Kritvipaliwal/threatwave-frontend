import React, { useRef, useEffect } from 'react';

export const ThreatWaveChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 700;
      canvas.height = canvas.parentElement?.offsetHeight || 260;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial random wave nodes
    const numPoints = 28;
    const points: number[] = [];
    for (let i = 0; i < numPoints; i++) {
      points.push(0.3 + Math.random() * 0.45);
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      offset += 0.025;

      // Draw subtle background scanning grid
      ctx.strokeStyle = 'rgba(30, 58, 102, 0.35)';
      ctx.lineWidth = 1;
      const stepX = width / 12;
      const stepY = height / 5;
      for (let x = 0; x < width; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Fill area under wave
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.3)');
      grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.1)');
      grad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 10) {
        const i = Math.floor((x / width) * (points.length - 1));
        const nextI = Math.min(i + 1, points.length - 1);
        const frac = (x / width) * (points.length - 1) - i;
        const base = points[i] * (1 - frac) + points[nextI] * frac;
        const y = height - (base * height * 0.65 + Math.sin(x * 0.02 + offset) * 18 + 25);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Top glowing line
      ctx.beginPath();
      for (let x = 0; x <= width; x += 10) {
        const i = Math.floor((x / width) * (points.length - 1));
        const nextI = Math.min(i + 1, points.length - 1);
        const frac = (x / width) * (points.length - 1) - i;
        const base = points[i] * (1 - frac) + points[nextI] * frac;
        const y = height - (base * height * 0.65 + Math.sin(x * 0.02 + offset) * 18 + 25);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scanning vertical beam
      const scanX = ((offset * 40) % (width + 60)) - 30;
      const scanGrad = ctx.createLinearGradient(scanX - 20, 0, scanX + 20, 0);
      scanGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
      scanGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.25)');
      scanGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 20, 0, 40, height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full h-[260px] bg-[#0c1527] rounded-xl overflow-hidden border border-[#1e3a66]/60">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Time window badges */}
      <div className="absolute top-3 right-3 flex items-center gap-2 text-[10px] font-mono z-10">
        <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          ROLLING 15-MIN WINDOW
        </span>
      </div>
    </div>
  );
};
