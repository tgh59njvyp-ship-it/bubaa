import React from 'react';
import { ShieldAlert, X, Check, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                利用規約・プライバシー安全ガイドライン
              </h3>
              <p className="text-xs text-slate-400">
                日本国内における無料仮番号SMS受信サービスのご利用ルール
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300 max-h-[80vh] overflow-y-auto">
          {/* Important Public Warning */}
          <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl space-y-2 text-amber-200">
            <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              公開共有番号に関する重要な注意
            </span>
            <p className="leading-relaxed">
              当サービスで提供されている電話番号（070 / 080 / 090 / 050）は、全世界のユーザーと共有される**公開一時受信トレイ**です。受信したすべてのSMSメッセージおよび認証コード（OTP）は誰でも閲覧可能です。
            </p>
          </div>

          {/* Do's and Don'ts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              禁止事項 (Prohibited Actions)
            </h4>

            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300">
                <span className="p-0.5 rounded bg-rose-500/20 text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                <span>
                  <strong className="text-white">重要口座・金融サービスへの利用:</strong> 銀行・クレジットカード・投資口座のパスワードリセットやメインログインに本番号を使用しないでください。
                </span>
              </li>

              <li className="flex items-start gap-2 text-slate-300">
                <span className="p-0.5 rounded bg-rose-500/20 text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                <span>
                  <strong className="text-white">個人情報・機密データの送信:</strong> 本名、住所、決済情報などが含まれるSMSを受信させないでください。
                </span>
              </li>

              <li className="flex items-start gap-2 text-slate-300">
                <span className="p-0.5 rounded bg-rose-500/20 text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                <span>
                  <strong className="text-white">違法行為およびスパム行為:</strong> 他者になりすます不正アクセス、スパムメッセージの大量送信は法律で禁止されています。
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              推奨される用途 (Recommended Uses)
            </h4>

            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Webアプリケーションおよび2FA認証機能の開発・接続テスト</span>
              </li>

              <li className="flex items-start gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>スパム防止のための捨てアカウント作成・一時的検証</span>
              </li>

              <li className="flex items-start gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>SMS連携API（Twilio、Vonage等）の疎通テスト環境</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md active:scale-95"
            >
              理解して同意する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
