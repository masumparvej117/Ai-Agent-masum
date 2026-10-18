import {
  TaskItem,
  WindowsCompanionState,
  AndroidCompanionState,
  SystemHealth,
  Language
} from '../types';

export const api = {
  // System Health
  async getSystemHealth(): Promise<SystemHealth> {
    const res = await fetch('/api/system/health');
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  // AI Chat
  async sendChatMessage(
    message: string,
    history: Array<{ sender: 'user' | 'ai'; text: string }>,
    language: Language
  ): Promise<{
    reply: string;
    source: string;
    timestamp: string;
    suggestedTask?: Partial<TaskItem> | null;
    proposedPlan?: import('../types').ProposedPlan | null;
    error?: string;
  }> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errMsg = data?.message || data?.error || `Chat request failed with status ${res.status}`;
      const err: any = new Error(errMsg);
      err.errorType = data?.error;
      err.hasKey = data?.hasKey;
      throw err;
    }
    return data;
  },

  // Tasks
  async getTasks(filters?: { status?: string; category?: string; target?: string }): Promise<TaskItem[]> {
    const query = new URLSearchParams();
    if (filters?.status) query.set('status', filters.status);
    if (filters?.category) query.set('category', filters.category);
    if (filters?.target) query.set('target', filters.target);

    const res = await fetch(`/api/tasks?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    return data.tasks || [];
  },

  async createTask(taskData: Partial<TaskItem>): Promise<TaskItem> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (!res.ok) throw new Error('Failed to create task');
    const data = await res.json();
    return data.task;
  },

  async approveTask(id: string): Promise<TaskItem> {
    const res = await fetch(`/api/tasks/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Approval request failed');
    const data = await res.json();
    return data.task;
  },

  async rejectTask(id: string, reason?: string): Promise<TaskItem> {
    const res = await fetch(`/api/tasks/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Rejection request failed');
    const data = await res.json();
    return data.task;
  },

  async cancelTask(id: string): Promise<TaskItem> {
    const res = await fetch(`/api/tasks/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Cancel request failed');
    const data = await res.json();
    return data.task;
  },

  async retryTask(id: string): Promise<TaskItem> {
    const res = await fetch(`/api/tasks/${id}/retry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Retry request failed');
    const data = await res.json();
    return data.task;
  },

  // Windows Companion
  async getWindowsCompanion(): Promise<WindowsCompanionState> {
    const res = await fetch('/api/windows-companion/status');
    if (!res.ok) throw new Error('Failed to get Windows companion status');
    return res.json();
  },

  async toggleWindowsConnect(): Promise<WindowsCompanionState> {
    const res = await fetch('/api/windows-companion/toggle-connect', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Toggle connect failed');
    return res.json();
  },

  async executeWindowsCommand(command: string): Promise<{ success: boolean; output: string; error?: string; errorBn?: string }> {
    const res = await fetch('/api/windows-companion/execute-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });
    return res.json();
  },

  // Android Companion
  async getAndroidCompanion(): Promise<AndroidCompanionState> {
    const res = await fetch('/api/android-companion/status');
    if (!res.ok) throw new Error('Failed to get Android companion status');
    return res.json();
  },

  async sendAndroidPing(message?: string): Promise<{ success: boolean; message: string; payload: any }> {
    const res = await fetch('/api/android-companion/send-ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Ping failed');
    return res.json();
  },

  // Website Code Generator
  async generateWebsiteCode(prompt: string, tech: string = 'react', language: Language = 'bn'): Promise<{ code: string; tech: string; source: string }> {
    const res = await fetch('/api/dev/generate-website', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, tech, language })
    });
    if (!res.ok) throw new Error('Failed to generate code');
    return res.json();
  }
};
