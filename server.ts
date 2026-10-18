import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Dynamic GoogleGenAI client loader
export function getGenAI(): { client: GoogleGenAI | null; hasKey: boolean; key: string } {
  if (!process.env.GEMINI_API_KEY) {
    dotenv.config();
  }
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) {
    return { client: null, hasKey: false, key: '' };
  }
  try {
    const client = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return { client, hasKey: true, key };
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return { client: null, hasKey: true, key };
  }
}

// In-Memory Database for Tasks, Approvals, Devices, and Audit Logs
export interface TaskStep {
  id: string;
  title: string;
  titleBn: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  details?: string;
}

export interface TaskLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  messageBn?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  category: 'web_dev' | 'coding' | 'windows' | 'android' | 'research' | 'file_management';
  target: 'windows' | 'android' | 'cloud';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'needs_approval';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
  approvedByOwner?: boolean;
  steps: TaskStep[];
  logs: TaskLog[];
  codeSnippet?: string;
  commandSnippet?: string;
  createdAt: string;
  updatedAt: string;
}

// Seed Tasks (English-Only UI interface)
let tasks: TaskItem[] = [
  {
    id: 'task-101',
    title: 'Initialize Next.js Cyber Dashboard Project',
    titleBn: 'Initialize Next.js Cyber Dashboard Project',
    description: 'Scaffold responsive UI layout with Tailwind CSS and modular widget cards.',
    descriptionBn: 'Scaffold responsive UI layout with Tailwind CSS and modular widget cards.',
    category: 'web_dev',
    target: 'cloud',
    status: 'completed',
    riskLevel: 'low',
    requiresApproval: false,
    steps: [
      { id: 's1', title: 'Parse component tree', titleBn: 'Parse component tree', status: 'completed' },
      { id: 's2', title: 'Generate Tailwind theme configuration', titleBn: 'Generate Tailwind theme configuration', status: 'completed' },
      { id: 's3', title: 'Compile sandbox build', titleBn: 'Compile sandbox build', status: 'completed' }
    ],
    logs: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'info', message: 'Task received by Masum AI engine' },
      { timestamp: new Date(Date.now() - 3550000).toISOString(), level: 'info', message: 'Workspace sandbox prepared successfully' },
      { timestamp: new Date(Date.now() - 3500000).toISOString(), level: 'success', message: 'Build completed with 0 errors' }
    ],
    codeSnippet: `// components/CyberHero.tsx\nexport function CyberHero() {\n  return (\n    <div className="p-8 border border-cyan-500/40 rounded-xl bg-slate-950/80">\n      <h1 className="text-3xl font-mono text-cyan-400">Masum AI Neural Hub</h1>\n      <p className="text-slate-400 mt-2">Autonomous Assistant Ready.</p>\n    </div>\n  );\n}`,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3500000).toISOString()
  },
  {
    id: 'task-102',
    title: 'Overwrite Production Config on Windows Companion',
    titleBn: 'Overwrite Production Config on Windows Companion',
    description: 'Target: C:\\Projects\\masum-workspace\\.env.local - Requesting replacement of database credentials.',
    descriptionBn: 'Target: C:\\Projects\\masum-workspace\\.env.local - Requesting replacement of database credentials.',
    category: 'windows',
    target: 'windows',
    status: 'needs_approval',
    riskLevel: 'critical',
    requiresApproval: true,
    steps: [
      { id: 'w1', title: 'Verify Companion Connection', titleBn: 'Verify Companion Connection', status: 'completed' },
      { id: 'w2', title: 'Await explicit owner authorization', titleBn: 'Await explicit owner authorization', status: 'running' },
      { id: 'w3', title: 'Execute file atomic write and backup', titleBn: 'Execute file atomic write and backup', status: 'pending' }
    ],
    logs: [
      { timestamp: new Date(Date.now() - 1200000).toISOString(), level: 'warn', message: 'Security Policy Alert: Modifying sensitive env file requires Owner Approval.' },
      { timestamp: new Date(Date.now() - 1100000).toISOString(), level: 'info', message: 'Task halted in Approval Center pending owner consent.' }
    ],
    commandSnippet: `// Windows Bridge Action\nWrite-File -Path "C:\\Projects\\masum-workspace\\.env.local" -Content "[SENSITIVE_CONFIG]"`,
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    updatedAt: new Date(Date.now() - 1100000).toISOString()
  },
  {
    id: 'task-103',
    title: 'Analyze Code Performance & Memory Leaks',
    titleBn: 'Analyze Code Performance & Memory Leaks',
    description: 'Inspect asynchronous loops and React re-renders in payment gateway module.',
    descriptionBn: 'Inspect asynchronous loops and React re-renders in payment gateway module.',
    category: 'coding',
    target: 'cloud',
    status: 'running',
    riskLevel: 'low',
    requiresApproval: false,
    steps: [
      { id: 'c1', title: 'Static AST inspection', titleBn: 'Static AST inspection', status: 'completed' },
      { id: 'c2', title: 'Memory profiling emulation', titleBn: 'Memory profiling emulation', status: 'running' },
      { id: 'c3', title: 'Generate optimization report', titleBn: 'Generate optimization report', status: 'pending' }
    ],
    logs: [
      { timestamp: new Date(Date.now() - 600000).toISOString(), level: 'info', message: 'Scanning 14 source files...' },
      { timestamp: new Date(Date.now() - 300000).toISOString(), level: 'info', message: 'Detected 2 redundant useEffect subscriptions in checkout.tsx' }
    ],
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 'task-104',
    title: 'Android Companion: Push Security Notification',
    titleBn: 'Android Companion: Push Security Notification',
    description: 'Dispatch high-priority push ping to paired device (Samsung Galaxy S24).',
    descriptionBn: 'Dispatch high-priority push ping to paired device (Samsung Galaxy S24).',
    category: 'android',
    target: 'android',
    status: 'completed',
    riskLevel: 'medium',
    requiresApproval: false,
    steps: [
      { id: 'a1', title: 'Check FCM bridge status', titleBn: 'Check FCM bridge status', status: 'completed' },
      { id: 'a2', title: 'Dispatch encrypted payload', titleBn: 'Dispatch encrypted payload', status: 'completed' }
    ],
    logs: [
      { timestamp: new Date(Date.now() - 1800000).toISOString(), level: 'info', message: 'FCM push sent with messageId: #msg_9941a' },
      { timestamp: new Date(Date.now() - 1790000).toISOString(), level: 'success', message: 'Acknowledged by device within 240ms' }
    ],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1790000).toISOString()
  }
];

// Windows Companion State (Simulated Bridge)
const windowsCompanion = {
  status: 'standby', // 'connected' | 'standby' | 'disconnected'
  version: '1.2.0-beta',
  host: 'DESKTOP-MASUM-PC',
  ip: '192.168.1.105 (Local LAN)',
  token: 'MSM-WIN-BRIDGE-SEC-8829',
  allowedDirectories: [
    'C:\\Users\\Masum\\Projects\\masum-workspace',
    'D:\\Development\\my-web-apps',
    'C:\\Users\\Masum\\Desktop\\TestingGround'
  ],
  allowlistedCommands: [
    'npm run dev',
    'npm run build',
    'npm test',
    'git status',
    'git diff',
    'python --version',
    'node -v'
  ],
  lastHeartbeat: new Date().toISOString(),
  logs: [
    { timestamp: new Date(Date.now() - 1500000).toISOString(), message: 'Companion bridge daemon listening on localhost:8765' },
    { timestamp: new Date(Date.now() - 900000).toISOString(), message: 'Local sandbox directory verified: C:\\Users\\Masum\\Projects\\masum-workspace' },
    { timestamp: new Date(Date.now() - 300000).toISOString(), message: 'Heartbeat ping received OK' }
  ]
};

// Android Companion State (Simulated Bridge)
const androidCompanion = {
  status: 'paired', // 'paired' | 'scanning' | 'unpaired'
  deviceName: 'Samsung Galaxy S24 Ultra',
  androidVersion: 'Android 14 (OneUI 6.1)',
  battery: 84,
  pairingPin: '772-910',
  permissions: {
    notifications: 'granted',
    foregroundService: 'granted',
    scopedStorage: 'limited_to_app_folder',
    deviceAutomation: 'restricted_sandbox'
  },
  lastPing: new Date().toISOString()
};

// API ROUTES

// 1. System Health & Gemini Configuration
app.get('/api/system/health', (req: Request, res: Response) => {
  const { hasKey } = getGenAI();
  res.json({
    status: 'operational',
    aiStatus: hasKey ? 'connected' : 'no_api_key',
    hasKey,
    model: 'gemini-3.8-flash',
    uptime: process.uptime(),
    tasksCount: tasks.length,
    pendingApprovals: tasks.filter(t => t.status === 'needs_approval').length,
    windowsCompanionStatus: windowsCompanion.status,
    androidCompanionStatus: androidCompanion.status,
    timestamp: new Date().toISOString()
  });
});

// 2. Chat with Gemini (Real AI with Plan vs Execution separation)
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history, language = 'bn' } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const { client, hasKey } = getGenAI();

  // System instruction for Masum AI
  const systemInstruction = `You are "Masum AI", a personal autonomous AI agent and coding companion for your owner Masum, a beginner programmer.

MULTILINGUAL INTELLIGENCE & LANGUAGE RULES:
1. Understand and respond to ANY language the user writes:
   - English: Respond in clean, clear, supportive English.
   - Bangla (বাংলা script): Respond in natural, fluent, supportive Bangla.
   - Banglish (Bangla written in English/Latin letters, e.g. "Amar website design kore dao", "file gula dekhao", "ami ekta react app banate chai"): Understand the Banglish intent and respond naturally in Banglish or friendly Bangla as appropriate.
   - Hindi (हिन्दी or Hinglish): Understand and respond in Hindi or Hinglish.
   - Arabic (العربية): Understand and respond in Arabic.
   - Spanish, French, German, Urdu, or any language supported by Gemini: Automatically detect the user's language and reply in the same language unless explicitly requested otherwise.
   - Multilingual / Code-Switching: Seamlessly understand mixed-language instructions (e.g. "React e ekta responsive navbar banaye dao with Tailwind CSS").
2. Do not translate user messages automatically unless explicitly requested.
3. STRICT SEPARATION OF PLANS VS EXECUTED ACTIONS:
   - YOU DO NOT HAVE DIRECT, SILENT WRITE ACCESS TO LOCAL PC FILES OR DEVICES.
   - You must NEVER claim that an action has already run or succeeded on Masum's PC, phone, or live web unless verified tool results are returned.
   - Always state clearly: "Here is my proposed plan. It has NOT been executed yet. You can launch it as a verified task."
4. STRUCTURED PROPOSED PLAN:
   Whenever the user's message requests an action, building something, running code, modifying files, or creating tasks, you MUST append a structured plan at the very end of your response inside a code block tagged:
\`\`\`json:masum_plan
{
  "title": "Short title in English",
  "description": "Short summary of what this task will accomplish in English",
  "category": "web_dev" | "coding" | "windows" | "android" | "research" | "file_management",
  "target": "cloud" | "windows" | "android",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "proposedSteps": ["Step 1", "Step 2", "Step 3"],
  "suggestedTools": ["web_dev_sandbox" | "windows_companion_bridge" | "android_push_bridge" | "code_debugger"],
  "requiresApproval": boolean,
  "commandSnippet": "optional shell or code command to preview"
}
\`\`\`
CRITICAL SAFETY: If the action modifies sensitive files (.env, configs), deletes files, formats drives, or executes dangerous commands, set "riskLevel": "critical" and "requiresApproval": true.`;

  if (!hasKey || !client) {
    res.status(503).json({
      error: 'GEMINI_API_KEY_MISSING',
      message: 'GEMINI_API_KEY is not configured on the server. Please add your GEMINI_API_KEY to the Google AI Studio Secrets panel or server environment to activate real Gemini AI conversations.',
      hasKey: false
    });
    return;
  }

  try {
    // Build conversation contents with history for multi-turn context
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-12)) {
        if (item.sender === 'user' && item.text) {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'ai' && item.text) {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const rawReply = response.text || '';

    // Extract structured proposed plan if present
    let cleanReply = rawReply;
    let proposedPlan: any = null;

    const planMatch = rawReply.match(/```json:masum_plan\s*([\s\S]*?)\s*```/);
    if (planMatch) {
      try {
        proposedPlan = JSON.parse(planMatch[1]);
        cleanReply = rawReply.replace(/```json:masum_plan\s*([\s\S]*?)\s*```/, '').trim();
      } catch (err) {
        console.error('Failed to parse masum_plan JSON from Gemini response:', err);
      }
    }

    // If no explicit JSON block was provided, but action keywords detected, generate plan
    const lower = message.toLowerCase();
    if (!proposedPlan && (lower.includes('task') || lower.includes('build') || lower.includes('create') || lower.includes('run') || lower.includes('file') || lower.includes('git') || lower.includes('website') || lower.includes('app') || lower.includes('design') || lower.includes('banaye') || lower.includes('kore'))) {
      const isDangerous = lower.includes('delete') || lower.includes('overwrite') || lower.includes('format') || lower.includes('drop');
      proposedPlan = {
        title: `Action: ${message.slice(0, 40)}`,
        titleBn: `Action: ${message.slice(0, 40)}`,
        description: message,
        descriptionBn: message,
        category: lower.includes('windows') ? 'windows' : lower.includes('phone') || lower.includes('android') ? 'android' : 'web_dev',
        target: lower.includes('windows') ? 'windows' : lower.includes('android') ? 'android' : 'cloud',
        riskLevel: isDangerous ? 'critical' : 'low',
        proposedSteps: ['Verify prerequisites', 'Run execution in sandbox', 'Audit results'],
        proposedStepsBn: ['Verify prerequisites', 'Run execution in sandbox', 'Audit results'],
        suggestedTools: [lower.includes('windows') ? 'windows_companion_bridge' : 'web_dev_sandbox'],
        requiresApproval: isDangerous
      };
    }

    res.json({
      reply: cleanReply,
      source: 'gemini-3.8-flash',
      hasKey: true,
      timestamp: new Date().toISOString(),
      proposedPlan,
      suggestedTask: proposedPlan ? {
        title: proposedPlan.title,
        titleBn: proposedPlan.title,
        description: proposedPlan.description,
        descriptionBn: proposedPlan.description,
        category: proposedPlan.category,
        target: proposedPlan.target,
        riskLevel: proposedPlan.riskLevel,
        requiresApproval: proposedPlan.requiresApproval,
        commandSnippet: proposedPlan.commandSnippet
      } : null
    });
    return;
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    const errorMsg = err?.message || 'Gemini API call failed';
    res.status(500).json({
      error: 'GEMINI_API_ERROR',
      message: `Gemini API request failed: ${errorMsg}`,
      details: errorMsg,
      hasKey: true
    });
    return;
  }
});

// 3. Tasks Endpoints
app.get('/api/tasks', (req: Request, res: Response) => {
  const { status, category, target } = req.query;
  let filtered = [...tasks];
  if (status && typeof status === 'string' && status !== 'all') {
    filtered = filtered.filter(t => t.status === status);
  }
  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(t => t.category === category);
  }
  if (target && typeof target === 'string' && target !== 'all') {
    filtered = filtered.filter(t => t.target === target);
  }
  res.json({ tasks: filtered });
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, titleBn, description, descriptionBn, category = 'web_dev', target = 'cloud', riskLevel = 'low', codeSnippet, commandSnippet } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Task title is required' });
    return;
  }

  // Automatic Risk Assessment: Delete, overwrite, format, install commands must be High/Critical and require approval
  const textToCheck = `${title} ${description || ''} ${commandSnippet || ''}`.toLowerCase();
  const isDangerous = textToCheck.includes('delete') ||
    textToCheck.includes('overwrite') ||
    textToCheck.includes('rm -rf') ||
    textToCheck.includes('format') ||
    textToCheck.includes('drop') ||
    textToCheck.includes('publish') ||
    textToCheck.includes('ডিলিট') ||
    riskLevel === 'critical' ||
    riskLevel === 'high';

  const evaluatedRisk = isDangerous ? (riskLevel === 'critical' ? 'critical' : 'high') : riskLevel;
  const requiresApproval = isDangerous || evaluatedRisk === 'high' || evaluatedRisk === 'critical';

  const newTask: TaskItem = {
    id: `task-${Date.now().toString().slice(-5)}`,
    title,
    titleBn: titleBn || title,
    description: description || '',
    descriptionBn: descriptionBn || description || '',
    category,
    target,
    status: requiresApproval ? 'needs_approval' : 'running',
    riskLevel: evaluatedRisk,
    requiresApproval,
    steps: [
      { id: 's1', title: 'Task verification & security audit', titleBn: 'টাস্ক যাচাই ও নিরাপত্তা অডিট', status: 'completed' },
      { id: 's2', title: requiresApproval ? 'Awaiting owner approval in Approval Center' : 'Executing requested steps', titleBn: requiresApproval ? 'অ্যাপ্রুভাল সেন্টারে মালিকের অনুমোদনের অপেক্ষা' : 'প্রদত্ত ধাপসমূহ কার্যকর করা হচ্ছে', status: requiresApproval ? 'pending' : 'running' },
      { id: 's3', title: 'Verify outcome & log audit trial', titleBn: 'ফলাফল যাচাই ও অডিট লগ সংরক্ষণ', status: 'pending' }
    ],
    logs: [
      { timestamp: new Date().toISOString(), level: 'info', message: `Task created. Target: ${target}. Risk: ${evaluatedRisk.toUpperCase()}.` },
      ...(requiresApproval ? [{ timestamp: new Date().toISOString(), level: 'warn' as const, message: 'DANGER/SENSITIVE ACTION: Paused until Owner explicitly grants approval.' }] : [])
    ],
    codeSnippet,
    commandSnippet,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.unshift(newTask);

  // If safe and running, auto-complete it after a brief delay
  if (!requiresApproval) {
    setTimeout(() => {
      const idx = tasks.findIndex(t => t.id === newTask.id);
      if (idx !== -1 && tasks[idx].status === 'running') {
        tasks[idx].status = 'completed';
        tasks[idx].steps.forEach(s => s.status = 'completed');
        tasks[idx].logs.push({
          timestamp: new Date().toISOString(),
          level: 'success',
          message: 'Task completed successfully with all steps verified.'
        });
        tasks[idx].updatedAt = new Date().toISOString();
      }
    }, 4000);
  }

  res.status(201).json({ task: newTask });
});

// 4. Task Approval & Rejection (CRITICAL REQUIREMENT: Backend checked!)
app.post('/api/tasks/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  if (task.status !== 'needs_approval') {
    res.status(400).json({ error: `Task status is '${task.status}', not 'needs_approval'` });
    return;
  }

  task.approvedByOwner = true;
  task.status = 'running';
  task.steps[1].status = 'completed';
  task.steps[2].status = 'running';
  task.logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Owner approval verified by backend security guard. Execution started.'
  });
  task.updatedAt = new Date().toISOString();

  // Simulate execution and completion
  setTimeout(() => {
    task.status = 'completed';
    task.steps[2].status = 'completed';
    task.logs.push({
      timestamp: new Date().toISOString(),
      level: 'success',
      message: 'Approved sensitive action completed safely.'
    });
    task.updatedAt = new Date().toISOString();
  }, 2500);

  res.json({ success: true, task });
});

app.post('/api/tasks/:id/reject', (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason = 'Rejected by owner in security review' } = req.body;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  task.status = 'cancelled';
  task.approvedByOwner = false;
  task.steps[1].status = 'failed';
  task.logs.push({
    timestamp: new Date().toISOString(),
    level: 'warn',
    message: `Task rejected by owner: ${reason}. Execution blocked permanently.`
  });
  task.updatedAt = new Date().toISOString();

  res.json({ success: true, task });
});

app.post('/api/tasks/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  task.status = 'cancelled';
  task.logs.push({
    timestamp: new Date().toISOString(),
    level: 'warn',
    message: 'Task manually cancelled by user.'
  });
  task.updatedAt = new Date().toISOString();

  res.json({ success: true, task });
});

app.post('/api/tasks/:id/retry', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  task.status = task.requiresApproval && !task.approvedByOwner ? 'needs_approval' : 'running';
  task.steps.forEach(s => s.status = 'pending');
  task.steps[0].status = 'completed';
  task.logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Task reset and queued for re-execution.'
  });
  task.updatedAt = new Date().toISOString();

  res.json({ success: true, task });
});

// 5. Windows Companion Bridge APIs (DEMO & Architecture)
app.get('/api/windows-companion/status', (req: Request, res: Response) => {
  res.json(windowsCompanion);
});

app.post('/api/windows-companion/toggle-connect', (req: Request, res: Response) => {
  windowsCompanion.status = windowsCompanion.status === 'connected' ? 'standby' : 'connected';
  windowsCompanion.lastHeartbeat = new Date().toISOString();
  windowsCompanion.logs.push({
    timestamp: new Date().toISOString(),
    message: `Companion connection status toggled to: ${windowsCompanion.status}`
  });
  res.json(windowsCompanion);
});

app.post('/api/windows-companion/execute-command', (req: Request, res: Response) => {
  const { command } = req.body;

  if (!command) {
    res.status(400).json({ error: 'Command string is required' });
    return;
  }

  // Security check against allowlist
  const isAllowlisted = windowsCompanion.allowlistedCommands.some(cmd =>
    command.trim() === cmd || command.trim().startsWith(cmd + ' ')
  );

  if (!isAllowlisted) {
    res.status(403).json({
      success: false,
      error: `Command '${command}' is NOT in the Windows Companion security allowlist. Run requires explicit approval or allowlist update.`,
      errorBn: `কমান্ড '${command}' উইন্ডোজ কম্প্যানিয়নের অনুমোদিত তালিকায় নেই। নিরাপত্তার কারণে বাতিল করা হয়েছে।`
    });
    return;
  }

  let simulatedOutput = '';
  if (command.includes('git status')) {
    simulatedOutput = `On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  modified:   src/App.tsx\n\nno changes added to commit (use "git add" to update)`;
  } else if (command.includes('npm run dev')) {
    simulatedOutput = `> masum-workspace@1.0.0 dev\n> vite --port 5173\n\n  VITE v5.4.2  ready in 240 ms\n  ➜  Local:   http://localhost:5173/\n  ➜  Network: use --host to expose`;
  } else if (command.includes('node -v')) {
    simulatedOutput = `v20.16.0`;
  } else if (command.includes('python --version')) {
    simulatedOutput = `Python 3.11.8`;
  } else {
    simulatedOutput = `Command executed successfully inside sandbox:\nC:\\Users\\Masum\\Projects\\masum-workspace>\n[Exit code: 0]`;
  }

  windowsCompanion.logs.push({
    timestamp: new Date().toISOString(),
    message: `Executed allowlisted command: "${command}"`
  });

  res.json({
    success: true,
    command,
    output: simulatedOutput,
    timestamp: new Date().toISOString()
  });
});

// 6. Android Companion Bridge APIs
app.get('/api/android-companion/status', (req: Request, res: Response) => {
  res.json(androidCompanion);
});

app.post('/api/android-companion/send-ping', (req: Request, res: Response) => {
  const { message = 'Test ping from Masum AI Web Hub' } = req.body;
  androidCompanion.lastPing = new Date().toISOString();
  res.json({
    success: true,
    message: `Push notification dispatched to ${androidCompanion.deviceName}`,
    payload: {
      title: 'Masum AI Ping',
      body: message,
      sentAt: androidCompanion.lastPing
    }
  });
});

// 7. Specialized Code Generator API for Website Development
app.post('/api/dev/generate-website', async (req: Request, res: Response) => {
  const { prompt, tech = 'react', language = 'bn' } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const { client } = getGenAI();
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{
              text: `Generate a production-grade single-file component or HTML template based on this request: "${prompt}".
Tech stack requested: ${tech}.
Language for commentary/explanation: ${language === 'bn' ? 'Bangla (বাংলা)' : 'English'}.
Requirements:
1. Provide valid, modern, visually stunning Tailwind CSS styled code.
2. If HTML, provide complete standalone HTML with Tailwind CDN. If React, provide a self-contained functional component with Lucide icon references and sample data.
3. Include brief step-by-step beginner guide in Bangla on how to test and run this on a PC or deployment.`
            }]
          }
        ]
      });

      res.json({
        code: response.text || '',
        tech,
        source: 'gemini-3.8-flash'
      });
      return;
    } catch (e: any) {
      console.error('Code gen error:', e);
    }
  }

  // Fallback demo code
  const demoCode = tech === 'html' ? `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Masum AI - ${prompt.slice(0, 30)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #050811; color: #f8fafc; font-family: sans-serif; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6">
  <div class="max-w-xl w-full p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
      <span class="text-xs uppercase tracking-widest text-cyan-400 font-mono">Masum AI Web Template</span>
    </div>
    <h1 class="text-3xl font-bold text-white mb-4">${prompt}</h1>
    <p class="text-slate-400 leading-relaxed mb-6">
      Generated automatically by Masum AI Engine. Built with responsive Tailwind CSS classes.
    </p>
    <div class="flex gap-4">
      <button class="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-colors">
        Live Action
      </button>
      <button class="px-5 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
        Learn More
      </button>
    </div>
  </div>
</body>
</html>` : `// React Component generated for: ${prompt}
import React, { useState } from 'react';

export default function GeneratedWidget() {
  const [active, setActive] = useState(false);

  return (
    <div className="p-6 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-cyan-400">${prompt}</h2>
        <span className="text-xs font-mono px-2 py-1 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
          React + Tailwind
        </span>
      </div>
      <p className="text-slate-300 mb-6 text-sm">
        সম্পূর্ণ রেসপনসিভ এবং ইন্টারেক্টিভ মডিউল। বাটন চাপলে ইন্টার‍্যাকশন পরীক্ষা করা যাবে।
      </p>
      <button
        onClick={() => setActive(!active)}
        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold rounded-lg shadow hover:opacity-90 transition-all"
      >
        {active ? 'অ্যাক্টিভেটেড (Active)' : 'চালু করুন (Click to Run)'}
      </button>
      {active && (
        <div className="mt-4 p-3 bg-slate-950 border border-emerald-500/40 rounded text-emerald-400 text-xs font-mono">
          ✓ মডিউল সফলভাবে কার্যকর হয়েছে!
        </div>
      )}
    </div>
  );
}`;

  res.json({
    code: demoCode,
    tech,
    source: 'local-demo'
  });
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Masum AI Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
