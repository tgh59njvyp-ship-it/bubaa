import React, { useState, useEffect, useCallback } from 'react';
import { SmsNumber, SmsMessage } from './types';
import { INITIAL_NUMBERS, INITIAL_MESSAGES } from './data/mockNumbers';
import { Header } from './components/Header';
import { InboxView } from './components/InboxView';
import { NumberList } from './components/NumberList';
import { ServiceChecker } from './components/ServiceChecker';
import { ApiPlayground } from './components/ApiPlayground';
import { XTwitterGuide } from './components/XTwitterGuide';
import { SmsSimulatorModal } from './components/SmsSimulatorModal';
import { AiSecurityModal } from './components/AiSecurityModal';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { Bell, Sparkles, Check, Smartphone, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'xtwitter' | 'numbers' | 'checker' | 'api'>('inbox');
  const [numbers, setNumbers] = useState<SmsNumber[]>(INITIAL_NUMBERS);
  const [selectedNumberId, setSelectedNumberId] = useState<string>(INITIAL_NUMBERS[0].id);
  const [messages, setMessages] = useState<SmsMessage[]>(INITIAL_MESSAGES);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Controls & Modals
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simulatorDefaultNumberId, setSimulatorDefaultNumberId] = useState<string | null>(null);
  const [isPrivacyNoticeOpen, setIsPrivacyNoticeOpen] = useState<boolean>(false);
  const [aiModalMessage, setAiModalMessage] = useState<SmsMessage | null>(null);

  // Toast alert for newly arrived SMS
  const [newSmsToast, setNewSmsToast] = useState<{ sender: string; otp?: string } | null>(null);

  // Fetch numbers from API
  const fetchNumbers = useCallback(async () => {
    try {
      const res = await fetch('/api/numbers');
      if (res.ok) {
        const data = await res.json();
        setNumbers(data);
      }
    } catch {
      // fallback to current local state
    }
  }, []);

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    setIsRefreshing(true);
    try {
      let url = `/api/messages?numberId=${selectedNumberId}&category=${selectedCategory}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data: SmsMessage[] = await res.json();
        setMessages(data);
      }
    } catch {
      // fallback
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedNumberId, selectedCategory, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchNumbers();
    fetchMessages();
  }, [fetchNumbers, fetchMessages]);

  // Auto polling every 5s when enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchMessages]);

  // Handle simulation SMS send
  const handleSendTestSms = async (
    numberId: string,
    sender: string,
    body: string,
    category: string
  ) => {
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numberId,
          sender,
          body,
          serviceCategory: category,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        // Refresh messages immediately
        await fetchMessages();
        await fetchNumbers();

        // Show toast
        setNewSmsToast({
          sender: result.message.sender,
          otp: result.message.otpCode,
        });
        setTimeout(() => setNewSmsToast(null), 4000);

        // Switch to inbox view if on other tab
        if (activeTab !== 'inbox') {
          setActiveTab('inbox');
        }
        setSelectedNumberId(numberId);
      }
    } catch (err) {
      console.error('Failed to send test SMS:', err);
    }
  };

  const handleOpenSimulatorForNumber = (numId: string) => {
    setSimulatorDefaultNumberId(numId);
    setIsSimulatorOpen(true);
  };

  const handleSendTestXMessage = (numberId: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    handleSendTestSms(
      numberId,
      'X (Twitter)',
      `Twitter/Xの認証コードは ${otp} です。誰とも共有しないでください。`,
      'twitter'
    );
  };

  const activeNumberObj = numbers.find((n) => n.id === selectedNumberId) || numbers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulator={() => handleOpenSimulatorForNumber(selectedNumberId)}
        onOpenPrivacyNotice={() => setIsPrivacyNoticeOpen(true)}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        onManualRefresh={fetchMessages}
        isRefreshing={isRefreshing}
        totalMessagesCount={messages.length}
      />

      {/* Toast Notification */}
      {newSmsToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-900/95 border border-indigo-400/50 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
              ⚡ 新規SMSを受信しました！ ({newSmsToast.sender})
            </span>
            {newSmsToast.otp && (
              <span className="text-sm font-mono font-black text-emerald-300">
                抽出コード: {newSmsToast.otp}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'inbox' && (
          <InboxView
            numbers={numbers}
            selectedNumber={activeNumberObj}
            onSelectNumber={(id) => {
              setSelectedNumberId(id);
            }}
            messages={messages}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onRefresh={fetchMessages}
            isRefreshing={isRefreshing}
            onOpenSimulatorForNumber={handleOpenSimulatorForNumber}
            onAnalyzeMessage={(msg) => setAiModalMessage(msg)}
          />
        )}

        {activeTab === 'xtwitter' && (
          <XTwitterGuide
            numbers={numbers}
            messages={messages}
            onSelectNumberAndInbox={(numId) => {
              setSelectedNumberId(numId);
              setActiveTab('inbox');
            }}
            onSendTestXMessage={handleSendTestXMessage}
            onRefresh={fetchMessages}
            isRefreshing={isRefreshing}
          />
        )}

        {activeTab === 'numbers' && (
          <NumberList
            numbers={numbers}
            selectedNumberId={selectedNumberId}
            onSelectNumber={(id) => {
              setSelectedNumberId(id);
              setActiveTab('inbox');
            }}
            onOpenSimulatorForNumber={handleOpenSimulatorForNumber}
          />
        )}

        {activeTab === 'checker' && <ServiceChecker />}

        {activeTab === 'api' && <ApiPlayground />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-400">
              JP SMS Receive — 日本国内向け仮番号・SMS認証確認プラットフォーム
            </span>
          </div>

          <p className="text-slate-500">
            完全公開共有番号のため、個人情報・金融サービスの登録には利用できません。
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SmsSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        numbers={numbers}
        defaultNumberId={simulatorDefaultNumberId}
        onSendSms={handleSendTestSms}
      />

      <AiSecurityModal
        isOpen={!!aiModalMessage}
        onClose={() => setAiModalMessage(null)}
        message={aiModalMessage}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyNoticeOpen}
        onClose={() => setIsPrivacyNoticeOpen(false)}
      />
    </div>
  );
}
