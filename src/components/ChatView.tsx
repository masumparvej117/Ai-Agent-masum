import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  PlusCircle,
  Copy,
  Check,
  Terminal,
  ShieldAlert,
  Loader2,
  Trash2,
  Code,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Monitor,
  Smartphone,
  Cloud,
  CheckCircle2,
  ListTodo,
  ExternalLink,
  Lock,
  Mic,
  MicOff,
  Volume2,
  Globe,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { ChatMessage, Language, TaskItem, ProposedPlan } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface ChatViewProps {
  language: Language;
  onPlanTask: (suggestedTask: Partial<TaskItem>) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ language, onPlanTask }) => {
  const t = translations[language];

  const [aiHealth, setAiHealth] = useState<{ hasKey: boolean; model: string; isChecking?: boolean }>({
    hasKey: false,
    model: 'gemini-3.8-flash',
    isChecking: false
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello Masum! I am your personal autonomous AI agent (Masum AI).

Engine: Google GenAI (Gemini-3.8-Flash) via secure server-side execution.
Security Boundary: Secrets are isolated on the server and never sent to the client browser.

Multilingual Capabilities:
• I understand ANY language you write or speak: English, Bangla (বাংলা), Banglish (e.g. "Amar website design kore dao"), Hindi (हिन्दी), Arabic (العربية), etc.
• I automatically detect your language and reply in the matching language.
• Multilingual speech-to-text is available via the microphone button below.

Strict Separation of Plans vs. Executed Actions:
• I will NEVER claim that an action has already succeeded on your PC, phone, or live web unless verified tool execution has finished.
• Every requested action generates a structured "Proposed Plan" which you can inspect and launch into the verified task runner.

Select a quick test prompt below or write your instruction in any language:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.8-flash'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [launchedPlans, setLaunchedPlans] = useState<{ [key: string]: boolean }>({});
  
  // Voice Input (Speech Recognition) State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechLanguage, setSpeechLanguage] = useState<'auto' | 'en-US' | 'bn-BD' | 'hi-IN' | 'ar-SA'>('auto');
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const checkHealth = async () => {
    setAiHealth((prev) => ({ ...prev, isChecking: true }));
    try {
      const h = await api.getSystemHealth();
      setAiHealth({ hasKey: h.hasKey, model: h.model, isChecking: false });
    } catch (err) {
      console.error('Failed to query health:', err);
      setAiHealth((prev) => ({ ...prev, isChecking: false }));
    }
  };

  useEffect(() => {
    checkHealth();

    // Initialize Web Speech API if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (speechLanguage === 'bn-BD') {
          recognitionRef.current.lang = 'bn-BD';
        } else if (speechLanguage === 'hi-IN') {
          recognitionRef.current.lang = 'hi-IN';
        } else if (speechLanguage === 'ar-SA') {
          recognitionRef.current.lang = 'ar-SA';
        } else {
          recognitionRef.current.lang = 'en-US';
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 46), 140);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText !== undefined ? messageText : input).trim();
    if (!textToSend || isLoading) return;

    // Stop listening if speech recognition active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (messageText === undefined) {
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '46px';
      }
    }
    setIsLoading(true);

    try {
      // Map previous history for conversation context (preserve current session)
      const historyPayload = messages
        .filter((m) => m.sender === 'user' || m.sender === 'ai')
        .map((m) => ({
          sender: m.sender === 'user' ? ('user' as const) : ('ai' as const),
          text: m.text
        }));

      const res = await api.sendChatMessage(textToSend, historyPayload, 'en');

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
        suggestedTask: res.suggestedTask,
        proposedPlan: res.proposedPlan
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const isMissingKey = err.errorType === 'GEMINI_API_KEY_MISSING' || !aiHealth.hasKey;
      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'system',
        isError: true,
        errorType: isMissingKey ? 'missing_key' : 'api_error',
        failedPrompt: textToSend,
        text: err.message || 'Gemini API call failed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLaunchPlan = (msgId: string, plan: ProposedPlan) => {
    setLaunchedPlans((prev) => ({ ...prev, [msgId]: true }));
    onPlanTask({
      title: plan.title,
      titleBn: plan.title,
      description: plan.description,
      descriptionBn: plan.description,
      category: plan.category,
      target: plan.target,
      riskLevel: plan.riskLevel,
      commandSnippet: plan.commandSnippet
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: 'Chat history cleared. Ready for your next instruction in any language.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini-3.8-flash'
      }
    ]);
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'windows':
        return <Monitor className="w-3.5 h-3.5 text-cyan-400" />;
      case 'android':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Cloud className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  // Specific user prompt examples from user requirement specifications
  const multilingualExamples = [
    { label: 'Banglish', text: 'Amar website design kore dao.' },
    { label: 'English', text: 'Create a modern portfolio website.' },
    { label: 'Bangla', text: 'আমার কম্পিউটারের ফাইলগুলো সাজিয়ে দাও।' },
    { label: 'Mixed Dev', text: 'React e ekta responsive navbar banaye dao with Tailwind' },
    { label: 'Hindi', text: 'वेबसाइट के लिए आधुनिक डैशबोर्ड बनाओ' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-transparent backdrop-blur-[2px] relative font-sans">
      {/* Top Bar inside Chat */}
      <div className="px-4 md:px-6 py-2.5 border-b border-cyan-500/15 bg-[#080d1a]/85 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                aiHealth.hasKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'
              }`}
            ></span>
            <span className="font-mono text-xs font-semibold text-cyan-300 tracking-wide uppercase">
              {aiHealth.hasKey
                ? 'Gemini-3.8-Flash Live · Connected'
                : 'Gemini-3.8-Flash · Awaiting GEMINI_API_KEY in Secrets'}
            </span>
          </div>

          <button
            onClick={checkHealth}
            disabled={aiHealth.isChecking}
            title="Re-check server API key status"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${aiHealth.isChecking ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Check Status</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Zero Client Leak</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>Auto Language Detect</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            const isMissingKey = msg.errorType === 'missing_key';

            return (
              <div key={msg.id} className="flex justify-center max-w-2xl mx-auto w-full">
                <div
                  className={`w-full p-4 rounded-xl border shadow-xl ${
                    isMissingKey
                      ? 'bg-[#150e18]/90 border-amber-500/50 text-amber-200'
                      : 'bg-[#180a0e]/90 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isMissingKey ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40' : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {isMissingKey ? <KeyRound className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                          {isMissingKey ? 'Gemini API Key Required' : 'Gemini Request Failed'}
                        </span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>

                      <p className="font-sans text-xs text-slate-300 leading-relaxed">
                        {isMissingKey
                          ? 'Masum AI calls Google GenAI securely from the server to protect credentials. To activate live responses, configure your GEMINI_API_KEY in Google AI Studio.'
                          : msg.text}
                      </p>

                      {isMissingKey && (
                        <div className="p-3 rounded-lg bg-black/40 border border-amber-500/25 space-y-1.5 text-[11px] text-amber-300/90 font-mono">
                          <div className="font-bold text-white">How to connect Gemini in Google AI Studio:</div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">1.</span>
                            <span>Open the <strong>Settings</strong> or <strong>Secrets</strong> panel in AI Studio.</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">2.</span>
                            <span>Add a secret variable with Key: <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 border border-slate-700">GEMINI_API_KEY</code> and your Google AI Gemini API key.</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">3.</span>
                            <span>Click <strong>"Check Status"</strong> at the top or <strong>"Retry Message"</strong> below.</span>
                          </div>
                        </div>
                      )}

                      {msg.failedPrompt && (
                        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                          <span className="text-[11px] text-slate-400 truncate max-w-xs font-sans">
                            Failed prompt: "{msg.failedPrompt}"
                          </span>
                          <button
                            onClick={() => handleSend(msg.failedPrompt)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-cyan-400 hover:opacity-95 text-slate-950 font-bold font-mono text-xs tracking-wider transition-all cursor-pointer shrink-0 disabled:opacity-50"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retry Message</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const plan = msg.proposedPlan;
          const isLaunched = launchedPlans[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex gap-3 md:gap-4 max-w-4xl ${
                isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isAi
                    ? 'bg-cyan-950/80 border-cyan-400/50 text-cyan-400 glow-cyan'
                    : 'bg-emerald-950/80 border-emerald-400/50 text-emerald-400'
                }`}
              >
                {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 md:p-5 relative border text-sm leading-relaxed space-y-3 ${
                  isAi
                    ? 'bg-[#090e1d]/90 border-cyan-500/25 text-slate-200 shadow-xl'
                    : 'bg-[#0a1622]/90 border-emerald-500/30 text-emerald-100 shadow-md'
                }`}
              >
                {/* Header metadata */}
                <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    {isAi ? (
                      <>
                        <span>MASUM AI</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {msg.source || 'gemini-3.8-flash'}
                        </span>
                      </>
                    ) : (
                      'OPERATOR: MASUM'
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Conversational Explanation (Can contain Bangla, Banglish, Hindi, etc. from user/AI) */}
                <div className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-sm">
                  {msg.text}
                </div>

                {/* DISTINCT SECTION: AI-Generated Proposed Plan (CLEAR SEPARATION) */}
                {plan && (
                  <div className="mt-4 rounded-xl border border-amber-500/40 bg-[#060b18] overflow-hidden shadow-2xl space-y-0">
                    {/* Plan Header Badge */}
                    <div className="px-4 py-2.5 bg-amber-950/40 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <ListTodo className="w-4 h-4 text-amber-400" />
                        <span>AI-GENERATED PLAN · PROPOSED ONLY (UNEXECUTED)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 uppercase">
                        Requires Verification
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Plan Title & Targets */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            {plan.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {plan.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {getTargetIcon(plan.target)}
                            <span>Target: {plan.target.toUpperCase()}</span>
                          </span>
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                              plan.riskLevel === 'critical'
                                ? 'bg-rose-950/80 text-rose-300 border-rose-500'
                                : 'bg-slate-900 text-cyan-300 border-cyan-800'
                            }`}
                          >
                            Risk: {plan.riskLevel}
                          </span>
                        </div>
                      </div>

                      {/* Proposed Steps Checklist */}
                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5 font-mono text-xs">
                        <div className="text-[11px] text-slate-400">
                          Proposed Execution Steps:
                        </div>
                        {plan.proposedSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-300">
                            <span className="w-4 h-4 rounded bg-slate-900 text-cyan-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* Suggested Tools Preview */}
                      {plan.suggestedTools && plan.suggestedTools.length > 0 && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <span>Required Tools:</span>
                          <div className="flex flex-wrap gap-1">
                            {plan.suggestedTools.map((tName, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[10px]"
                              >
                                {tName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Explicit Security Warning if Critical / Requires Approval */}
                      {plan.requiresApproval && (
                        <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>
                            Security Alert: This task modifies system resources. After launching, explicit owner approval will be required in the Approval Center.
                          </span>
                        </div>
                      )}

                      {/* Launch Button */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                        <span className="text-[11px] font-mono text-slate-500">
                          Transfer to verified task execution runner
                        </span>

                        <button
                          onClick={() => handleLaunchPlan(msg.id, plan)}
                          disabled={isLaunched}
                          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            isLaunched
                              ? 'bg-emerald-950 border border-emerald-500 text-emerald-400 cursor-default'
                              : 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:opacity-90 shadow-lg'
                          }`}
                        >
                          {isLaunched ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Queued in Tasks</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Launch as Verified Task</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading typing indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-400 flex items-center justify-center glow-cyan">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="rounded-2xl p-4 bg-[#090e1d]/90 border border-cyan-500/30 flex items-center gap-3 text-cyan-300 text-xs font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Masum AI querying Gemini API and synthesizing execution plan...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts (Language Examples from requirements) */}
      <div className="px-4 md:px-6 py-2 border-t border-cyan-500/15 bg-[#070c18]/90 shrink-0">
        <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Test Multilingual Prompts (Click to send & test Gemini language mirroring):</span>
          </div>
          <span className="text-[10px] text-cyan-400/70 font-mono">Banglish / English / Bangla / Hindi</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {multilingualExamples.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSend(item.text)}
              disabled={isLoading}
              className="text-left text-xs px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 transition-all font-mono truncate max-w-xs md:max-w-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                {item.label}
              </span>
              <span className="truncate">"{item.text}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box with Voice Microphone Integration & Multi-line Shift+Enter */}
      <div className="p-4 md:p-6 border-t border-cyan-500/20 bg-[#080d1c] shrink-0">
        {isListening && (
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/50 flex items-center justify-between text-xs font-mono text-rose-300 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>Microphone active... Speak in English, Bangla, Hindi, or any language.</span>
            </div>
            <button
              onClick={toggleSpeechRecognition}
              className="text-[10px] underline hover:text-white cursor-pointer"
            >
              Stop
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 md:gap-3">
          {/* Voice input button */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              disabled={isLoading}
              title={isListening ? 'Stop listening' : 'Start speech-to-text (Multilingual)'}
              className={`p-3 rounded-xl border font-mono text-xs transition-all flex items-center justify-center cursor-pointer shrink-0 h-[46px] w-[46px] ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-400 glow-rose animate-pulse'
                  : 'bg-slate-900 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950 hover:border-cyan-400'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="Ask in any language (English, বাংলা, Banglish, हिन्दी, العربية)... Enter to send, Shift+Enter for new line"
              disabled={isLoading}
              className="w-full bg-[#050811] border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans resize-none max-h-36 min-h-[46px] leading-relaxed block"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide shadow-lg hover:shadow-cyan-500/25 hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 h-[46px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
