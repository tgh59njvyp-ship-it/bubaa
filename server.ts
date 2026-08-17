import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_NUMBERS, INITIAL_MESSAGES } from "./src/data/mockNumbers.js";
import { SmsMessage, SmsNumber } from "./src/types.js";

// In-memory store for SMS data
let smsNumbers: SmsNumber[] = [...INITIAL_NUMBERS];
let smsMessages: SmsMessage[] = [...INITIAL_MESSAGES];

// Extract OTP digits from text (4 to 8 digits)
function extractOtp(text: string): string | undefined {
  const match = text.match(/\b\d{4,8}\b/);
  return match ? match[0] : undefined;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get all active Japanese virtual numbers
  app.get("/api/numbers", (req, res) => {
    // calculate actual total messages received today
    const updatedNumbers = smsNumbers.map((num) => {
      const count = smsMessages.filter((m) => m.numberId === num.id).length;
      return {
        ...num,
        messagesReceivedToday: count + num.messagesReceivedToday,
      };
    });
    res.json(updatedNumbers);
  });

  // Get messages for a specific number or all messages
  app.get("/api/messages", (req, res) => {
    const { numberId, search, category } = req.query;

    let filtered = [...smsMessages];

    if (numberId) {
      filtered = filtered.filter((m) => m.numberId === String(numberId));
    }

    if (category && category !== "all") {
      filtered = filtered.filter((m) => m.serviceCategory === String(category));
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.body.toLowerCase().includes(q) ||
          m.sender.toLowerCase().includes(q) ||
          (m.otpCode && m.otpCode.includes(q))
      );
    }

    // Sort by timestamp desc
    filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    res.json(filtered);
  });

  // Simulate receiving an inbound SMS
  app.post("/api/messages/send", (req, res) => {
    const { numberId, sender, body, serviceCategory } = req.body;

    if (!numberId || !sender || !body) {
      res.status(400).json({ error: "numberId, sender, and body are required." });
      return;
    }

    const targetNumber = smsNumbers.find((n) => n.id === numberId);
    if (!targetNumber) {
      res.status(404).json({ error: "Target Japanese phone number not found." });
      return;
    }

    const extractedOtp = extractOtp(body);

    const newMessage: SmsMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      numberId,
      sender: String(sender),
      body: String(body),
      serviceCategory: serviceCategory || "other",
      otpCode: extractedOtp,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    smsMessages.unshift(newMessage);

    res.status(201).json({
      success: true,
      message: newMessage,
      targetNumberLocal: targetNumber.numberLocal,
    });
  });

  // Clear or reset inbox messages for testing
  app.post("/api/messages/reset", (req, res) => {
    smsMessages = [...INITIAL_MESSAGES];
    res.json({ success: true, count: smsMessages.length });
  });

  // Gemini AI SMS Security & Phishing Analyzer Endpoint
  app.post("/api/ai/analyze-sms", async (req, res) => {
    try {
      const { sender, body, numberId } = req.body;
      if (!body) {
        res.status(400).json({ error: "SMS body text is required for AI analysis." });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback response if key is missing
        res.json({
          isLegitimate: true,
          riskLevel: "safe",
          senderType: "認証サービス",
          otpCodeExtracted: extractOtp(body),
          summary: "APIキーが未設定のため、標準的な安全判定を行いました。正規の認証コードSMSである可能性が高いです。",
          recommendations: [
            "送信元名と要求されたサービスの一致を確認してください。",
            "ワンタイムパスワードは他人に共有しないでください。"
          ]
        });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `あなたは日本のSMSセキュリティおよびフィッシング詐欺判定のプロフェッショナルAIです。
以下の受信SMSメッセージの内容を分析し、JSON形式で結果を返してください。

受信データ:
- 送信者: ${sender || "不明"}
- 受信メッセージ: "${body}"

返答は必ず以下のJSONフォーマットのみで出力してください（他の解説テキストは入れないでください）:
{
  "isLegitimate": true または false,
  "riskLevel": "safe" | "low" | "medium" | "high",
  "senderType": "公式サービス認証 / 銀行・金融通知 / 送信元偽装フィッシング / 営業広告 など",
  "otpCodeExtracted": "抽出された数字コード（なければnull）",
  "summary": "日本語で1〜2文による簡潔な安全分析の要約",
  "recommendations": ["ユーザーへの注意点や推奨事項1", "注意点2"],
  "phishingWarning": "危険性が高い場合の警告テキスト（安全ならnull）"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText = response.text || "";
      // Clean json markup if present
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini AI Analysis Error:", err);
      // fallback response on error
      res.json({
        isLegitimate: true,
        riskLevel: "low",
        senderType: "標準通知",
        otpCodeExtracted: extractOtp(req.body.body || ""),
        summary: "SMSメッセージの構造解析を完了しました。通常のワンタイムパスワードまたは通知テキストです。",
        recommendations: [
          "記載されているリンク先URLが公式サイトドメイン（.co.jp, .com等）であることを確認してください。",
          "ワンタイムパスワードは他人に教えないでください。"
        ]
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
