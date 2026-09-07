import React, { useRef, useEffect, useState } from 'react';
import { GitFork, ShieldAlert, X, Activity, Server, Database, Eye } from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';

interface GraphNode {
  id: string;
  name: string;
  type: 'attacker' | 'gateway' | 'web' | 'database' | 'incident';
  status: 'ACTIVE' | 'CONTAINED';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  eventCount: number;
  ip?: string;
  details: string;
}

export const ThreatGraph: React.FC = () => {
  const { state } = useDemoEngine();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 800;
      canvas.height = canvas.parentElement?.offsetHeight || 560;
    };
    resize();
    window.addEventListener('resize', resize);

    const w = canvas.width;
    const h = canvas.height;

    // Defined topology nodes
    const nodes: GraphNode[] = [
      { id: '1', name: '185.220.101.5', type: 'attacker', status: 'ACTIVE', x: w * 0.15, y: h * 0.35, vx: 0, vy: 0, radius: 18, eventCount: 142, ip: '185.220.101.5', details: 'Tor Exit Node identified conducting automated SQL injection attacks.' },
      { id: '2', name: '45.154.255.88', type: 'attacker', status: 'ACTIVE', x: w * 0.15, y: h * 0.65, vx: 0, vy: 0, radius: 16, eventCount: 88, ip: '45.154.255.88', details: 'HostKey B.V. botnet IP executing high-rate SSH brute force attempts.' },
      { id: '3', name: 'Edge-Gateway-01', type: 'gateway', status: 'ACTIVE', x: w * 0.38, y: h * 0.50, vx: 0, vy: 0, radius: 16, eventCount: 230, ip: '10.0.2.1', details: 'VyOS Edge Perimeter Firewall inspecting all ingress TCP/UDP handshakes.' },
      { id: '4', name: 'DMZ-Nginx-01', type: 'web', status: 'ACTIVE', x: w * 0.60, y: h * 0.35, vx: 0, vy: 0, radius: 17, eventCount: 96, ip: '10.0.1.20', details: 'Public Reverse Proxy receiving intercepted tainted HTTP requests.' },
      { id: '5', name: 'Auth-LDAP-01', type: 'web', status: 'ACTIVE', x: w * 0.60, y: h * 0.65, vx: 0, vy: 0, radius: 16, eventCount: 64, ip: '10.0.1.15', details: 'Identity authentication service receiving credential stuffing probes.' },
      { id: '6', name: 'Prod-DB-01', type: 'database', status: 'ACTIVE', x: w * 0.85, y: h * 0.35, vx: 0, vy: 0, radius: 20, eventCount: 42, ip: '10.0.1.50', details: 'Core PostgreSQL Database containing confidential enterprise customer accounts.' },
      { id: '7', name: 'INC-2048', type: 'incident', status: 'ACTIVE', x: w * 0.85, y: h * 0.65, vx: 0, vy: 0, radius: 18, eventCount: 19, ip: 'N/A', details: 'Active Critical Incident Ticket correlating SQL injection and database exfiltration.' }
    ];

    const edges = [
      { from: '1', to: '3' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '3', to: '5' },
      { from: '4', to: '6' },
      { from: '6', to: '7' }
    ];

    let packetStep = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      packetStep += 0.015;

      // Draw Edges with animated pulsing data packets
      edges.forEach((edge, idx) => {
        const fromNode = nodes.find(n => n.id === edge.from)!;
        const toNode = nodes.find(n => n.id === edge.to)!;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = 'rgba(30, 58, 102, 0.65)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Traveling packet particle
        const p = (packetStep + idx * 0.25) % 1.0;
        const px = fromNode.x + (toNode.x - fromNode.x) * p;
        const py = fromNode.y + (toNode.y - fromNode.y) * p;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      nodes.forEach(node => {
        const isAttacker = node.type === 'attacker';
        const isIncident = node.type === 'incident';
        const isDb = node.type === 'database';

        const color = isAttacker ? '#f43f5e' : (isIncident ? '#a855f7' : (isDb ? '#00f2fe' : '#38bdf8'));

        // Outer pulse ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = `${color}44`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = selectedNode?.id === node.id ? 20 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label text
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + node.radius + 14);

        ctx.font = '8px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${node.eventCount} ev`, node.x, node.y + node.radius + 24);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    // Click handler for node inspection
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let clicked: GraphNode | null = null;
      for (const n of nodes) {
        const dist = Math.hypot(n.x - x, n.y - y);
        if (dist <= n.radius + 6) {
          clicked = n;
          break;
        }
      }
      setSelectedNode(clicked);
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [selectedNode]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1">
              <GitFork className="w-3 h-3" /> NETWORK TOPOLOGY
            </span>
            <span>•</span>
            <span className="text-rose-400 font-bold">ATTACK VECTOR CORRELATION</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Threat Graph & Attack Surface Topology
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Interactive graph visualizing relationships between external adversaries, perimeter firewalls, and target database assets.
          </p>
        </div>
      </div>

      {/* Main Canvas & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas Container */}
        <div className="lg:col-span-8 relative h-[560px] bg-[#070c18] rounded-2xl border border-[#1e3a66] overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />

          {/* Canvas Overlay Legend */}
          <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-[#0c1527]/90 border border-[#1e3a66]/70 text-[10px] font-mono text-slate-300 flex flex-wrap gap-4 z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Adversary IP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              <span>Target Asset</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              <span>Active Incident</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              <span>Perimeter Gateway</span>
            </div>
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3 mb-4">
              <div className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Node Inspector Panel</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {selectedNode ? selectedNode.type.toUpperCase() : 'NO NODE SELECTED'}
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">IDENTIFIER</div>
                  <div className="text-lg font-bold text-white">{selectedNode.name}</div>
                  <div className="text-[11px] text-cyan-400 font-bold">{selectedNode.ip || 'N/A'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-slate-300">
                  <div className="text-[10px] text-slate-500 uppercase">FORENSIC INTELLIGENCE</div>
                  <p className="text-xs font-sans leading-relaxed text-slate-200">
                    {selectedNode.details}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">INGESTED EVENTS</span>
                    <span className="text-base font-bold text-cyan-400">{selectedNode.eventCount}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">CURRENT STATUS</span>
                    <span className="text-base font-bold text-rose-400">{selectedNode.status}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <GitFork className="w-10 h-10 mx-auto mb-3 opacity-30 text-cyan-400" />
                <p>Click any node on the graph canvas to inspect relationship vectors, risk score, and IOC attributes.</p>
              </div>
            )}
          </div>

          {selectedNode && (
            <div className="pt-4 border-t border-[#1e3a66] mt-4">
              <button
                onClick={() => alert(`Enforcing immediate automated containment for ${selectedNode.name}`)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
              >
                Isolate & Neutralize Node
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
