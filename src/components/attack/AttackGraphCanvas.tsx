import React, { useRef, useEffect, useState } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, Filter, Eye, ShieldAlert, Sparkles, 
  Terminal, Activity, Skull, Database, Server, Lock
} from 'lucide-react';

import { useDemoEngine } from '../../demo/useDemoEngine';

export interface GraphNodeData {
  id: string;
  name: string;
  stage: string;
  type: 'attacker' | 'recon' | 'portscan' | 'webserver' | 'sqli' | 'compromise' | 'privesc' | 'database' | 'exfil';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE' | 'CONTAINED' | 'STANDBY';
  x: number;
  y: number;
  ip?: string;
  details: string;
  eventsCount: number;
}

interface EdgeData {
  from: string;
  to: string;
  label?: string;
  status: 'ACTIVE' | 'CONTAINED';
}

interface AttackGraphCanvasProps {
  onInspectNode?: (node: GraphNodeData) => void;
}

export const AttackGraphCanvas: React.FC<AttackGraphCanvasProps> = ({ onInspectNode }) => {
  const { state } = useDemoEngine();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNodeData | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  // Defined 9 kill-chain topology nodes for demo mode
  const demoNodes: GraphNodeData[] = [
    { id: 'n-1', name: 'Attacker', stage: 'Adversary Node', type: 'attacker', severity: 'HIGH', status: 'ACTIVE', x: 100, y: 220, ip: '185.220.101.5', details: 'Tor Exit Node initiating multi-vector probe sequence.', eventsCount: 142 },
    { id: 'n-2', name: 'Reconnaissance', stage: 'Reconnaissance', type: 'recon', severity: 'LOW', status: 'ACTIVE', x: 230, y: 150, ip: '10.0.2.1', details: 'Public DNS queries and perimeter edge ping sweep.', eventsCount: 86 },
    { id: 'n-3', name: 'Port Scan', stage: 'Service Enumeration', type: 'portscan', severity: 'MEDIUM', status: 'ACTIVE', x: 230, y: 290, ip: '10.0.1.20', details: 'Aggressive TCP SYN sweep across ports 21-8080.', eventsCount: 54 },
    { id: 'n-4', name: 'Web Server', stage: 'Entry Point', type: 'webserver', severity: 'HIGH', status: 'ACTIVE', x: 400, y: 220, ip: '10.0.1.20 (DMZ-Nginx)', details: 'Reverse proxy receiving tainted HTTP parameters.', eventsCount: 96 },
    { id: 'n-5', name: 'SQL Injection', stage: 'Exploitation', type: 'sqli', severity: 'CRITICAL', status: 'ACTIVE', x: 550, y: 150, ip: '10.0.1.50', details: "Tainted parameter `' OR 1=1--` caught on auth endpoint.", eventsCount: 38 },
    { id: 'n-6', name: 'Account Compromise', stage: 'Initial Access', type: 'compromise', severity: 'HIGH', status: 'ACTIVE', x: 550, y: 290, ip: '10.0.1.15', details: 'Administrator JWT session token forged without MFA.', eventsCount: 19 },
    { id: 'n-7', name: 'Privilege Escalation', stage: 'Privilege Escalation', type: 'privesc', severity: 'CRITICAL', status: 'ACTIVE', x: 700, y: 150, ip: '10.0.1.50', details: 'Direct ALTER ROLE postgres grant executed.', eventsCount: 12 },
    { id: 'n-8', name: 'Database', stage: 'Credential Access', type: 'database', severity: 'CRITICAL', status: 'ACTIVE', x: 700, y: 290, ip: '10.0.1.50 (Prod-DB)', details: 'Sensitive table dump of customer credentials.', eventsCount: 42 },
    { id: 'n-9', name: 'Data Exfiltration', stage: 'Action on Objective', type: 'exfil', severity: 'CRITICAL', status: 'ACTIVE', x: 860, y: 220, ip: '194.26.29.112', details: '2.84 GB outbound TLS data transfer intercepted.', eventsCount: 28 }
  ];

  // Honest baseline monitoring topology for Live Mode when idle
  const liveIdleNodes: GraphNodeData[] = [
    { id: 'n-1', name: 'Edge Gateway', stage: 'Perimeter Boundary', type: 'attacker', severity: 'LOW', status: 'STANDBY', x: 120, y: 220, ip: '10.0.0.1', details: 'DMZ Edge Perimeter Gateway routing network frames.', eventsCount: 0 },
    { id: 'n-2', name: 'Passive SPAN Tap', stage: 'Telemetry Ingestion', type: 'recon', severity: 'LOW', status: 'ACTIVE', x: 360, y: 220, ip: 'Interface TAP', details: 'SIH26145 Unidirectional Passive Sniffer mirroring raw packets.', eventsCount: 0 },
    { id: 'n-3', name: 'ThreatWave AI', stage: 'Multi-Engine Detection', type: 'webserver', severity: 'LOW', status: 'ACTIVE', x: 600, y: 220, ip: 'threatwave_rf.joblib', details: 'Continuous feature extraction & heuristic/ML classification.', eventsCount: 0 },
    { id: 'n-4', name: 'Target Host', stage: 'Protected Asset', type: 'database', severity: 'LOW', status: 'STANDBY', x: 840, y: 220, ip: 'Controlled Target', details: 'Authorized lab target server under active passive defense.', eventsCount: 0 }
  ];

  const initialNodes = state.liveLabMode && !state.activeSimulation.isSimulating ? liveIdleNodes : demoNodes;

  const edges: EdgeData[] = state.liveLabMode && !state.activeSimulation.isSimulating ? [
    { from: 'n-1', to: 'n-2', status: 'ACTIVE' },
    { from: 'n-2', to: 'n-3', status: 'ACTIVE' },
    { from: 'n-3', to: 'n-4', status: 'ACTIVE' }
  ] : [
    { from: 'n-1', to: 'n-2', status: 'ACTIVE' },
    { from: 'n-1', to: 'n-3', status: 'ACTIVE' },
    { from: 'n-2', to: 'n-4', status: 'ACTIVE' },
    { from: 'n-3', to: 'n-4', status: 'ACTIVE' },
    { from: 'n-4', to: 'n-5', status: 'ACTIVE' },
    { from: 'n-4', to: 'n-6', status: 'ACTIVE' },
    { from: 'n-5', to: 'n-7', status: 'ACTIVE' },
    { from: 'n-6', to: 'n-8', status: 'ACTIVE' },
    { from: 'n-7', to: 'n-8', status: 'ACTIVE' },
    { from: 'n-8', to: 'n-9', status: 'ACTIVE' }
  ];

  // Animation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let packetStep = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 960;
      canvas.height = canvas.parentElement?.offsetHeight || 500;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      packetStep += 0.015;

      ctx.save();
      // Apply pan & zoom
      ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Background grid
      ctx.strokeStyle = 'rgba(30, 58, 102, 0.25)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = -200; x < canvas.width + 200; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, -200);
        ctx.lineTo(x, canvas.height + 200);
        ctx.stroke();
      }
      for (let y = -200; y < canvas.height + 200; y += step) {
        ctx.beginPath();
        ctx.moveTo(-200, y);
        ctx.lineTo(canvas.width + 200, y);
        ctx.stroke();
      }

      // Draw Edges
      edges.forEach((edge, idx) => {
        const fromNode = initialNodes.find(n => n.id === edge.from);
        const toNode = initialNodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        // Dim if filtered out
        const isDimmed = stageFilter !== 'ALL' && fromNode.stage !== stageFilter && toNode.stage !== stageFilter;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = isDimmed ? 'rgba(30, 58, 102, 0.2)' : 'rgba(0, 242, 254, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (!isDimmed) {
          // Traveling packet particle
          const p = (packetStep + idx * 0.15) % 1.0;
          const px = fromNode.x + (toNode.x - fromNode.x) * p;
          const py = fromNode.y + (toNode.y - fromNode.y) * p;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#00f2fe';
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw Nodes
      initialNodes.forEach(node => {
        const isDimmed = stageFilter !== 'ALL' && node.stage !== stageFilter;
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isCritical = node.severity === 'CRITICAL';

        // Outer glow
        ctx.save();
        if (isCritical) {
          ctx.shadowColor = 'rgba(244, 63, 94, 0.8)';
          ctx.shadowBlur = isSelected ? 24 : 14;
        } else {
          ctx.shadowColor = 'rgba(0, 242, 254, 0.6)';
          ctx.shadowBlur = isSelected ? 20 : 10;
        }

        // Node Circle
        ctx.beginPath();
        const r = isSelected ? 22 : 18;
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed 
          ? 'rgba(10, 20, 40, 0.4)'
          : isCritical 
            ? 'rgba(244, 63, 94, 0.25)' 
            : 'rgba(0, 242, 254, 0.2)';
        ctx.fill();

        ctx.strokeStyle = isDimmed 
          ? 'rgba(30, 58, 102, 0.4)'
          : isCritical 
            ? '#f43f5e' 
            : '#00f2fe';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();
        ctx.restore();

        // Node Center Dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = isCritical ? '#f43f5e' : '#00f2fe';
        ctx.fill();

        // Node Label
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = isDimmed ? 'rgba(148, 163, 184, 0.3)' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + r + 14);

        // Stage subtext
        ctx.font = '9px monospace';
        ctx.fillStyle = isDimmed ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 242, 254, 0.8)';
        ctx.fillText(node.stage, node.x, node.y + r + 26);
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [zoom, pan, selectedNode, hoveredNode, stageFilter]);

  // Click & Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Transform mouse into canvas coordinates
    const worldX = (mouseX - (canvas.width / 2 + pan.x)) / zoom + canvas.width / 2;
    const worldY = (mouseY - (canvas.height / 2 + pan.y)) / zoom + canvas.height / 2;

    const hit = initialNodes.find(n => {
      const dx = n.x - worldX;
      const dy = n.y - worldY;
      return Math.sqrt(dx * dx + dy * dy) <= 24;
    });

    setHoveredNode(hit || null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - (canvas.width / 2 + pan.x)) / zoom + canvas.width / 2;
    const worldY = (mouseY - (canvas.height / 2 + pan.y)) / zoom + canvas.height / 2;

    const hit = initialNodes.find(n => {
      const dx = n.x - worldX;
      const dy = n.y - worldY;
      return Math.sqrt(dx * dx + dy * dy) <= 24;
    });

    if (hit) {
      setSelectedNode(hit);
      if (onInspectNode) onInspectNode(hit);
    } else {
      setSelectedNode(null);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const stagesList = ['ALL', 'Reconnaissance', 'Service Enumeration', 'Exploitation', 'Credential Access', 'Action on Objective'];

  return (
    <div className="space-y-4 font-mono">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-[#1e3a66]">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Filter Stage:</span>
          <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
            {stagesList.map(st => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={`px-2 py-1 rounded border transition-all cursor-pointer ${
                  stageFilter === st
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.15))}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.15))}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-[10px]"
            title="Reset position"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[520px] rounded-2xl bg-[#080d1a] border border-cyan-500/30 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            9-NODE ATTACK TOPOLOGY
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800">
            DRAG TO PAN • SCROLL TO INSPECT
          </span>
        </div>

        {/* Node Hover Card */}
        {hoveredNode && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-950/95 border border-cyan-400 shadow-2xl text-[10px] space-y-1 w-60"
            style={{
              left: Math.min(hoveredNode.x + 30, 680),
              top: Math.min(hoveredNode.y - 20, 360)
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="font-extrabold text-white text-xs">{hoveredNode.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                hoveredNode.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                {hoveredNode.severity}
              </span>
            </div>
            <div className="text-slate-300 font-sans text-[11px]">
              {hoveredNode.details}
            </div>
            <div className="pt-1 text-[9px] text-cyan-400 flex items-center justify-between">
              <span>IP: {hoveredNode.ip}</span>
              <span>{hoveredNode.eventsCount} Events</span>
            </div>
          </div>
        )}

        {/* Node Selected Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full p-4 rounded-xl bg-[#091224]/95 border border-cyan-400 shadow-2xl space-y-3 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{selectedNode.name}</span>
                <span className="text-[10px] text-cyan-400 font-bold">({selectedNode.stage})</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              {selectedNode.details}
            </p>

            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Asset / Host:</span>
                <span className="text-white font-bold">{selectedNode.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Incident Velocity:</span>
                <span className="text-rose-400 font-bold">{selectedNode.eventsCount} Correlated Events</span>
              </div>
            </div>

            {onInspectNode && (
              <button
                onClick={() => onInspectNode(selectedNode)}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Node Evidence in Forensic Panel</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttackGraphCanvas;
