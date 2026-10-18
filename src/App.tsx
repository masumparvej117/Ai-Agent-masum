import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CyberCommandBackground } from './components/CyberCommandBackground';
import { CommandCenterHero } from './components/CommandCenterHero';
import { ChatView } from './components/ChatView';
import { WebsiteDevView } from './components/WebsiteDevView';
import { CodingAssistantView } from './components/CodingAssistantView';
import { ResearchView } from './components/ResearchView';
import { FileManagerView } from './components/FileManagerView';
import { WindowsAgentView } from './components/WindowsAgentView';
import { AndroidAgentView } from './components/AndroidAgentView';
import { ApprovalCenterView } from './components/ApprovalCenterView';
import { TaskHistoryView } from './components/TaskHistoryView';
import { SettingsSecurityView } from './components/SettingsSecurityView';
import { NewTaskModal } from './components/NewTaskModal';
import { NavigationTab, Language, TaskItem, SystemHealth } from './types';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('command-center');
  const [language, setLanguage] = useState<Language>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [suggestedTaskForModal, setSuggestedTaskForModal] = useState<Partial<TaskItem> | null>(null);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  const fetchTasksAndHealth = async () => {
    try {
      const [fetchedTasks, fetchedHealth] = await Promise.all([
        api.getTasks(),
        api.getSystemHealth()
      ]);
      setTasks(fetchedTasks);
      setHealth(fetchedHealth);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    fetchTasksAndHealth();
    const interval = setInterval(fetchTasksAndHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingApprovalsCount = tasks.filter((t) => t.status === 'needs_approval').length;
  const activeTasksCount = tasks.filter((t) => t.status === 'running').length;

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleCreateTask = async (taskData: Partial<TaskItem>) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      if (newTask.status === 'needs_approval') {
        setActiveTab('approval-center');
      } else {
        setActiveTab('task-history');
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const updated = await api.approveTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to approve task:', err);
    }
  };

  const handleReject = async (id: string, reason?: string) => {
    try {
      const updated = await api.rejectTask(id, reason);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to reject task:', err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const updated = await api.cancelTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to cancel task:', err);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      const updated = await api.retryTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to retry task:', err);
    }
  };

  const handleEmergencyStop = () => {
    tasks
      .filter((t) => t.status === 'running')
      .forEach((t) => handleCancel(t.id));
  };

  const handlePlanTaskFromChat = (suggestedTask: Partial<TaskItem>) => {
    setSuggestedTaskForModal(suggestedTask);
    setIsNewTaskModalOpen(true);
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#040712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Global Three.js Cyberpunk AI Command Center Background */}
      <CyberCommandBackground />

      {/* 2. Glassmorphic Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        pendingApprovalsCount={pendingApprovalsCount}
        activeTasksCount={activeTasksCount}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
        onOpenNewTask={() => {
          setSuggestedTaskForModal(null);
          setIsNewTaskModalOpen(true);
        }}
      />

      {/* 3. Main Workspace Area (Floating Glassmorphism Panels) */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          language={language}
          onToggleLanguage={handleToggleLanguage}
          pendingApprovals={pendingApprovalsCount}
          activeTasks={activeTasksCount}
          onOpenApprovalCenter={() => setActiveTab('approval-center')}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onEmergencyStop={handleEmergencyStop}
          onNavigateToCommandCenter={() => setActiveTab('command-center')}
          windowsStatus={health?.windowsCompanionStatus || 'standby'}
          androidStatus={health?.androidCompanionStatus || 'paired'}
        />

        {/* Tab Content Viewport */}
        <main className="flex-1 overflow-y-auto relative z-10">
          {activeTab === 'command-center' && (
            <CommandCenterHero
              language={language}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenNewTask={() => {
                setSuggestedTaskForModal(null);
                setIsNewTaskModalOpen(true);
              }}
              pendingApprovals={pendingApprovalsCount}
              activeTasks={activeTasksCount}
              health={health}
            />
          )}

          {activeTab === 'chat' && (
            <ChatView
              language={language}
              onPlanTask={handlePlanTaskFromChat}
            />
          )}

          {activeTab === 'web-dev' && <WebsiteDevView language={language} />}

          {activeTab === 'coding' && <CodingAssistantView language={language} />}

          {activeTab === 'research' && <ResearchView language={language} />}

          {activeTab === 'file-manager' && <FileManagerView language={language} />}

          {activeTab === 'windows-agent' && <WindowsAgentView language={language} />}

          {activeTab === 'android-agent' && <AndroidAgentView language={language} />}

          {activeTab === 'approval-center' && (
            <ApprovalCenterView
              tasks={tasks}
              language={language}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeTab === 'task-history' && (
            <TaskHistoryView
              tasks={tasks}
              language={language}
              onRetry={handleRetry}
              onCancel={handleCancel}
              onOpenApproval={() => setActiveTab('approval-center')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsSecurityView
              language={language}
              onToggleLanguage={handleToggleLanguage}
            />
          )}
        </main>
      </div>

      {/* New Task Creation Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => {
          setIsNewTaskModalOpen(false);
          setSuggestedTaskForModal(null);
        }}
        language={language}
        onCreateTask={handleCreateTask}
        initialTask={suggestedTaskForModal}
      />
    </div>
  );
}
