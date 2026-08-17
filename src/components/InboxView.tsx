import React, { useState } from 'react';
import { SmsNumber, SmsMessage } from '../types';
import {
  Smartphone,
  Copy,
  Check,
  Search,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Send,
  MessageSquare,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface InboxViewProps {
  numbers: SmsNumber[];
  selectedNumber: SmsNumber | null;
  onSelectNumber: (numberId: string) => void;
  messages: SmsMessage[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSimulatorForNumber: (numberId: string) => void;
  onAnalyzeMessage: (msg: SmsMessage) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  numbers,
  selectedNumber,
  onSelectNumber,
  messages,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onRefresh,
  isRefreshing,
  onOpenSimulatorForNumber,
  onAnalyzeMessage,
}) => {
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);
  const [copiedNum, setCopiedNum] = useState<boolean>(false);

  const handleCopyOtp = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedOtp(code);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const handleCopyNumber = (numText: string) => {
    navigator.clipboard.writeText(numText);
    setCopiedNum(true);
    setTimeout(() => setCopiedNum(false), 2000);
  };

  // Service categories for quick filter bar
  const categories = [
    { id: 'all', label: 'すべて' },
    { id: 'yahoo', label: 'Yahoo!' },
    { id: 'mercari', label: 'メルカリ' },
    { id: 'rakuten', label: '楽天' },
    { id: 'paypay', label: 'PayPay' },
    { id: 'amazon', label: 'Amazon' },
    { id: 'twitter', label: 'X/Twitter' },
    { id: 'discord', label: 'Discord' },
    { id: 'other', label: 'その他' },
  ];

  // Helper to format relative Japanese time
  const formatTimeAgo = (isoString: string) => {
    const diffSec = Math.max(1, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));

    if (diffSec < 60) return `${diffSec}秒前`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}分前`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}時間前`;
    return `${Math.floor(diffHour / 24)}日前`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Number Selector List (3 cols on lg) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/60 backdrop-blur">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              受信番号を切替 ({numbers.length}回線)
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">● ライブ受信用</span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {numbers.map((num) => {
              const isSelected = selectedNumber?.id === num.id;
              return (
                <div
                  key={num.id}
                  onClick={() => onSelectNumber(num.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-300">{num.carrier}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {num.region}
                    </span>
                  </div>
                  <div className="font-mono text-base font-bold text-white tracking-wider flex items-center justify-between">
                    <span>{num.numberLocal}</span>
                    {isSelected && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>本日 {num.messagesReceivedToday} 件受信</span>
                    <span className="text-emerald-400 font-medium">応答 ~{num.averageSpeedSec}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip Box */}
        <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-xl p-4 text-xs text-indigo-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-indigo-300">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>SMSコード受信のコツ</span>
          </div>
          <p className="text-indigo-200/80 leading-relaxed">
            番号を入力して送信後、5秒〜15秒以内にこの画面へ自動反映されます。反映されない場合は上部の「更新」ボタンを押してください。
          </p>
        </div>
      </div>

      {/* Right Main Area: Inbox Messages Thread (8 cols on lg) */}
      <div className="lg:col-span-8 space-y-5">
        {/* Active Number Banner */}
        {selectedNumber ? (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 border border-indigo-500/40 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    選択中の日本仮番号
                  </span>
                  <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {selectedNumber.carrier}・{selectedNumber.region}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black font-mono tracking-wider text-white">
                    {selectedNumber.numberLocal}
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    ({selectedNumber.numberIntl})
                  </span>
                </div>
              </div>

              {/* Copy & Send Test Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleCopyNumber(selectedNumber.numberLocal.replace(/-/g, '').substring(1))}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/40 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  title="X (Twitter) の国番号+81入力用 (頭の0を除外した番号)"
                >
                  <span className="w-4 h-4 bg-black rounded text-[10px] font-black text-white flex items-center justify-center">
                    𝕏
                  </span>
                  <span>𝕏用 (0抜き): {selectedNumber.numberLocal.replace(/-/g, '').substring(1)}</span>
                </button>

                <button
                  onClick={() => handleCopyNumber(selectedNumber.numberLocal)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  {copiedNum ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>コピー完了</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-400" />
                      <span>通常番号コピー</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onOpenSimulatorForNumber(selectedNumber.id)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>この番号へテストSMS送信</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Search & Category Filter Bar */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/60 backdrop-blur space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="送信者・メッセージ本文・認証コードで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Manual Refresh Trigger */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium border border-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>新着SMSを更新</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
            <span className="text-slate-400 font-medium text-[11px] shrink-0 mr-1">カテゴリ:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-10 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">
                該当するSMSメッセージはありません
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                「テストSMSを送信」ボタンから認証メッセージの擬似受信を試すことができます。
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700/80 transition-all shadow-sm space-y-3 group"
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-700/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {msg.sender.substring(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {msg.sender}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        受信番号: {numbers.find((n) => n.id === msg.numberId)?.numberLocal || ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {formatTimeAgo(msg.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Highlighted OTP Code Box if extracted */}
                {msg.otpCode && (
                  <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                          抽出された認証コード (OTP)
                        </span>
                        <span className="text-2xl font-mono font-black tracking-widest text-emerald-400">
                          {msg.otpCode}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleCopyOtp(msg.otpCode!, e)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 self-start sm:self-auto"
                    >
                      {copiedOtp === msg.otpCode ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-200" />
                          <span>コードをコピーしました</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-emerald-200" />
                          <span>コードを1タップコピー</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Body Text */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800 select-all">
                  {msg.body}
                </p>

                {/* Card Actions: AI Security Scan */}
                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onAnalyzeMessage(msg)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/80 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-slate-600 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Gemini AI フィッシング解析</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
