import { Language } from '../types';

export const englishDictionary = {
  appName: 'Masum AI',
  appSubtitle: 'Personal Autonomous AI Agent & Command Center',
  ownerBadge: 'Owner: Masum (Developer)',
  systemReady: 'System Operational',
  demoBadge: 'DEMO BRIDGE',
  cloudEngine: 'Cloud Core',
  quickStatus: 'Status',

  // Navigation Tabs (English Only)
  navCommandCenter: 'Command Center',
  navChat: 'AI Chat',
  navNewTask: 'New Task',
  navWebDev: 'Website Development',
  navCoding: 'Coding Assistant',
  navResearch: 'Research & Search',
  navFileManager: 'File Manager',
  navWindowsAgent: 'Windows Agent',
  navAndroidAgent: 'Android Agent',
  navApprovalCenter: 'Approval Center',
  navTaskHistory: 'Task History',
  navSettings: 'Settings & Security',

  // Header & Stats
  totalTasks: 'Total Tasks',
  pendingApprovals: 'Pending Approvals',
  activeRunning: 'Running Tasks',
  emergencyStop: 'Emergency Stop',
  multilingualBadge: 'Multilingual AI Engine',

  // Companion Badges
  winCompanion: 'Windows PC Bridge',
  androidCompanion: 'Android Phone Link',
  connected: 'Connected',
  standby: 'Standby',
  disconnected: 'Disconnected',
  paired: 'Paired',

  // Chat Interface
  chatPlaceholder: 'Ask Masum AI in any language (English, Bangla, Banglish, Hindi, Arabic)...',
  chatSend: 'Send Message',
  chatClear: 'Clear Chat',
  chatVoiceListening: 'Listening to your speech...',
  chatVoiceStart: 'Start voice input (Speech-to-Text)',
  chatVoiceStop: 'Stop voice input',
  chatWelcomeTitle: 'Welcome Masum! I am your personal AI agent (Masum AI).',
  chatWelcomeDesc: 'Powered securely on the server by Google GenAI (Gemini-3.8-Flash). I understand any language you use—English, Bangla (বাংলা), Banglish (e.g. "Amar website design kore dao"), Hindi, Arabic, and more. I automatically detect your language and reply in the matching language.',
  suggestedPromptsTitle: 'Multilingual Test Prompts:',
  prompt1: 'Amar website design kore dao.',
  prompt2: 'Create a modern portfolio website.',
  prompt3: 'আমার কম্পিউটারের ফাইলগুলো সাজিয়ে দাও।',
  prompt4: 'React e ekta responsive navbar banaye dao with Tailwind',
  createTaskFromPrompt: 'Launch Plan as Verified Task',

  // Approval Center
  approvalTitle: 'Security Approval Center',
  approvalSubtitle: 'Explicit owner authorization required before deleting files, executing sensitive shell commands, or overwriting configurations.',
  noPendingApprovals: 'No pending approvals. All systems operating securely.',
  approveBtn: 'Approve & Execute',
  rejectBtn: 'Reject & Block',
  cancel: 'Cancel',
  criticalRiskWarning: 'Critical Risk Alert: This task requests modification or overwrite of system resources. Backend security guard requires owner confirmation.',
  requiresApprovalBadge: 'Owner Approval Required',
  riskLevel: 'Risk Level',
  targetDevice: 'Target Device',

  // Website Development
  webDevTitle: 'Website Development Workspace',
  webDevSubtitle: 'Interactive code generator for React, Next.js, and HTML5 with live responsive sandbox iframe and SEO inspection.',
  genPromptPlaceholder: 'e.g., A futuristic cyberpunk landing page, crypto dashboard, or portfolio hero...',
  generateCodeBtn: 'Generate Code',
  generating: 'Generating Code...',
  livePreviewTab: 'Live Preview (Sandbox)',
  sourceCodeTab: 'Source Code',
  projectFilesTab: 'Project File Tree',
  seoAuditTab: 'SEO & Responsive Audit',
  copyCode: 'Copy Code',
  downloadCode: 'Download File',
  deployGuide: 'GitHub & Deployment Guide',
  disclaimerLocalFiles: 'Note: Web browser has sandboxed execution. Files will only be synced to your local PC through the authorized Windows Companion Bridge.',

  // Windows Companion
  winTitle: 'Windows Companion Architecture (PC Bridge)',
  winSubtitle: 'Secure local companion agent architecture for executing allowlisted development commands and reading approved project folders.',
  winStatusNotice: 'Security Notice: A web browser cannot silently access your local Windows file system. The companion runs a secure token-authenticated local bridge.',
  allowedDirsTitle: 'Allowlisted Project Directories (Sandbox):',
  allowlistCmdTitle: 'Allowlisted Development Commands:',
  runCommand: 'Execute Command',
  commandOutput: 'Terminal Console Output',
  downloadBridgeScript: 'View Companion PowerShell / Node.js Daemon Script',
  howItWorksTitle: 'Architecture Guide for Developers:',
  howItWorksDesc: '1. A lightweight companion daemon runs in your approved workspace on Windows.\n2. The web command center communicates via token-authenticated API endpoints.\n3. The companion only modifies files inside explicitly approved directories.\n4. Sensitive actions trigger approval prompts and immediate execution logs.',

  // Android Companion
  androidTitle: 'Android Companion Architecture (Mobile Link)',
  androidSubtitle: 'Remote push notifications, mobile security approvals, and device telemetry for your paired smartphone.',
  androidNotice: 'Security Architecture: Modern mobile operating systems strictly sandbox applications. Companion integration utilizes encrypted push notifications and Termux daemon bridges.',
  pairedDevice: 'Paired Device',
  batteryLevel: 'Battery Level',
  pairingPin: 'Pairing Security PIN',
  permissionsTitle: 'Granted Permission Matrix:',
  pushTestTitle: 'Test Remote Push Ping',
  sendPushBtn: 'Dispatch Push Notification',

  // Task History
  historyTitle: 'Task Queue & Audit Trail',
  historySubtitle: 'Inspect all autonomous execution logs, timestamps, step statuses, and rollback records.',
  filterAll: 'All Statuses',
  filterRunning: 'Running',
  filterCompleted: 'Completed',
  filterPending: 'Pending',
  filterNeedsApproval: 'Needs Approval',
  filterCancelled: 'Cancelled',
  taskSteps: 'Planned Steps',
  taskLogs: 'Execution Logs',
  retryBtn: 'Retry Task',
  cancelTaskBtn: 'Cancel Task',

  // New Task Modal
  newTaskTitle: 'Create Verified Mission Task',
  taskTitlePlaceholder: 'e.g. Scaffold Cyberpunk Hero Component',
  taskDescPlaceholder: 'Describe the task objective and requirements in detail...',
  taskCategory: 'Module Category',
  taskTarget: 'Execution Target',
  taskRisk: 'Risk Level Assessment',
  lowRisk: 'Low Risk',
  criticalRisk: 'Critical Risk',
  createTaskBtn: 'Create & Enqueue Task'
};

// Pure English interface text across all dictionary keys to guarantee zero Bangla UI chrome
export const translations: Record<Language, typeof englishDictionary> = {
  en: englishDictionary,
  bn: englishDictionary
};
