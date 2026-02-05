"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [cardId, setCardId] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardId) {
      // 入力されたIDの編集ページへ飛ばす
      router.push(`/card/${cardId}/edit`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      {/* ロゴ部分（もしNext.jsのロゴを使うなら残す、不要なら消してOK） */}
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">
          SMART CARD
        </h1>
      </div>

      <main className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem] shadow-2xl transition-all">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold mb-2">マイページにログイン</h2>
          <p className="text-sm text-gray-400">カードIDを入力して編集画面を開きます</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Card ID</label>
            <input 
              type="text" 
              placeholder="例: test001"
              required
              className="w-full bg-neutral-800 border border-neutral-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-mono"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-neutral-200 active:scale-95 transition-all text-lg"
          >
            ログイン
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            カードをまだお持ちでない方は、<br />
            お手元のスマート名刺をスマホにかざして登録してください。
          </p>
        </div>
      </main>

      <footer className="mt-12 text-gray-600 text-[10px] tracking-widest uppercase">
        © 2026 Smart Card App Project
      </footer>
    </div>
  );
}