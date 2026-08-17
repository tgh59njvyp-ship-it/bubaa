import React, { useState } from 'react';
import { SmsNumber, ServiceTemplate } from '../types';
import { SERVICE_TEMPLATES } from '../data/mockNumbers';
import { Send, X, Sparkles, Smartphone, KeyRound, AlertCircle } from 'lucide-react';

interface SmsSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  numbers: SmsNumber[];
  defaultNumberId?: string | null;
  onSendSms: (numberId: string, sender: string, body: string, category: string) => void;
}

export const SmsSimulatorModal: React.FC<SmsSimulatorModalProps> = ({
  isOpen,
  onClose,
  numbers,
  defaultNumberId,
  onSendSms,
}) => {
  const [selectedNumberId, setSelectedNumberId] = useState<string>(
    defaultNumberId || numbers[0]?.id || ''
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-yahoo');
  const [senderName, setSenderName] = useState<string>('Yahoo! JAPAN');
  const [otpCode, setOtpCode] = useState<string>(
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const [customBody, setCustomBody] = useState<string>('');
  const [category, setCategory] = useState<string>('yahoo');

  if (!isOpen) return null;

  const handleSelectTemplate = (tpl: ServiceTemplate) => {
    setSelectedTemplateId(tpl.id);
    setSenderName(tpl.senderName);
    setCategory(tpl.category || 'other');

    if (tpl.id !== 'tpl-custom') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCode(generatedOtp);
      setCustomBody(tpl.templateText.replace('{{OTP}}', generatedOtp));
    } else {
      setCustomBody(`テスト認証コードは [ ${otpCode} ] です。`);
    }
  };

  const handleRegenerateOtp = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(newCode);

    const activeTpl = SERVICE_TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (activeTpl && activeTpl.id !== 'tpl-custom') {
      setCustomBody(activeTpl.templateText.replace('{{OTP}}', newCode));
    } else {
      setCustomBody(customBody.replace(/\d{6}/, newCode));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNumberId || !senderName || !customBody) return;

    onSendSms(selectedNumberId, senderName, customBody, category);
    onClose();
  };

  const currentNumberObj = numbers.find((n) => n.id === selectedNumberId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                テストSMS送信シミュレータ
              </h3>
              <p className="text-xs text-slate-400">
                日本仮想番号へ認証SMSメッセージを擬似受信テストします
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Number Picker */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              送信先 日本番号の選択
            </label>
            <select
              value={selectedNumberId}
              onChange={(e) => setSelectedNumberId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            >
              {numbers.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.numberLocal} ({n.carrier} / {n.region})
                </option>
              ))}
            </select>
          </div>

          {/* Service Template Quick Buttons */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              テンプレートの選択
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {SERVICE_TEMPLATES.map((tpl) => (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedTemplateId === tpl.id
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500 font-semibold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="truncate font-medium">{tpl.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* OTP Code Generator */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 font-medium block">
                自動生成 認証コード (6桁OTP):
              </span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {otpCode}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRegenerateOtp}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors cursor-pointer font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>コード再生成</span>
            </button>
          </div>

          {/* Custom Sender Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              送信元サービス名 (Sender Name)
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="例: Yahoo! JAPAN, Mercari, PayPay"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* SMS Body Textarea */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              SMS本文 (Message Body)
            </label>
            <textarea
              rows={3}
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-sans placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{currentNumberObj?.numberLocal} へ即時送信</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
