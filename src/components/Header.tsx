import React from 'react';
import { Smartphone, RefreshCw, ShieldAlert, Sparkles, Send, Code2, ListFilter, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'inbox' | 'xtwitter' | 'numbers' | 'checker' | 'api';
  setActiveTab: (tab: 'inbox' | 'xtwitter' | 'numbers' | 'checker' | 'api') => void;
  onOpenSimulator: () => void;
  onOpenPrivacyNotice: () => void;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  totalMessagesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulator,
  onOpenPrivacyNotice,
  autoRefresh,
  setAutoRefresh,
  onManualRefresh,
  isRefreshing,
  totalMessagesCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-lg">
      {/* Top Utility Bar */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            全6回線 正常稼働中
          </span>
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">
            日本国内向け 070 / 080 / 090 / 050 受信対応
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenPrivacyNotice}
            className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>プライバシー・注意事項</span>
          </button>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                JP SMS Receive
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                日本無料SMS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              登録不要・完全無料の仮仮想電話番号＆認証コードリアルタイム確認
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Refresh Control */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700/60">
            <button
              onClick={onManualRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              title="メッセージを更新"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">更新</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                autoRefresh
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="5秒間隔の自動更新切り替え"
            >
              自動更新 {autoRefresh ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* SMS Simulation Sender Trigger */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-indigo-200" />
            <span>テストSMSを送信</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 sm:space-x-6 overflow-x-auto no-scrollbar py-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>受信トレイ（SMS一覧）</span>
            <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-950 text-indigo-300 rounded-full text-[10px] border border-indigo-800">
              {totalMessagesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('xtwitter')}
            className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'xtwitter'
                ? 'bg-slate-800 text-white border border-indigo-500/60 font-semibold shadow-md ring-1 ring-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="w-4 h-4 bg-black border border-slate-700 rounded text-[10px] font-black text-white flex items-center justify-center">
              𝕏
            </span>
            <span>𝕏 (Twitter) 専用認証助手</span>
            <span className="ml-1 px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold">
              推奨
            </span>
          </button>

          <button
            onClick={() => setActiveTab('numbers')}
            className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'numbers'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ListFilter className="w-4 h-4 text-sky-400" />
            <span>番号一覧 (070/080/090/050)</span>
          </button>

          <button
            onClick={() => setActiveTab('checker')}
            className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'checker'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>サービス対応可否表</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'api'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>開発者API・連携</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
