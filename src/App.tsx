import { useState } from 'react';
import { FuelEntryForm } from './components/FuelEntryForm';
import { Dashboard } from './components/Dashboard';
import { HistoryTable } from './components/HistoryTable';
import { SettingsEditor } from './components/SettingsEditor';
import { Login } from './components/Login';
import { useSettings } from './hooks/useSettings';
import { useRefuelReceipts } from './hooks/useRefuelReceipts';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Fuel, LayoutDashboard, History, Settings as SettingsIcon, LogOut } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'history' | 'settings'>('dashboard');
  const { currentUser, logout } = useAuth();
  const { receipts, loading, error, addReceipt, deleteReceipt } = useRefuelReceipts();
  const { settings, updateSettings } = useSettings();

  if (!currentUser) {
    return <Login />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <p className="text-sm text-muted-foreground">
            Please check your Firebase configuration in .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Family Fuel Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {currentUser.email}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'add'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Fuel className="h-4 w-4" />
              Add Refuel
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'history'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="h-4 w-4" />
              History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard receipts={receipts} settings={settings} />
        )}
        {activeTab === 'add' && (
          <FuelEntryForm onSubmit={addReceipt} settings={settings} />
        )}
        {activeTab === 'history' && (
          <HistoryTable
            receipts={receipts}
            currency={settings.currency}
            onDelete={deleteReceipt}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsEditor settings={settings} onUpdate={updateSettings} />
        )}
      </main>

      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Family Fuel Tracker - Track your fuel costs efficiently
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
