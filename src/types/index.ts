export type Language = 'bn' | 'en';

export type NavigationTab =
  | 'command-center'
  | 'chat'
  | 'new-task'
  | 'web-dev'
  | 'coding'
  | 'research'
  | 'file-manager'
  | 'windows-agent'
  | 'android-agent'
  | 'approval-center'
  | 'task-history'
  | 'settings';

export type TaskStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'needs_approval';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type TaskCategory =
  | 'web_dev'
  | 'coding'
  | 'windows'
  | 'android'
  | 'research'
  | 'file_management';

export type TaskTarget = 'windows' | 'android' | 'cloud';

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
  category: TaskCategory;
  target: TaskTarget;
  status: TaskStatus;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  approvedByOwner?: boolean;
  steps: TaskStep[];
  logs: TaskLog[];
  codeSnippet?: string;
  commandSnippet?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposedPlan {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn?: string;
  category: TaskCategory;
  target: TaskTarget;
  riskLevel: RiskLevel;
  proposedSteps: string[];
  proposedStepsBn?: string[];
  suggestedTools: string[];
  requiresApproval: boolean;
  commandSnippet?: string;
  status?: 'unexecuted' | 'queued' | 'running' | 'completed';
  createdTaskId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  source?: string;
  suggestedTask?: Partial<TaskItem> | null;
  proposedPlan?: ProposedPlan | null;
  codeBlocks?: Array<{ language: string; code: string }>;
  isStreaming?: boolean;
  isError?: boolean;
  errorType?: 'missing_key' | 'api_error' | 'network_error';
  failedPrompt?: string;
}

export interface WindowsCompanionState {
  status: 'connected' | 'standby' | 'disconnected';
  version: string;
  host: string;
  ip: string;
  token: string;
  allowedDirectories: string[];
  allowlistedCommands: string[];
  lastHeartbeat: string;
  logs: Array<{ timestamp: string; message: string }>;
}

export interface AndroidCompanionState {
  status: 'paired' | 'scanning' | 'unpaired';
  deviceName: string;
  androidVersion: string;
  battery: number;
  pairingPin: string;
  permissions: {
    notifications: string;
    foregroundService: string;
    scopedStorage: string;
    deviceAutomation: string;
  };
  lastPing: string;
}

export interface SystemHealth {
  status: string;
  aiStatus: string;
  hasKey: boolean;
  model: string;
  uptime: number;
  tasksCount: number;
  pendingApprovals: number;
  windowsCompanionStatus: string;
  androidCompanionStatus: string;
  timestamp: string;
}
