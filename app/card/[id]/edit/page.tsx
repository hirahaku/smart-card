"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const InputField = ({ label, value, field, placeholder, type = "text", onChange }: any) => (
  <div className="mb-4">
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(field, e.target.value)}
    />
  </div>
);

export default function EditCard() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inputPassword, setInputPassword] = useState(""); // 認証用パスワード
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.from("profiles").select("*").eq("card_id", id).single();
      if (data) setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // セキュリティチェック：DBに保存されているパスワードと比較
    if (inputPassword !== profile.password) {
      alert("パスワードが正しくありません。");
      return;
    }

    const { error } = await supabase.from("profiles").update(profile).eq("card_id", id);
    if (error) {
      alert(`保存失敗: ${error.message}`);
    } else {
      alert("情報を更新しました！");
      router.push(`/card/${id}`);
    }
  };

  if (loading) return <div className="p-10 text-white text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 font-sans">
      <header className="p-6 border-b border-neutral-800 flex justify-between items-center sticky top-0 bg-neutral-950/80 backdrop-blur z-10">
        <h1 className="text-lg font-bold">情報の編集</h1>
        <button onClick={() => router.back()} className="text-gray-400 text-sm">キャンセル</button>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {/* パスワード認証セクション */}
        <section className="mb-10 p-5 bg-red-950/20 border border-red-900/30 rounded-3xl">
          <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            認証が必要です
          </h2>
          <InputField 
            label="設定したパスワードを入力" 
            value={inputPassword} 
            field="password" 
            type="password" 
            placeholder="パスワード" 
            onChange={(_:any, val:string) => setInputPassword(val)} 
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">基本情報</h2>
          <InputField label="氏名" value={profile.full_name} field="full_name" onChange={handleChange} />
          <InputField label="役職" value={profile.job_title} field="job_title" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">連絡先・SNS</h2>
          <InputField label="電話番号" value={profile.phone} field="phone" onChange={handleChange} />
          <InputField label="メールアドレス" value={profile.email} field="email" onChange={handleChange} />
          <InputField label="LINE ID" value={profile.line_id} field="line_id" onChange={handleChange} />
          <InputField label="Instagram ID" value={profile.instagram_id} field="instagram_id" onChange={handleChange} />
          <InputField label="X (Twitter) ID" value={profile.x_id} field="x_id" onChange={handleChange} />
          <InputField label="Webサイト" value={profile.website_url} field="website_url" onChange={handleChange} />
        </section>
        
        <button 
          onClick={handleSave} 
          className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-transform"
        >
          変更を保存する
        </button>
      </main>
    </div>
  );
}