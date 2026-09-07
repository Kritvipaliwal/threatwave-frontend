import React, { useRef, useEffect, useState } from 'react';
import { RadarBlip } from '../../types';

interface ThreatRadarProps {
  blips: RadarBlip[];
  onSelectBlip?: (blip: RadarBlip) => void;
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({ blips, onSelectBlip }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBlip, setSelectedBlip] = useState<RadarBlip | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sweepAngle = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 300;
      canvas.height = canvas.parentElement?.offsetHeight || 260;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(cx, cy) - 24;

      // Draw concentric radar rings
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.18)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1.0].forEach(frac => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * frac, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.strokeStyle = 'rgba(30, 58, 102, 0.6)';
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // Center node: THREATWAVE AI
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('THREATWAVE AI', cx, cy - 12);

      // Rotating sweep beam
      sweepAngle += 0.025;
      if (sweepAngle > Math.PI * 2) sweepAngle = 0;

      const beamGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      beamGrad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
      beamGrad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sweepAngle - 0.4, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // Draw threat blips around radar
      blips.forEach(blip => {
        const radAngle = (blip.angle * Math.PI) / 180;
        const bx = cx + Math.cos(radAngle) * (maxR * blip.radius);
        const by = cy + Math.sin(radAngle) * (maxR * blip.radius);

        let diff = sweepAngle - radAngle;
        while (diff < 0) diff += Math.PI * 2;
        const isSwept = diff < 0.35;

        const color = blip.severity === 'CRITICAL' ? '#f43f5e' : (blip.severity === 'HIGH' ? '#f59e0b' : '#38bdf8');

        ctx.beginPath();
        ctx.arc(bx, by, isSwept ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isSwept ? 14 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '9px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(blip.name, bx, by + 12);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [blips]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR = Math.min(cx, cy) - 24;

    // Check hit
    for (const blip of blips) {
      const radAngle = (blip.angle * Math.PI) / 180;
      const bx = cx + Math.cos(radAngle) * (maxR * blip.radius);
      const by = cy + Math.sin(radAngle) * (maxR * blip.radius);
      const dist = Math.hypot(x - bx, y - by);
      if (dist <= 12) {
        setSelectedBlip(blip);
        if (onSelectBlip) onSelectBlip(blip);
        break;
      }
    }
  };

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center bg-radial from-[#0c1527] to-[#050811] rounded-xl overflow-hidden border border-[#1e3a66]/60">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair"
      />
      {selectedBlip && (
        <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-slate-900/90 border border-cyan-400/40 text-[11px] font-mono flex items-center justify-between z-10">
          <div>
            <span className="text-cyan-400 font-bold">{selectedBlip.name}</span>
            <span className="text-slate-400 ml-2">({selectedBlip.ip})</span>
          </div>
          <button
            onClick={() => setSelectedBlip(null)}
            className="text-slate-400 hover:text-white px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
