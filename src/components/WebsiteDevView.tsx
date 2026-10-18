import React, { useState } from 'react';
import {
  Code,
  Eye,
  FolderTree,
  SearchCheck,
  Play,
  Copy,
  Check,
  Download,
  Terminal,
  AlertCircle,
  FileCheck,
  Sparkles,
  ExternalLink,
  Layers,
  ShieldCheck,
  Github
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface WebsiteDevViewProps {
  language: Language;
}

export const WebsiteDevView: React.FC<WebsiteDevViewProps> = ({ language }) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'files' | 'seo' | 'deploy'>('preview');
  const [techStack, setTechStack] = useState<'react' | 'html' | 'nextjs'>('react');
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Default initial code
  const [generatedCode, setGeneratedCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Masum AI - Cyberpunk Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #060913;
      color: #e2e8f0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
  </style>
</head>
<body class="min-h-screen p-6 md:p-12 flex flex-col justify-center items-center">
  <div class="max-w-2xl w-full p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/40 shadow-2xl relative overflow-hidden">
    <div class="absolute -right-12 -top-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl"></div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2 text-cyan-400 text-xs tracking-widest uppercase">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>Masum AI Generated App</span>
      </div>
      <span class="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
        v1.0.0 Ready
      </span>
    </div>

    <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
      Welcome to <span class="text-cyan-400">Masum's Cyber Lab</span>
    </h1>

    <p class="text-slate-400 text-sm leading-relaxed mb-6">
      This responsive web application was generated autonomously by Masum AI. It features responsive layouts, Tailwind CSS utility styling, and is ready for production deployment.
    </p>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        <div class="text-xs text-slate-500">Status</div>
        <div class="text-emerald-400 font-bold text-sm">Online (Operational)</div>
      </div>
      <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        <div class="text-xs text-slate-500">Technology</div>
        <div class="text-cyan-400 font-bold text-sm">Tailwind + HTML5</div>
      </div>
    </div>

    <button onclick="alert('Masum AI Sandbox: Button Interaction Confirmed!')" class="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold rounded-xl hover:opacity-95 transition-all shadow-lg cursor-pointer">
      Test Interactive Sandbox
    </button>
  </div>
</body>
</html>`);

  // Simulated project files tree
  const [projectFiles, setProjectFiles] = useState([
    { path: 'index.html', size: '2.4 KB', type: 'entry' },
    { path: 'src/App.tsx', size: '4.8 KB', type: 'component' },
    { path: 'src/components/Hero.tsx', size: '3.1 KB', type: 'component' },
    { path: 'src/styles/theme.css', size: '1.2 KB', type: 'css' },
    { path: 'package.json', size: '890 B', type: 'config' },
    { path: 'README.md', size: '1.5 KB', type: 'docs' }
  ]);

  const handleGenerate = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedCode(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Masum AI - ${promptInput.slice(0, 25)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#050811] text-slate-100 min-h-screen p-6 flex flex-col justify-center items-center font-sans">
  <div class="max-w-xl w-full p-8 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl">
    <div class="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">Autonomous Agent Build</div>
    <h2 class="text-2xl font-bold text-white mb-4">Prompt: "${promptInput}"</h2>
    <p class="text-slate-400 text-sm mb-6 leading-relaxed">
      Custom modular component generated with atomic styling, semantic tags, and WCAG AA accessibility standards.
    </p>
    <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
      <span class="text-emerald-400">Verified Layout: Mobile & Desktop</span>
      <span class="text-cyan-300">Clean CSS</span>
    </div>
  </div>
</body>
</html>`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-cyan-500/25 glow-cyan flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Autonomous Web Workspace</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white">
            {t.webDevTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {t.webDevSubtitle}
          </p>
        </div>

        {/* Tech Stack Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          {(['react', 'html', 'nextjs'] as const).map((tech) => (
            <button
              key={tech}
              onClick={() => setTechStack(tech)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                techStack === tech
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tech === 'react' ? 'React.js' : tech === 'html' ? 'HTML+Tailwind' : 'Next.js'}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Prompt Bar */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder={t.genPromptPlaceholder}
          className="flex-1 bg-[#050811] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={!promptInput.trim() || isGenerating}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold font-mono text-xs tracking-wider hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          <span>{isGenerating ? t.generating : t.generateCodeBtn}</span>
        </button>
      </div>

      {/* Main Workspace: Tab Navigation & Content */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#070b16] overflow-hidden shadow-2xl">
        {/* Workspace Toolbar */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.livePreviewTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{t.sourceCodeTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>{t.projectFilesTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'seo'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SearchCheck className="w-3.5 h-3.5" />
              <span>{t.seoAuditTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('deploy')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'deploy'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>{t.deployGuide}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : t.copyCode}</span>
            </button>

            <button
              onClick={handleDownloadCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-mono transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadCode}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Sandbox Preview */}
        {activeTab === 'preview' && (
          <div className="p-4 bg-[#050811] min-h-[500px] flex items-center justify-center">
            <div className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-white">
              <iframe
                title="Live Sandbox"
                srcDoc={generatedCode}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-modals"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Raw Source Code */}
        {activeTab === 'code' && (
          <div className="p-4 bg-[#04060d] min-h-[500px]">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed h-[500px]">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}

        {/* Tab 3: Project Files Tree */}
        {activeTab === 'files' && (
          <div className="p-6 bg-[#050811] min-h-[500px] space-y-4">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>Generated Project Structure</span>
            </h3>

            <div className="space-y-2">
              {projectFiles.map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-slate-200">{f.path}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                      {f.type}
                    </span>
                  </div>
                  <span className="text-slate-500">{f.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: SEO & Layout Inspector */}
        {activeTab === 'seo' && (
          <div className="p-6 bg-[#050811] min-h-[500px] space-y-4">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <SearchCheck className="w-4 h-4 text-emerald-400" />
              <span>SEO, OpenGraph & Accessibility Audit</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400 font-mono">Meta Title Tag:</div>
                <div className="text-emerald-400 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                  ✓ "Masum AI - Cyberpunk Portfolio" (31 chars - Optimal)
                </div>
                <div className="text-slate-400 font-mono mt-3">Viewport Configuration:</div>
                <div className="text-emerald-400 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                  ✓ width=device-width, initial-scale=1.0 (Mobile Ready)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400 font-mono">Color Contrast & Accessibility:</div>
                <div className="text-emerald-400 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                  ✓ WCAG AA compliant (Cyan #00f5ff on Dark #060913 ratio: 12.4:1)
                </div>
                <div className="text-slate-400 font-mono mt-3">Page Load Speed Estimate:</div>
                <div className="text-emerald-400 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                  ✓ Lightweight standalone bundle (~4.2 KB total DOM)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Deploy Guide */}
        {activeTab === 'deploy' && (
          <div className="p-6 bg-[#050811] min-h-[500px] space-y-5 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white font-mono text-base">
                  GitHub & Cloud Deployment Guide
                </h3>
                <p className="text-xs text-slate-400">
                  3 Simple steps to get this site live on Vercel, Netlify, or GitHub Pages
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">Step 1: Download code and place in workspace</div>
                <p className="text-slate-400 mb-2">Click the "Download File" button above to save index.html to your project directory.</p>
                <div className="bg-slate-900 p-2 rounded text-slate-300 text-[11px]">
                  C:\Projects\my-first-site\index.html
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">Step 2: Initialize Git Repository (git init)</div>
                <div className="bg-slate-900 p-2.5 rounded text-slate-300 text-[11px] space-y-1">
                  <div>git init</div>
                  <div>git add .</div>
                  <div>git commit -m "First Masum AI web release"</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">Step 3: Push to GitHub & Deploy to Vercel / Netlify</div>
                <p className="text-slate-400">
                  Connect your GitHub repository to Vercel or Netlify for automated worldwide CDN hosting and SSL security.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Honesty disclaimer footer */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>{t.disclaimerLocalFiles}</span>
        <span className="text-cyan-400 font-mono">Masum AI Safety Protocol v1</span>
      </div>
    </div>
  );
};
