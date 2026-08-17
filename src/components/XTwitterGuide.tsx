import React, { useState } from 'react';
import { SmsNumber, SmsMessage } from '../types';
import {
  Copy,
  Check,
  Send,
  Smartphone,
  KeyRound,
  Sparkles,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface XTwitterGuideProps {
  numbers: SmsNumber[];
  messages: SmsMessage[];
  onSelectNumberAndInbox: (numberId: string) => void;
  onSendTestXMessage: (numberId: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const XTwitterGuide: React.FC<XTwitterGuideProps> = ({
  numbers,
  messages,
  onSelectNumberAndInbox,
  onSendTestXMessage,
  onRefresh,
  isRefreshing,
}) => {
  const [selectedNumId, setSelectedNumId] = useState<string>(numbers[0]?.id || '');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  const selectedNum = numbers.find((n) => n.id === selectedNumId) || numbers[0];

  // Formatted variations for X (Twitter)
  const getXFormats = (num: SmsNumber) => {
    // e.g. numberLocal is 070-3819-4012
    const digitsOnly = num.numberLocal.replace(/-/g, ''); // 07038194012
    const noLeadingZero = digitsOnly.substring(1); // 7038194012 (For +81 inputs)
    return {
      noLeadingZero, // e.g. 7038194012
      digitsOnly, // e.g. 07038194012
      hyphenated: num.numberLocal, // e.g. 070-3819-4012
      intl: num.numberIntl, // e.g. +817038194012
    };
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(label);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(code);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  // Filter messages for X / Twitter
  const xMessages = messages.filter(
    (m) =>
      m.serviceCategory === 'twitter' ||
      m.sender.toLowerCase().includes('twitter') ||
      m.sender.toLowerCase().includes('x') ||
      m.body.includes('Twitter') ||
      m.body.includes('Xの認証コード')
  );

  const currentFormats = selectedNum ? getXFormats(selectedNum) : null;

  return (
    <div className="space-y-6">
      {/* Hero Header Banner for X (Twitter) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-black border border-slate-700 text-white font-black text-lg">
                𝕏
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                X (Twitter) SMS認証アシスタント
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              X（旧Twitter）アカウント作成・電話番号追加・2FA認証専用モード
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              日本の070 / 080 / 090 / 050仮想番号を使って、XのSMS認証コードをリアルタイムで取得します。
              国番号（+81）選択時の頭の0削除フォーマットを自動生成します。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => onSendTestXMessage(selectedNumId)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>𝕏 認証コードを擬似送信テスト</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Number Selector & Format Copy Tool (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Select Number & Copy Format */}
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/60 backdrop-blur space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                1. X登録用番号の選択 & 入力形式
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold">● 利用可能</span>
            </div>

            {/* Select Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                SMS受信用 日本番号を選択:
              </label>
              <select
                value={selectedNumId}
                onChange={(e) => setSelectedNumId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
              >
                {numbers.map((num) => (
                  <option key={num.id} value={num.id}>
                    {num.numberLocal} ({num.carrier} / {num.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Formatted Copy Options */}
            {selectedNum && currentFormats && (
              <div className="space-y-2.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  X（Twitter）の電話番号入力形式に合わせたコピー:
                </span>

                {/* Option A: Recommended for X (+81 with no leading 0) */}
                <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/50 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      推奨：国番号「+81 (日本)」選択時
                    </span>
                    <span className="text-[10px] text-slate-400">頭の0を削除</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="font-mono text-base font-extrabold text-emerald-400 tracking-widest">
                      {currentFormats.noLeadingZero}
                    </span>
                    <button
                      onClick={() => handleCopy(currentFormats.noLeadingZero, 'noZero')}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      {copiedFormat === 'noZero' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>コピー完了</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>コピー</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Xの入力欄で「+81」が自動挿入される場合、この番号を貼り付けてください。
                  </p>
                </div>

                {/* Option B: Standard Local (Digits only) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ハイフンなし標準 (070...)</span>
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {currentFormats.digitsOnly}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentFormats.digitsOnly, 'digits')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedFormat === 'digits' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>コピー</span>
                  </button>
                </div>

                {/* Option C: Hyphenated */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ハイフンあり (070-XXXX-XXXX)</span>
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {currentFormats.hyphenated}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentFormats.hyphenated, 'hyphen')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedFormat === 'hyphen' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>コピー</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step Guide Box */}
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/60 backdrop-blur space-y-3 text-xs">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              X (Twitter) SMS認証の手順ガイド
            </h3>

            <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
              <li className="leading-relaxed">
                <strong className="text-white">Xアプリまたはブラウザを開く:</strong> アカウント作成または設定の「電話番号を追加」画面へ移動します。
              </li>
              <li className="leading-relaxed">
                <strong className="text-white">国番号を選択:</strong> 国選択で「日本 (+81)」を選びます。
              </li>
              <li className="leading-relaxed">
                <strong className="text-white">番号を入力:</strong> 上記の「<span className="text-emerald-400 font-bold">推奨：頭の0削除番号</span>」（例: {currentFormats?.noLeadingZero}）をコピーして貼り付けます。
              </li>
              <li className="leading-relaxed">
                <strong className="text-white">コード受信を確認:</strong> 右側の「𝕏 受信トレイ」に届く6桁のSMSコードを入力欄へ入力します。
              </li>
            </ol>

            <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1">
              <p className="text-amber-300 font-semibold">💡 SMSコードが届かない場合:</p>
              <p>1. 上部の「更新」ボタンを押すか、約5〜15秒お待ちください。</p>
              <p>2. X側でエラーが出る場合は、別のau/docomo番号（例: 080-9284-1105）に変更してお試しください。</p>
            </div>
          </div>
        </div>

        {/* Right Column: X Specific Messages Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/60 backdrop-blur flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                𝕏 (Twitter) 専用 SMS受信用トレイ
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Xから送信された最新の認証コードメッセージを表示しています
              </p>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium border border-slate-600 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>更新</span>
            </button>
          </div>

          {/* Messages List */}
          <div className="space-y-3">
            {xMessages.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-10 text-center space-y-3">
                <MessageCircle className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-medium text-slate-300">
                  まだ X (Twitter) からのSMSを受信していません
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  左側の番号をXの電話番号設定画面に入力するか、「𝕏 認証コードを擬似送信テスト」ボタンを押してテストできます。
                </p>
                <button
                  onClick={() => onSendTestXMessage(selectedNumId)}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>𝕏 テストコードを今すぐ受信</span>
                </button>
              </div>
            ) : (
              xMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl p-5 border border-indigo-500/40 transition-all shadow-lg space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-black border border-slate-700 text-white font-black text-sm flex items-center justify-center">
                        𝕏
                      </span>
                      <div>
                        <span className="text-sm font-bold text-white block">
                          {msg.sender}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          受信対象: {numbers.find((n) => n.id === msg.numberId)?.numberLocal || ''}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString('ja-JP')}
                    </span>
                  </div>

                  {/* Giant OTP Box */}
                  {msg.otpCode && (
                    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                          <KeyRound className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                            𝕏 認証用 6桁コード (OTP)
                          </span>
                          <span className="text-3xl font-mono font-black tracking-widest text-emerald-400">
                            {msg.otpCode}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyOtp(msg.otpCode!)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        {copiedOtp === msg.otpCode ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-200" />
                            <span>コピー完了！</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-emerald-200" />
                            <span>1タップコピー</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Raw Body */}
                  <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-sans select-all leading-relaxed">
                    {msg.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
