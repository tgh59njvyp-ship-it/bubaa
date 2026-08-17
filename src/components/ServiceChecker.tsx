import React, { useState } from 'react';
import { SERVICE_COMPATIBILITIES } from '../data/mockNumbers';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, HelpCircle, Shield, Info, Check } from 'lucide-react';

export const ServiceChecker: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredServices = SERVICE_COMPATIBILITIES.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const getStatusBadge = (status: string, text: string) => {
    switch (status) {
      case 'excellent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {text}
          </span>
        );
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {text}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            {text}
          </span>
        );
      case 'restricted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            {text}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              国内主要Webサービス SMS認証動作状況表
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              公開仮電話番号（共有SMS受信用）に対する各サービスの対応・ブロック状況と成功率ガイド
            </p>
          </div>

          {/* Filter Status Buttons */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-auto text-xs">
            {[
              { id: 'all', label: 'すべて' },
              { id: 'excellent', label: '◎ 高成功率' },
              { id: 'good', label: '◯ 良好' },
              { id: 'warning', label: '▲ 注意' },
              { id: 'restricted', label: '× 非対応' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                  filterStatus === f.id
                    ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-emerald-400 block mb-1">
              ◎ 認証おすすめサービス
            </span>
            <p className="text-slate-400 leading-relaxed">
              Yahoo! JAPAN, Amazon, Discord, Steam などの会員登録や2FAコード確認は安定して短時間で受領可能です。
            </p>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-amber-400 block mb-1">
              ▲ 制限が発生するケース
            </span>
            <p className="text-slate-400 leading-relaxed">
              メルカリなどのフリマアプリでは公開共有番号に対するIP/キャリアブロックがかかる場合があります。
            </p>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-rose-400 block mb-1">
              × ブロックされるサービス
            </span>
            <p className="text-slate-400 leading-relaxed">
              LINE・銀行金融機関アプリはVoIP・共有仮想番号を厳格に弾くため、実キャリア通話SIMが必要です。
            </p>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-700/80">
              <tr>
                <th className="py-3.5 px-4">サービス名</th>
                <th className="py-3.5 px-4">カテゴリ</th>
                <th className="py-3.5 px-4">認証可否・ステータス</th>
                <th className="py-3.5 px-4">目安成功率</th>
                <th className="py-3.5 px-4">詳細・利用のアドバイス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredServices.map((srv, idx) => (
                <tr key={idx} className="hover:bg-slate-800/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white text-sm">
                    {srv.serviceName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                      {srv.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(srv.status, srv.statusText)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                    {srv.successRate}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 space-y-0.5">
                    <p className="text-slate-200">{srv.description}</p>
                    <p className="text-[11px] text-slate-400">{srv.notes}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
