import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Bell,
  BatteryCharging,
  QrCode,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  Info,
  Key,
  Check,
  Radio,
  Wifi
} from 'lucide-react';
import { Language, AndroidCompanionState } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface AndroidAgentViewProps {
  language: Language;
}

export const AndroidAgentView: React.FC<AndroidAgentViewProps> = ({ language }) => {
  const t = translations[language];

  const [companion, setCompanion] = useState<AndroidCompanionState | null>(null);
  const [pingMessage, setPingMessage] = useState('Task #102 requires approval on Masum AI');
  const [isSendingPing, setIsSendingPing] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  useEffect(() => {
    api.getAndroidCompanion().then(setCompanion).catch(console.error);
  }, []);

  const handleSendPing = async () => {
    setIsSendingPing(true);
    try {
      const res = await api.sendAndroidPing(pingMessage);
      setPingResult('✓ Push notification dispatched to device successfully!');
      setTimeout(() => setPingResult(null), 4000);
    } catch (err) {
      setPingResult('Failed to send push notification');
    } finally {
      setIsSendingPing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-emerald-500/25 glow-green space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-400">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-mono text-white">
                  {t.androidTitle}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700">
                  {t.demoBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {t.androidSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
            <span>Link State: {companion?.status.toUpperCase() || 'PAIRED'}</span>
          </div>
        </div>

        {/* Real Mobile Automation Disclaimer */}
        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3 text-xs text-slate-300">
          <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-cyan-300">
              Security Architecture Notice:
            </span>{' '}
            {t.androidNotice}{' '}
            Android security sandboxing strictly isolates applications. A web dashboard communicates with devices through encrypted Firebase Cloud Messaging (FCM) push notifications and an authorized background companion daemon.
          </div>
        </div>
      </div>

      {/* Main Grid: Device Info & Push Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Paired Device Status */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{t.pairedDevice}</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Model:</span>
              <span className="text-white font-semibold">{companion?.deviceName || 'Samsung Galaxy S24 Ultra'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Operating System:</span>
              <span className="text-emerald-400 font-semibold">{companion?.androidVersion || 'Android 14 (OneUI 6.1)'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">{t.batteryLevel}:</span>
              <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span>{companion?.battery || 84}%</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">{t.pairingPin}:</span>
              <span className="text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {companion?.pairingPin || '772-910'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Push Alert Dispatcher */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>{t.pushTestTitle}</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Notification Message Payload:
              </label>
              <textarea
                rows={3}
                value={pingMessage}
                onChange={(e) => setPingMessage(e.target.value)}
                className="w-full bg-[#050811] border border-cyan-500/30 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            <button
              onClick={handleSendPing}
              disabled={isSendingPing || !pingMessage.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold font-mono text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingPing ? 'Dispatching...' : t.sendPushBtn}</span>
            </button>

            {pingResult && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center">
                {pingResult}
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Security & Scoped Permissions */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.permissionsTitle}</span>
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Push Notifications:</span>
              <span className="text-emerald-400 font-semibold">Granted</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Foreground Service:</span>
              <span className="text-emerald-400 font-semibold">Granted</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Scoped Storage:</span>
              <span className="text-cyan-300 font-semibold">App Folder Only</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Device Automation:</span>
              <span className="text-amber-400 font-semibold">Restricted Sandbox</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
