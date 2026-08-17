import { SmsNumber, SmsMessage, ServiceTemplate, ServiceCompatibility } from '../types';

export const INITIAL_NUMBERS: SmsNumber[] = [
  {
    id: 'jp-num-1',
    numberIntl: '+817038194012',
    numberLocal: '070-3819-4012',
    carrier: 'NTT docomo',
    region: '東京都 (東京エリア)',
    status: 'active',
    messagesReceivedToday: 142,
    averageSpeedSec: 2,
    createdAt: '2026-08-16',
    recommendedFor: ['Yahoo! JAPAN', 'Amazon JP', 'Rakuten', 'Discord']
  },
  {
    id: 'jp-num-2',
    numberIntl: '+818092841105',
    numberLocal: '080-9284-1105',
    carrier: 'au',
    region: '大阪府 (関西エリア)',
    status: 'active',
    messagesReceivedToday: 98,
    averageSpeedSec: 3,
    createdAt: '2026-08-16',
    recommendedFor: ['PayPay', 'WebMoney', 'Twitter/X', 'TikTok']
  },
  {
    id: 'jp-num-3',
    numberIntl: '+819067219983',
    numberLocal: '090-6721-9983',
    carrier: 'SoftBank',
    region: '愛知県 (東海エリア)',
    status: 'active',
    messagesReceivedToday: 215,
    averageSpeedSec: 2,
    createdAt: '2026-08-15',
    recommendedFor: ['メルカリ', 'Yahoo! JAPAN', 'Steam', 'GitHub']
  },
  {
    id: 'jp-num-4',
    numberIntl: '+817049203318',
    numberLocal: '070-4920-3318',
    carrier: 'Rakuten Mobile',
    region: '福岡県 (九州エリア)',
    status: 'active',
    messagesReceivedToday: 76,
    averageSpeedSec: 4,
    createdAt: '2026-08-16',
    recommendedFor: ['楽天会員認証', 'Uber Eats', 'Telegram']
  },
  {
    id: 'jp-num-5',
    numberIntl: '+815058912049',
    numberLocal: '050-5891-2049',
    carrier: 'IP (050)',
    region: '全国共通 (IPクラウド回線)',
    status: 'busy',
    messagesReceivedToday: 310,
    averageSpeedSec: 5,
    createdAt: '2026-08-14',
    recommendedFor: ['海外Webサービス', 'OpenAI', '開発APIテスト']
  },
  {
    id: 'jp-num-6',
    numberIntl: '+818011938842',
    numberLocal: '080-1193-8842',
    carrier: 'au',
    region: '北海道 (札幌エリア)',
    status: 'active',
    messagesReceivedToday: 64,
    averageSpeedSec: 2,
    createdAt: '2026-08-16',
    recommendedFor: ['DMM', 'dアカウント', 'ChatGPT', 'Epic Games']
  }
];

export const INITIAL_MESSAGES: SmsMessage[] = [
  {
    id: 'msg-101',
    numberId: 'jp-num-1',
    sender: 'Yahoo! JAPAN',
    serviceCategory: 'yahoo',
    body: '【Yahoo! JAPAN】ログイン確認コードは [ 839201 ] です。10分以内にご入力ください。他人に教えないでください。',
    otpCode: '839201',
    timestamp: new Date(Date.now() - 1000 * 20).toISOString(), // 20 seconds ago
  },
  {
    id: 'msg-102',
    numberId: 'jp-num-1',
    sender: 'Amazon',
    serviceCategory: 'amazon',
    body: 'Amazonセキュリティコード: 492018。このコードを共有しないでください。有効期限は10分間です。',
    otpCode: '492018',
    timestamp: new Date(Date.now() - 1000 * 180).toISOString(), // 3 mins ago
  },
  {
    id: 'msg-103',
    numberId: 'jp-num-1',
    sender: 'Rakuten',
    serviceCategory: 'rakuten',
    body: '[楽天グループ] ログイン認証コード: 581903 (有効期間: 15分)。ログイン要求を行っていない場合は破棄してください。',
    otpCode: '581903',
    timestamp: new Date(Date.now() - 1000 * 600).toISOString(), // 10 mins ago
  },
  {
    id: 'msg-201',
    numberId: 'jp-num-2',
    sender: 'PayPay',
    serviceCategory: 'paypay',
    body: '【PayPay】携帯電話番号の確認コードは [ 710294 ] です。有効時間: 5分',
    otpCode: '710294',
    timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
  },
  {
    id: 'msg-202',
    numberId: 'jp-num-2',
    sender: 'X (Twitter)',
    serviceCategory: 'twitter',
    body: 'Twitter/Xの認証コードは 304918 です。誰とも共有しないでください。',
    otpCode: '304918',
    timestamp: new Date(Date.now() - 1000 * 420).toISOString(),
  },
  {
    id: 'msg-301',
    numberId: 'jp-num-3',
    sender: 'メルカリ',
    serviceCategory: 'mercari',
    body: '【メルカリ】認証番号は [ 918234 ] です。この番号を他人に教えないでください。有効期限: 30分',
    otpCode: '918234',
    timestamp: new Date(Date.now() - 1000 * 90).toISOString(),
  },
  {
    id: 'msg-302',
    numberId: 'jp-num-3',
    sender: 'Discord',
    serviceCategory: 'discord',
    body: 'Discord security verification code: 649201',
    otpCode: '649201',
    timestamp: new Date(Date.now() - 1000 * 1200).toISOString(),
  },
  {
    id: 'msg-401',
    numberId: 'jp-num-4',
    sender: 'Uber Eats',
    serviceCategory: 'other',
    body: 'Uber Eats 認証コードは 882014 です。本コードは絶対に他人に渡さないでください。',
    otpCode: '882014',
    timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
  },
  {
    id: 'msg-501',
    numberId: 'jp-num-5',
    sender: 'OpenAI',
    serviceCategory: 'other',
    body: 'Your OpenAI verification code is 491028.',
    otpCode: '491028',
    timestamp: new Date(Date.now() - 1000 * 150).toISOString(),
  }
];

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    id: 'tpl-yahoo',
    name: 'Yahoo! JAPAN ログイン認証',
    senderName: 'Yahoo! JAPAN',
    category: 'yahoo',
    templateText: '【Yahoo! JAPAN】ログイン確認コードは [ {{OTP}} ] です。10分以内にご入力ください。他人に教えないでください。',
    iconName: 'Globe'
  },
  {
    id: 'tpl-mercari',
    name: 'メルカリ 会員登録・本人確認',
    senderName: 'メルカリ',
    category: 'mercari',
    templateText: '【メルカリ】認証番号は [ {{OTP}} ] です。この番号を他人に教えないでください。有効期限: 30分',
    iconName: 'ShoppingBag'
  },
  {
    id: 'tpl-rakuten',
    name: '楽天グループ ワンタイムパスワード',
    senderName: 'Rakuten',
    category: 'rakuten',
    templateText: '[楽天グループ] ログイン認証コード: {{OTP}} (有効期間: 15分)。身に覚えのない要求は無視してください。',
    iconName: 'CreditCard'
  },
  {
    id: 'tpl-paypay',
    name: 'PayPay 携帯電話番号確認',
    senderName: 'PayPay',
    category: 'paypay',
    templateText: '【PayPay】携帯電話番号の確認コードは [ {{OTP}} ] です。有効時間: 5分。絶対に第三者に教えないでください。',
    iconName: 'Smartphone'
  },
  {
    id: 'tpl-amazon',
    name: 'Amazon.co.jp 二段階認証',
    senderName: 'Amazon',
    category: 'amazon',
    templateText: 'Amazonセキュリティコード: {{OTP}}。このコードを共有しないでください。有効期限は10分間です。',
    iconName: 'Package'
  },
  {
    id: 'tpl-x',
    name: 'X (旧Twitter) アカウント認証',
    senderName: 'X (Twitter)',
    category: 'twitter',
    templateText: 'Twitter/Xの認証コードは {{OTP}} です。誰とも共有しないでください。',
    iconName: 'MessageCircle'
  },
  {
    id: 'tpl-custom',
    name: 'カスタムSMS（任意メッセージ）',
    senderName: 'TestSender',
    category: 'other',
    templateText: 'テストメッセージです。認証コード: {{OTP}}。システム動作確認用。',
    iconName: 'Send'
  }
];

export const SERVICE_COMPATIBILITIES: ServiceCompatibility[] = [
  {
    serviceName: 'X (旧Twitter)',
    category: 'SNS・ソーシャル',
    status: 'excellent',
    statusText: '◎ 高い成功率',
    description: 'X（旧Twitter）のアカウント新規作成、電話番号追加、2段階認証(2FA)のSMSコードを受信できます。',
    successRate: 97,
    notes: '入力時は国番号「+81 (日本)」を選択し、頭の0を抜いた番号（例: 7038194012）を入力すると確実です。'
  },
  {
    serviceName: 'Yahoo! JAPAN',
    category: 'ポータル・検索',
    status: 'excellent',
    statusText: '◎ 高い成功率',
    description: '公衆仮想SMS番号での認証コード受信が最も安定しているサービスの一つです。',
    successRate: 98,
    notes: '二段階認証・サブアカウントのテストに最適です。'
  },
  {
    serviceName: 'Amazon.co.jp',
    category: 'ショッピング',
    status: 'excellent',
    statusText: '◎ 高い成功率',
    description: '海外・国内問わずSMSコードが迅速（1〜3秒以内）に到着します。',
    successRate: 96,
    notes: '二重認証ログインのテストにスムーズに対応します。'
  },
  {
    serviceName: '楽天グループ (Rakuten)',
    category: 'EC・ポイント',
    status: 'good',
    statusText: '◯ 良好な動作',
    description: '楽天会員のログイン認証およびメールアドレス変更時のSMS認証に対応。',
    successRate: 90,
    notes: '時間帯によって10〜20秒程度遅延する場合があります。'
  },
  {
    serviceName: 'PayPay',
    category: '決済・フィンテック',
    status: 'good',
    statusText: '◯ 認証可能',
    description: '初回ログインおよび端末追加のSMSコードを受信できます。',
    successRate: 88,
    notes: '共有番号のため重要資産のメイン口座登録には使用しないでください。'
  },
  {
    serviceName: 'メルカリ (Mercari)',
    category: 'フリマアプリ',
    status: 'warning',
    statusText: '▲ 一部ブロックあり',
    description: '公開共有番号は過去の使用履歴により一部ブロック対象となる場合があります。',
    successRate: 65,
    notes: '最新追加された番号（070回線）をお試しください。'
  },
  {
    serviceName: 'LINE',
    category: 'SNS・メッセンジャー',
    status: 'restricted',
    statusText: '× 非対応 (ブロック)',
    description: 'LINEはVoIP・仮想SMS共有番号を強力に判別しブロックします。',
    successRate: 5,
    notes: '音声通話可能な専用実キャリアSIM契約が必要です。'
  },
  {
    serviceName: 'OpenAI / ChatGPT',
    category: 'AI・Webツール',
    status: 'good',
    statusText: '◯ 認証可能',
    description: 'OpenAIアカウント作成および2FA認証SMSの取得実績があります。',
    successRate: 85,
    notes: '050番号よりも070/080/090番号を推奨します。'
  },
  {
    serviceName: 'Discord / Steam',
    category: 'ゲーム・コミュニティ',
    status: 'excellent',
    statusText: '◎ 高い成功率',
    description: '海外ゲームプラットフォームのセキュリティSMS認証を迅速に受領可能です。',
    successRate: 95,
    notes: '即座にOTP抽出機能がコードを表示します。'
  }
];
