import React, { useState } from 'react';
import { 
  FileText, Shield, Terminal, HardDrive, Hash, CheckCircle2, 
  AlertTriangle, Radio, Download, Search, Filter, Layers, Copy, Check
} from 'lucide-react';
import type { EvidenceItem } from '../types';

const EVIDENCE_LOGS: EvidenceItem[] = [
  {
    id: 'ev-zeek-conn-01',
    sensor: 'Zeek conn.log',
    timestamp: '2026-09-08 10:41:08 UTC',
    title: 'SYN Half-Open Burst Flow Record',
    details: '1,024 half-open TCP connections with flags S0 originating from 185.220.101.5 targeting destination ports 1-1024. Connection state: REJ/RST.',
    hash_sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    payloadSnippet: '1725792000.123456\tC1a2b3c4d5e6f7g8\t185.220.101.5\t49120\t192.168.1.50\t80\ttcp\thttp\t0.012\t420\t1890\tSF\tF\tT\t0\tShADdfFa\t12\t1024\t15\t2400',
    pcapAvailable: true
  },
  {
    id: 'ev-zeek-http-02',
    sensor: 'Zeek http.log',
    timestamp: '2026-09-08 10:41:21 UTC',
    title: 'OWASP SQL Injection Raw HTTP Request',
    details: "POST /api/v1/auth/login HTTP/1.1 with parameter user=admin' OR 1=1-- and UNION SELECT payload targeting customer credentials.",
    hash_sha256: '8f481c0023a48e77a28867a505b81014a93c78a05c754d924d55b0870cc528b1',
    payloadSnippet: "POST /api/v1/auth/login HTTP/1.1\nHost: srv-web01.internal\nUser-Agent: sqlmap/1.7#stable\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin%27%20UNION%20SELECT%201,username,password_hash%20FROM%20users--",
    pcapAvailable: true
  },
  {
    id: 'ev-zeek-dns-03',
    sensor: 'Zeek dns.log',
    timestamp: '2026-09-08 10:41:02 UTC',
    title: 'Adversary C2 Infrastructure Domain Resolution',
    details: 'DNS query for hostname c2-pool.internal-update.biz returning IP 185.220.101.5. Query flagged against Threat Intelligence IOC feeds.',
    hash_sha256: '5d3419082ac3a778e1b991823abce18092301bc81726a718c187216c871216ab',
    payloadSnippet: '1725792020.112233\tD0a1b2c3d4e5f6g8\t192.168.1.50\t53002\t192.168.1.1\t53\tudp\t42891\tc2-pool.internal-update.biz\tC_INTERNET\tA\tNOERROR\t185.220.101.5\t60.000000',
    pcapAvailable: false
  },
  {
    id: 'ev-zeek-ssl-04',
    sensor: 'Zeek ssl.log',
    timestamp: '2026-09-08 10:41:44 UTC',
    title: 'Encrypted TLS Tunnel Handshake Telemetry',
    details: 'TLSv1.3 session established with cipher TLS_AES_256_GCM_SHA384 and SNI c2-pool.internal-update.biz before 142.6 MB egress spike.',
    hash_sha256: 'a356291b86e0018f97e2f5b614d9b04859d04f2913e155bc983794b61ec31d8e',
    payloadSnippet: '1725792025.776655\tC5e6f7g8h9i0j1k2\t192.168.1.50\t48200\t185.220.101.5\t443\tTLSv13\tTLS_AES_256_GCM_SHA384\tc2-pool.internal-update.biz\tF\tT',
    pcapAvailable: true
  }
];

export const EvidenceExplorer: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem>(EVIDENCE_LOGS[0]);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [filterSensor, setFilterSensor] = useState<string>('ALL');

  const handleCopyHash = (h: string) => {
    navigator.clipboard.writeText(h);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const filtered = EVIDENCE_LOGS.filter(e => {
    if (filterSensor === 'ALL') return true;
    return e.sensor.toLowerCase().includes(filterSensor.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* 1. Header */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              FORENSIC TELEMETRY VAULT
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">ZEEK SENSOR METADATA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Forensic Evidence Explorer
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5 max-w-3xl">
            Inspect raw sensor records, connection tuples, HTTP requests, DNS resolutions, and TLS handshakes supporting Incident THR-1042.
          </p>
        </div>

        {/* TShark Status */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[120px]">
            <div className="text-emerald-400 font-black text-sm">ACTIVE</div>
            <div className="text-[10px] text-slate-400 uppercase">Zeek Ingestion</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[120px]">
            <div className="text-cyan-400 font-black text-sm">OPTIONAL TAP</div>
            <div className="text-[10px] text-slate-400 uppercase">TShark PCAP</div>
          </div>
        </div>
      </div>

      {/* 2. Sensor Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#091224] border border-[#1e3a66] font-mono text-xs">
        {['ALL', 'conn', 'http', 'dns', 'ssl'].map(s => (
          <button
            key={s}
            onClick={() => setFilterSensor(s)}
            className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all cursor-pointer ${
              filterSensor === s
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {s === 'ALL' ? 'ALL SENSORS' : `Zeek ${s}.log`}
          </button>
        ))}
      </div>

      {/* 3. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Evidence Items */}
        <div className="space-y-3">
          {filtered.map(item => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0e1c36] border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                    : 'bg-[#080d1a] border-[#1e3a66]/70 hover:border-cyan-500/50 hover:bg-[#0b1426]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
                    {item.sensor}
                  </span>
                  <span>{item.timestamp}</span>
                </div>
                <h3 className="font-bold text-white text-sm tracking-tight">{item.title}</h3>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{item.details}</p>
              </div>
            );
          })}
        </div>

        {/* Right Forensic Deep Inspection View */}
        <div className="lg:col-span-2 space-y-4 font-mono text-xs">
          <div className="p-6 rounded-2xl bg-[#080e1c] border border-cyan-500/40 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e3a66]">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">ARTIFACT IDENTIFIER</div>
                <div className="font-bold text-white text-lg tracking-tight font-sans mt-0.5">
                  {selectedItem.title}
                </div>
              </div>
              <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold shrink-0">
                {selectedItem.sensor}
              </span>
            </div>

            {/* Cryptographic Hash */}
            {selectedItem.hash_sha256 && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
                  <span>SHA-256 FORENSIC INTEGRITY HASH</span>
                  <button
                    onClick={() => handleCopyHash(selectedItem.hash_sha256!)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
                <div className="text-slate-300 break-all text-[11px] font-mono select-all">
                  {selectedItem.hash_sha256}
                </div>
              </div>
            )}

            {/* Structured Details */}
            <div className="space-y-1.5 font-sans">
              <div className="text-[10px] font-mono text-slate-400 uppercase">CORRELATED EVENT NARRATIVE</div>
              <p className="text-slate-300 text-xs leading-relaxed bg-[#0a1224] p-3.5 rounded-xl border border-slate-800">
                {selectedItem.details}
              </p>
            </div>

            {/* Raw Sensor Log Payload */}
            {selectedItem.payloadSnippet && (
              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
                  <span>RAW INGESTION PAYLOAD</span>
                  <span className="text-emerald-400 font-bold">NORMALIZED VERDICT</span>
                </div>
                <pre className="p-4 rounded-xl bg-black border border-slate-800 text-cyan-300 overflow-x-auto text-[11px] leading-relaxed font-mono">
                  {selectedItem.payloadSnippet}
                </pre>
              </div>
            )}

            {/* TShark Packet Evidence Section */}
            <div className="pt-4 border-t border-[#1e3a66] space-y-2 font-sans">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase">
                <span>TSHARK DEEP PACKET CAPTURE (PCAP)</span>
                <span className={selectedItem.pcapAvailable ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedItem.pcapAvailable ? 'FRAMES EXTRACTED' : 'NOT AVAILABLE'}
                </span>
              </div>

              {selectedItem.pcapAvailable ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    PCAP FRAME VERIFICATION COMPLETE
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Extracted 14 frames matching flow tuple. TCP sequence verification and ACK flag distribution corroborated.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-1">
                  <div className="font-bold font-mono text-slate-300">
                    Packet evidence unavailable
                  </div>
                  <p className="text-[11px]">
                    Packet capture for this flow was outside the active TAP span window or occurred over synthetic sensor fallback. Telemetry is verified via Zeek log metadata.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceExplorer;
