import React, { useEffect, useState } from 'react';
import { SmsMessage, AiAnalysisResult } from '../types';
import { Sparkles, X, ShieldCheck, ShieldAlert, AlertTriangle, KeyRound, CheckCircle2 } from 'lucide-react';

interface AiSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: SmsMessage | null;
}

export const AiSecurityModal: React.FC<AiSecurityModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && message) {
      runAnalysis(message);
    } else {
      setAnalysis(null);
      setError(null);
    }
  }, [isOpen, message]);

  const runAnalysis = async (msg: SmsMessage) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/analyze-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: msg.sender,
          body: msg.body,
          numberId: msg.numberId,
        }),
      });

      if (!res.ok) {
        throw new Error('AI解析サーバーの応答に失敗しました。');
      }

      const data: AiAnalysisResult = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'AI解析エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Gemini AI フィッシング・セキュリティ解析
              </h3>
              <p className="text-xs text-slate-400">
                受信SMSの安全度判定・詐欺リスク・コード自動検知
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Target Message Recap */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold text-white">{message.sender}</span>
              <span>{new Date(message.timestamp).toLocaleTimeString('ja-JP')}</span>
            </div>
            <p className="text-slate-300 font-sans">{message.body}</p>
          </div>

          {isLoading ? (
            <div className="py-10 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-slate-300 font-semibold">
                Gemini AI がSMSのメッセージ構造と送信元パターンを解析中...
              </p>
              <p className="text-[11px] text-slate-500">
                フィッシング詐欺リンク・送信者偽装・不正認証の可能性を照合しています
              </p>
            </div>
          ) : error ? (
            <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl text-rose-300 text-center">
              {error}
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              {/* Risk Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  analysis.riskLevel === 'safe'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : analysis.riskLevel === 'low'
                    ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {analysis.riskLevel === 'safe' ? (
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-amber-400" />
                  )}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                      AI診断リスク評価
                    </span>
                    <span className="text-lg font-extrabold uppercase">
                      {analysis.riskLevel === 'safe'
                        ? '安全 (SAFE)'
                        : analysis.riskLevel === 'low'
                        ? '低リスク (LOW RISK)'
                        : '要注意 (WARNING)'}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 border border-slate-700">
                  {analysis.senderType}
                </span>
              </div>

              {/* Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-300 block">AI分析の要約</span>
                <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Extracted Code if present */}
              {analysis.otpCodeExtracted && (
                <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-300 font-medium">抽出コード:</span>
                  <span className="font-mono font-black text-xl text-emerald-400 tracking-widest">
                    {analysis.otpCodeExtracted}
                  </span>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-300 block">安全のための注意点・アドバイス</span>
                  <ul className="space-y-1.5">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          <div className="pt-2 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
