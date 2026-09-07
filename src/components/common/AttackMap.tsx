import React, { useRef, useEffect } from 'react';
import { AttackArc } from '../../types';

interface AttackMapProps {
  arcs: AttackArc[];
  onSelectArc?: (arc: AttackArc) => void;
}

export const AttackMap: React.FC<AttackMapProps> = ({ arcs, onSelectArc }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 800;
      canvas.height = canvas.parentElement?.offsetHeight || 320;
    };
    resize();
    window.addEventListener('resize', resize);

    // Map lat/lon to canvas x/y
    const project = (lat: number, lon: number, w: number, h: number) => {
      const x = ((lon + 180) / 360) * w;
      const y = ((90 - lat) / 180) * h;
      return { x, y };
    };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw world matrix dot grid
      ctx.fillStyle = 'rgba(30, 58, 102, 0.45)';
      const stepX = 26;
      const stepY = 20;
      for (let x = 12; x < width; x += stepX) {
        for (let y = 10; y < height; y += stepY) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw attack trajectories
      arcs.forEach(arc => {
        const s = project(arc.sourceCoords[0], arc.sourceCoords[1], width, height);
        const t = project(arc.targetCoords[0], arc.targetCoords[1], width, height);

        // Control point for arc height
        const midX = (s.x + t.x) / 2;
        const midY = Math.min(s.y, t.y) - 45;

        // Draw curved path
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(midX, midY, t.x, t.y);
        ctx.strokeStyle = arc.severity === 'CRITICAL' ? 'rgba(244, 63, 94, 0.45)' : 'rgba(245, 158, 11, 0.45)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Source node
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();

        // Target node
        ctx.beginPath();
        ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2fe';
        ctx.fill();

        // Target label
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(arc.targetCity, t.x, t.y + 12);

        // Progress projectile
        arc.progress = (arc.progress + 0.007) % 1.0;
        const p = arc.progress;
        const px = (1 - p) * (1 - p) * s.x + 2 * (1 - p) * p * midX + p * p * t.x;
        const py = (1 - p) * (1 - p) * s.y + 2 * (1 - p) * p * midY + p * p * t.y;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = arc.severity === 'CRITICAL' ? '#f43f5e' : '#00f2fe';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [arcs]);

  return (
    <div className="relative w-full h-[320px] bg-[#070c18] rounded-xl overflow-hidden border border-[#1e3a66]/60">
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-[#0c1527]/90 border border-[#1e3a66]/70 text-[10px] font-mono text-slate-300 flex items-center gap-4 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          <span>Attacker Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          <span>Enterprise Target</span>
        </div>
        <span className="text-slate-500">|</span>
        <span className="text-amber-400">SIMULATED TELEMETRY</span>
      </div>
    </div>
  );
};
