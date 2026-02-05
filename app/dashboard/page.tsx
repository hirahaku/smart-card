"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Edit3, BarChart2, Lock, ArrowLeft, Eye, LogOut } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedId = localStorage.getItem("login_card_id");
    if (!savedId) {
      router.push("/");
      return;
    }

    async function loadData() {
      const { data } = await supabase.from("profiles").select("*").eq("card_id", savedId).single();
      setProfile(data);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("login_card_id");
    router.push("/");
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* ナビゲーション */}
      <nav className="fixed bottom-0 w-full bg-neutral-900 border-t border-neutral-800 flex justify-around p-4 z-50 md:top-0 md:bottom-auto md:flex-col md:w-64 md:h-full md:border-r md:border-t-0 md:justify-start md:gap-4">
        <div className="hidden md:block p-6 mb-6 text-xl font-bold italic tracking-tighter text-blue-500">SMART CARD</div>
        
        <NavButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} icon={<BarChart2 />} label="分析" />
        <NavButton active={activeTab === "edit"} onClick={() => setActiveTab("edit")} icon={<Edit3 />} label="編集" />
        <NavButton active={activeTab === "password"} onClick={() => setActiveTab("password")} icon={<Lock />} label="パス設定" />
        
        <div className="md:mt-auto md:border-t md:border-neutral-800 md:pt-4">
          <button onClick={() => router.push(`/card/${profile.card_id}`)} className="flex items-center gap-3 p-4 text-gray-400 hover:text-white transition-colors w-full text-left">
            <ArrowLeft size={20} /> <span className="hidden md:inline">名刺を見る</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-red-400 hover:text-red-300 transition-colors w-full text-left">
            <LogOut size={20} /> <span className="hidden md:inline">ログアウト</span>
          </button>
        </div>
      </nav>

      {/* メインエリア */}
      <main className="pb-24 md:pl-72 p-6 max-w-4xl mx-auto pt-10">
        <h1 className="text-2xl font-bold mb-2">こんにちは、{profile.full_name}さん</h1>
        <p className="text-gray-500 mb-8 text-sm">ID: {profile.card_id}</p>

        {activeTab === "analytics" && <AnalyticsView profile={profile} />}
        
        {activeTab === "edit" && (
           <div className="animate-in fade-in">
             <h2 className="text-2xl font-bold mb-6">情報の編集</h2>
             <button onClick={() => router.push(`/card/${profile.card_id}/edit`)} className="w-full bg-neutral-800 border border-neutral-700 p-8 rounded-2xl hover:bg-neutral-700 transition-all flex items-center justify-between group">
               <span className="font-bold text-lg">編集ページを開く</span>
               <Edit3 className="group-hover:text-blue-400 transition-colors" />
             </button>
           </div>
        )}

        {activeTab === "password" && <PasswordView profile={profile} />}
      </main>
    </div>
  );
}

// --- コンポーネント群 ---

function AnalyticsView({ profile }: any) {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold mb-6">アナリティクス</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <Eye className="text-blue-500 mb-2" size={32} />
          <span className="text-5xl font-black">{profile.views_count || 0}</span>
          <span className="text-gray-500 text-sm mt-2">累計表示回数</span>
        </div>
      </div>
    </div>
  );
}

function PasswordView({ profile }: any) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (currentPass !== profile.password) {
      alert("現在のパスワードが正しくありません。");
      return;
    }
    if (!newPass) {
      alert("新しいパスワードを入力してください。");
      return;
    }

    setIsUpdating(true);
    const { error } = await supabase.from("profiles").update({ password: newPass }).eq("card_id", profile.card_id);

    if (error) {
      alert("更新に失敗しました。");
    } else {
      alert("パスワードを変更しました。");
      setCurrentPass("");
      setNewPass("");
      profile.password = newPass; 
    }
    setIsUpdating(false);
  };

  return (
    <div className="max-w-md animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-6">パスワード変更</h2>
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl text-left">
        <div className="mb-4">
          <label className="text-xs text-gray-500 ml-1 mb-1 block">現在のパスワード</label>
          <input type="password" placeholder="••••••••" className="w-full bg-neutral-800 p-4 rounded-xl border border-neutral-700 outline-none focus:border-blue-500 text-white" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="text-xs text-gray-500 ml-1 mb-1 block">新しいパスワード</label>
          <input type="password" placeholder="••••••••" className="w-full bg-neutral-800 p-4 rounded-xl border border-neutral-700 outline-none focus:border-blue-500 text-white" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
        </div>
        <button onClick={handleUpdate} disabled={isUpdating} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50">
          {isUpdating ? "更新中..." : "パスワードを更新する"}
        </button>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col md:flex-row items-center gap-2 md:gap-4 p-4 rounded-2xl transition-all ${active ? "text-blue-500 bg-blue-500/10" : "text-gray-500 hover:text-gray-300"}`}>
      {icon} <span className="text-xs md:text-base font-bold">{label}</span>
    </button>
  );
}