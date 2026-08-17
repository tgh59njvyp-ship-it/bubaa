import React, { useState } from 'react';
import { SmsNumber } from '../types';
import { Copy, Check, Clock, Globe, Shield, Radio, ArrowRight, Signal } from 'lucide-react';

interface NumberListProps {
  numbers: SmsNumber[];
  selectedNumberId: string | null;
  onSelectNumber: (numberId: string) => void;
  onOpenSimulatorForNumber: (numberId: string) => void;
}

export const NumberList: React.FC<NumberListProps> = ({
  numbers,
  selectedNumberId,
  onSelectNumber,
  onOpenSimulatorForNumber,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [formatType, setFormatType] = useState<'local' | 'intl'>('local');

  const handleCopy = (num: SmsNumber, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = formatType === 'local' ? num.numberLocal : num.numberIntl;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(num.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNumbers = numbers.filter((n) => {
    if (carrierFilter === 'all') return true;
    return n.carrier === carrierFilter;
  });

  const getCarrierBadgeColor = (carrier: SmsNumber['carrier']) => {
    switch (carrier) {
      case 'NTT docomo':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'au':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'SoftBank':
        return 'bg-slate-300/10 text-slate-200 border-slate-400/30';
      case 'Rakuten Mobile':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'IP (050)':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Signal className="w-5 h-5 text-indigo-400" />
              日本国内 仮SMS番号一覧
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              SMS認証・オンライン登録テストに使用可能な全6回線の日本国内仮想番号
            </p>
          </div>

          {/* Copy Format Toggle */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-700/80 self-start md:self-auto">
            <span className="text-xs font-medium text-slate-400 px-2">コピー形式:</span>
            <button
              onClick={() => setFormatType('local')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                formatType === 'local'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              国内 (070-XXXX)
            </button>
            <button
              onClick={() => setFormatType('intl')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                formatType === 'intl'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              国際 (+8170XXXX)
            </button>
          </div>
        </div>

        {/* Carrier Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-3 text-xs">
          <span className="text-slate-400 font-medium mr-1">回線フィルタ:</span>
          {['all', 'NTT docomo', 'au', 'SoftBank', 'Rakuten Mobile', 'IP (050)'].map((carrier) => (
            <button
              key={carrier}
              onClick={() => setCarrierFilter(carrier)}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                carrierFilter === carrier
                  ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500 font-semibold shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {carrier === 'all' ? 'すべて (6番号)' : carrier}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Number Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNumbers.map((num) => {
          const isSelected = selectedNumberId === num.id;
          const displayNum = formatType === 'local' ? num.numberLocal : num.numberIntl;

          return (
            <div
              key={num.id}
              onClick={() => onSelectNumber(num.id)}
              className={`group relative bg-slate-800/90 hover:bg-slate-800 rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-950/50'
                  : 'border-slate-700/70 hover:border-slate-600'
              }`}
            >
              {/* Card Header: Badges & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCarrierBadgeColor(
                        num.carrier
                      )}`}
                    >
                      {num.carrier}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-700">
                      {num.region}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center text-[11px] font-medium ${
                      num.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        num.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {num.status === 'active' ? '稼働中' : '混雑中'}
                  </span>
                </div>

                {/* Number Display */}
                <div className="my-2 bg-slate-950/80 rounded-lg p-3 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">
                      {formatType === 'local' ? '国内表示 (HYPHEN)' : '国際表示 (E.164)'}
                    </span>
                    <span className="text-xl font-bold font-mono tracking-wider text-white">
                      {displayNum}
                    </span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={(e) => handleCopy(num, e)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer active:scale-95"
                    title="番号をコピー"
                  >
                    {copiedId === num.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </div>

                {/* Recommended Services Tags */}
                <div className="mt-3">
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    推奨検証サービス:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {num.recommendedFor.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-medium bg-slate-900/80 text-indigo-300 rounded border border-slate-700/80"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Stats & Actions */}
              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-indigo-400" />
                    本日 {num.messagesReceivedToday} 件受信
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    速度 ~{num.averageSpeedSec}s
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNumber(num.id);
                  }}
                  className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>トレイを開く</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
