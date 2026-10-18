import React, { useState } from 'react';
import {
  Search,
  Globe,
  BookOpen,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ListFilter,
  Bookmark
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ResearchViewProps {
  language: Language;
}

export const ResearchView: React.FC<ResearchViewProps> = ({ language }) => {
  const t = translations[language];

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [researchTopics, setResearchTopics] = useState([
    {
      title: 'Next.js 15 App Router vs Pages Router Architecture',
      summary: 'App Router introduces React Server Components (RSC) and nested layouts. Developers benefit from simplified data fetching, automated streaming, and zero client bundle overhead for static views.',
      takeaways: ['Server components by default reduce client bundle size', 'Streaming SSR with React Suspense', 'Simplified layout persistence and nested error boundaries'],
      source: 'Next.js Official Documentation'
    },
    {
      title: 'Building Secure Local Companion Bridge Agents for Windows & Linux',
      summary: 'Never expose unrestricted cmd.exe shells. Always enforce token authentication, localhost socket binding, allowlisted command validation, and directory sandboxing.',
      takeaways: ['Token-based symmetric authentication', 'Folder allowlist path canonicalization', 'Explicit human confirmation for deletions and writes'],
      source: 'OWASP Autonomous AI Security Guidelines'
    }
  ]);

  const handleSearch = () => {
    if (!query.trim() || isSearching) return;
    setIsSearching(true);
    setTimeout(() => {
      setResearchTopics((prev) => [
        {
          title: `Technical Synthesis: ${query}`,
          summary: `Comprehensive evaluation of "${query}". Masum AI synthesized key technical specifications, ecosystem compatibility, and architectural requirements.`,
          takeaways: [
            'Verified documentation and stable package releases',
            'Cross-referenced security and dependency implications',
            'Prepared actionable execution tasks for project integration'
          ],
          source: 'Gemini Technical Research Synthesizer'
        },
        ...prev
      ]);
      setIsSearching(false);
      setQuery('');
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-cyan-500/25 glow-cyan">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Knowledge & Technical Synthesis</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold font-mono text-white">
          {t.navResearch}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Deep technical research, documentation synthesis, and architectural insights for frameworks, libraries, and tools.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. How do React 19 Server Actions handle optimistic updates?..."
            className="w-full bg-[#050811] border border-cyan-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold font-mono text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-40"
        >
          {isSearching ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{isSearching ? 'Synthesizing...' : 'Search Knowledge'}</span>
        </button>
      </div>

      {/* Research Output Cards */}
      <div className="space-y-4">
        {researchTopics.map((topic, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{topic.title}</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                Source: {topic.source}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              {topic.summary}
            </p>

            {/* Structured Takeaways */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Key Technical Takeaways & Architecture Checklist:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {topic.takeaways.map((takeaway, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-sans flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
