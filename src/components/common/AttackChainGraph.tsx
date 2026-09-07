import React, { useState } from 'react';
import { ChevronRight, ShieldAlert, X } from 'lucide-react';
import { AttackChainNode } from '../../types';

interface AttackChainGraphProps {
  nodes: AttackChainNode[];
}

export const AttackChainGraph: React.FC<AttackChainGraphProps> = ({ nodes }) => {
  const [selectedNode, setSelectedNode] = useState<AttackChainNode | null>(null);

  return (
    <div className="relative p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]/60">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Active MITRE ATT&CK Intrusion Chain
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
          PROGRESSED TO SQL_INJECTION
        </span>
      </div>

      {/* Nodes progression flow */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {nodes.map((node, index) => {
          const isActive = node.status === 'ACTIVE';
          const isContained = node.status === 'CONTAINED';
          return (
            <React.Fragment key={node.id}>
              <div
                onClick={() => setSelectedNode(node)}
                className={`flex-1 min-w-[105px] p-2 rounded-lg border text-center cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-rose-500/15 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)] text-rose-300'
                    : isContained
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono font-bold truncate">
                  {node.name}
                </div>
                <div className="text-[9px] text-slate-400 font-mono truncate mt-0.5">
                  {node.stage}
                </div>
                {isActive && (
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
                    <span className="text-[9px] font-mono font-bold text-rose-400">{node.eventCount} ev</span>
                  </div>
                )}
              </div>
              {index < nodes.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Node Detail Drawer / Popover */}
      {selectedNode && (
        <div className="mt-3 p-3 rounded-lg bg-slate-900/95 border border-cyan-400/40 text-xs font-mono flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300 text-sm">{selectedNode.name}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                {selectedNode.stage}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                selectedNode.status === 'ACTIVE' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {selectedNode.status}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-1.5 font-sans">
              {selectedNode.details}
            </p>
            <div className="text-slate-500 text-[10px] mt-1">
              Total Telemetry Ingested: {selectedNode.eventCount} events correlating with active IOC indicators.
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
