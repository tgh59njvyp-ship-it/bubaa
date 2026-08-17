export interface SmsNumber {
  id: string;
  numberIntl: string; // e.g. +817038194012
  numberLocal: string; // e.g. 070-3819-4012
  carrier: 'NTT docomo' | 'au' | 'SoftBank' | 'Rakuten Mobile' | 'IP (050)';
  region: string; // e.g. 東京都, 大阪府
  status: 'active' | 'busy' | 'maintenance';
  messagesReceivedToday: number;
  averageSpeedSec: number;
  createdAt: string;
  recommendedFor: string[];
}

export interface SmsMessage {
  id: string;
  numberId: string;
  sender: string; // e.g. "Yahoo! JAPAN", "Mercari", "+819012345678"
  serviceCategory?: 'line' | 'yahoo' | 'mercari' | 'rakuten' | 'paypay' | 'amazon' | 'twitter' | 'discord' | 'other';
  body: string;
  otpCode?: string; // extracted OTP if any e.g. "938102"
  timestamp: string; // ISO string
  isRead?: boolean;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  senderName: string;
  category: SmsMessage['serviceCategory'];
  templateText: string;
  iconName: string;
}

export interface ServiceCompatibility {
  serviceName: string;
  category: string;
  status: 'excellent' | 'good' | 'warning' | 'restricted';
  statusText: string;
  description: string;
  successRate: number; // e.g. 95
  notes: string;
}

export interface AiAnalysisResult {
  isLegitimate: boolean;
  riskLevel: 'safe' | 'low' | 'medium' | 'high';
  senderType: string;
  otpCodeExtracted?: string;
  summary: string;
  recommendations: string[];
  phishingWarning?: string;
}
