import React, { useState } from 'react';
import { Code2, Terminal, Copy, Check, Play, Server, Database } from 'lucide-react';

export const ApiPlayground: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'numbers' | 'messages' | 'send'>('numbers');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCurlCode = () => {
    switch (selectedEndpoint) {
      case 'numbers':
        return `curl -X GET "${window.location.origin}/api/numbers"`;
      case 'messages':
        return `curl -X GET "${window.location.origin}/api/messages?numberId=jp-num-1"`;
      case 'send':
        return `curl -X POST "${window.location.origin}/api/messages/send" \\
  -H "Content-Type: application/json" \\
  -d '{"numberId": "jp-num-1", "sender": "Yahoo! JAPAN", "body": "認証コード: 839201"}'`;
      default:
        return '';
    }
  };

  const getJsCode = () => {
    switch (selectedEndpoint) {
      case 'numbers':
        return `// 日本仮想番号一覧の取得
const res = await fetch('/api/numbers');
const numbers = await res.json();
console.log(numbers);`;
      case 'messages':
        return `// 特定番号の新着SMSメッセージ受領
const res = await fetch('/api/messages?numberId=jp-num-1');
const messages = await res.json();
console.log(messages);`;
      case 'send':
        return `// テストSMSの送信（シミュレータAPI）
const res = await fetch('/api/messages/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    numberId: 'jp-num-1',
    sender: 'Yahoo! JAPAN',
    body: '認証コード: 839201'
  })
});
const result = await res.json();
console.log(result);`;
      default:
        return '';
    }
  };

  const handleRunApiTest = async () => {
    setIsLoading(true);
    try {
      let url = '/api/numbers';
      let options: RequestInit = { method: 'GET' };

      if (selectedEndpoint === 'messages') {
        url = '/api/messages?numberId=jp-num-1';
      } else if (selectedEndpoint === 'send') {
        url = '/api/messages/send';
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            numberId: 'jp-num-1',
            sender: 'API-Test',
            body: `開発者APIからのテスト送信。認証コード: ${Math.floor(100000 + Math.random() * 900000)}`,
            serviceCategory: 'other'
          }),
        };
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setApiResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResult(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 backdrop-blur">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              開発者向け REST API & Webhook プレイグラウンド
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              プログラムからの自動SMSコード抽出・Webアプリケーション自動テスト用のRESTエンドポイント
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector & Code Snippet (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/60 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              利用可能なエンドポイント
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setSelectedEndpoint('numbers')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedEndpoint === 'numbers'
                    ? 'bg-purple-950/80 text-purple-200 border-purple-500 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">GET</span>
                <span className="text-sm font-semibold block text-white mt-1">/api/numbers</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">番号一覧取得</span>
              </button>

              <button
                onClick={() => setSelectedEndpoint('messages')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedEndpoint === 'messages'
                    ? 'bg-purple-950/80 text-purple-200 border-purple-500 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">GET</span>
                <span className="text-sm font-semibold block text-white mt-1">/api/messages</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">SMS受信データ</span>
              </button>

              <button
                onClick={() => setSelectedEndpoint('send')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedEndpoint === 'send'
                    ? 'bg-purple-950/80 text-purple-200 border-purple-500 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">POST</span>
                <span className="text-sm font-semibold block text-white mt-1">/api/messages/send</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">SMS擬似送信</span>
              </button>
            </div>

            {/* Code Snippets Box */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  cURL コマンド
                </span>
                <button
                  onClick={() => handleCopyCode(getCurlCode())}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode === getCurlCode() ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>コピー</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                {getCurlCode()}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-300">
                  JavaScript (Fetch API) コード
                </span>
                <button
                  onClick={() => handleCopyCode(getJsCode())}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode === getJsCode() ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>コピー</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                {getJsCode()}
              </pre>
            </div>
          </div>
        </div>

        {/* Live Execution Tester (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-400" />
                API実行結果レスポンス
              </h3>

              <button
                onClick={handleRunApiTest}
                disabled={isLoading}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>APIを実行</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-h-[320px] max-h-[460px] overflow-y-auto">
              {isLoading ? (
                <div className="text-xs text-slate-400 animate-pulse py-8 text-center">
                  APIリクエストを実行中...
                </div>
              ) : apiResult ? (
                <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                  {apiResult}
                </pre>
              ) : (
                <div className="text-xs text-slate-500 py-12 text-center space-y-2">
                  <Server className="w-8 h-8 text-slate-700 mx-auto" />
                  <p>「APIを実行」ボタンを押すと、実際のRESTレスポンスがJSONでここに表示されます。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
