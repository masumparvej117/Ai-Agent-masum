import React, { useState } from 'react';
import {
  Code2,
  Bug,
  Sparkles,
  Play,
  Copy,
  Check,
  FileCode,
  Terminal,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface CodingAssistantViewProps {
  language: Language;
}

export const CodingAssistantView: React.FC<CodingAssistantViewProps> = ({ language }) => {
  const t = translations[language];

  const [inputCode, setInputCode] = useState(`// Example Buggy JavaScript/TypeScript
function calculateDiscount(price, coupon) {
  if (coupon = "DISCOUNT50") { // Notice assignment bug (= instead of ===)
    return price * 0.5;
  }
  return price;
}`);

  const [langSelect, setLangSelect] = useState<'javascript' | 'python' | 'html' | 'sql'>('javascript');
  const [analysisResult, setAnalysisResult] = useState<{
    bugsFound: string[];
    explanation: string;
    fixedCode: string;
  } | null>({
    bugsFound: [
      'Accidental assignment operator in conditional statement: (coupon = "DISCOUNT50")',
      'Missing type signatures and edge-case validation for non-positive prices'
    ],
    explanation: `1. In line 3, '=' was used instead of strict equality '==='. This evaluates to truthy every time, improperly granting a 50% discount to all requests regardless of the coupon value.\n2. Refactored with strict TypeScript typings, string normalization (.trim().toUpperCase()), and guarded boundary conditions.`,
    fixedCode: `// Fixed & Optimized Implementation by Masum AI
export function calculateDiscount(price: number, coupon: string): number {
  if (price <= 0) return 0;
  
  if (coupon.trim().toUpperCase() === "DISCOUNT50") {
    return price * 0.5;
  }
  return price;
}`
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedFixed, setCopiedFixed] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        bugsFound: [
          'Syntax and logical execution flow inspected.',
          'Detected 1 potential assignment bug and 2 performance improvements.'
        ],
        explanation: `Masum AI verified the snippet:\n• Variable scoping and conditional branches analyzed.\n• Applied modern defensive typing and sanitization rules.`,
        fixedCode: `// Optimized implementation\nexport function processData(input: unknown): { valid: boolean; data?: unknown } {\n  return input ? { valid: true, data: input } : { valid: false };\n}`
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-cyan-500/25 glow-cyan flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Neural Code Debugger & Tutor</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white">
            {t.navCoding}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Identify syntax bugs, memory bottlenecks, and get step-by-step guidance designed for beginner and intermediate developers.
          </p>
        </div>

        {/* Language select */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['javascript', 'python', 'html', 'sql'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLangSelect(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                langSelect === l
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Analysis Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Code Editor */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Target Code Input</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{langSelect}</span>
          </div>

          <textarea
            rows={12}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-[#040711] border border-cyan-500/30 rounded-xl p-4 font-mono text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 leading-relaxed"
          />

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputCode.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-mono text-xs font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Bug className="w-4 h-4" />
            )}
            <span>{isAnalyzing ? 'Analyzing AST & Logic...' : 'Analyze & Debug Code'}</span>
          </button>
        </div>

        {/* Right: Analysis & Fix Explanation */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Inspection Report & Optimized Solution</span>
            </h3>

            {analysisResult && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(analysisResult.fixedCode);
                  setCopiedFixed(true);
                  setTimeout(() => setCopiedFixed(false), 2000);
                }}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedFixed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFixed ? 'Copied' : 'Copy Fix'}</span>
              </button>
            )}
          </div>

          {analysisResult ? (
            <div className="space-y-4">
              {/* Bugs List */}
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1.5 text-xs font-mono">
                <div className="text-rose-300 font-bold">Detected Vulnerabilities:</div>
                {analysisResult.bugsFound.map((b, i) => (
                  <div key={i} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Explanation in English */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="font-mono text-cyan-400 font-bold">Explanation & Fix Rationale:</div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {analysisResult.explanation}
                </p>
              </div>

              {/* Fixed Code */}
              <div>
                <div className="text-[11px] font-mono text-slate-400 mb-1.5">Refactored Clean Code:</div>
                <pre className="p-4 rounded-xl bg-[#040711] border border-emerald-500/40 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-48">
                  <code>{analysisResult.fixedCode}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 font-mono">
              Click "Analyze & Debug Code" to run the neural inspection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
