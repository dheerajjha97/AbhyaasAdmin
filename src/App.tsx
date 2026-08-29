/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileHeader } from './components/layout/MobileHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { SidebarDesktop } from './components/layout/SidebarDesktop';
import { MoreMenuSheet } from './components/layout/MoreMenuSheet';
import { DeviceFrameWrapper } from './components/common/DeviceFrameWrapper';

// Views
import { MobileDashboard } from './components/dashboard/MobileDashboard';
import { PapersList } from './components/papers/PapersList';
import { QuestionEditor } from './components/questions/QuestionEditor';
import { GeminiGenerationView } from './components/ai/GeminiGenerationView';
import { AnswerReviewView } from './components/ai/AnswerReviewView';
import { SyllabusView } from './components/syllabus/SyllabusView';
import { NotesView } from './components/notes/NotesView';
import { JsonImportView } from './components/json/JsonImportView';
import { JsonExportView } from './components/json/JsonExportView';
import { GitHubPublishView } from './components/publish/GitHubPublishView';
import { ClassesSubjectsView } from './components/classes/ClassesSubjectsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'papers':
      case 'questions':
        return <PapersList />;
      case 'editor':
        return <QuestionEditor />;
      case 'ai':
        return <GeminiGenerationView />;
      case 'review':
        return <AnswerReviewView />;
      case 'syllabus':
        return <SyllabusView />;
      case 'notes':
        return <NotesView />;
      case 'import':
        return <JsonImportView />;
      case 'export':
        return <JsonExportView />;
      case 'publish':
        return <GitHubPublishView />;
      case 'classes':
      case 'subjects':
        return <ClassesSubjectsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MobileDashboard />;
    }
  };

  return (
    <DeviceFrameWrapper>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
        {/* Desktop Enhanced Sidebar (hidden on mobile, visible on lg:) */}
        <SidebarDesktop />

        {/* Primary Content Container (Mobile-First 360px–430px priority) */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          <MobileHeader />

          <main className="flex-1 max-w-xl lg:max-w-4xl mx-auto w-full px-3.5 pt-3.5 pb-24 lg:pb-12">
            {renderActiveView()}
          </main>

          {/* Mobile Bottom Navigation (Home, Papers, AI, More) */}
          <BottomNavigation />

          {/* More Drawer Sheet */}
          <MoreMenuSheet />
        </div>
      </div>
    </DeviceFrameWrapper>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
