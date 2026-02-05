"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ★ 修正ポイント1: パーツを外に出しました
const InputField = ({ label, value, field, placeholder, onChange }: any) => (
  <div className="mb-4">
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <input
      type="text"
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
  
  const [profile, setProfile] = useState<any>({
    full_name: "",
    job_title: "",
    phone: "",
    email: "",
    instagram_id: "",
    x_id: "",
    line_id: "",
    website_url: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.from("profiles").select("*").eq("card_id", id).single();
      if (data) setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [id]);

  // ★ 修正ポイント2: 変更用の関数を作成
  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { error } = await supabase.from("profiles").update(profile).eq("card_id", id);
    if (error) {
      alert(`保存に失敗しました: ${error.message}`);
    } else {
      alert("名刺情報を更新しました！");
      router.push(`/card/${id}`);
    }
  };

  if (loading) return <div className="p-10 text-white text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      <header className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 sticky top-0 z-10">
        <h1 className="text-lg font-bold">情報の編集</h1>
        <button onClick={() => router.back()} className="text-gray-400 text-sm">キャンセル</button>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">基本情報</h2>
          <InputField label="氏名" value={profile.full_name} field="full_name" onChange={handleChange} />
          <InputField label="役職・肩書き" value={profile.job_title} field="job_title" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">連絡先・SNS</h2>
          <InputField label="電話番号" value={profile.phone} field="phone" placeholder="09012345678" onChange={handleChange} />
          <InputField label="メールアドレス" value={profile.email} field="email" placeholder="example@mail.com" onChange={handleChange} />
          <InputField label="LINE ID" value={profile.line_id} field="line_id" placeholder="IDのみ入力" onChange={handleChange} />
          <InputField label="Instagram ID" value={profile.instagram_id} field="instagram_id" placeholder="ユーザー名のみ" onChange={handleChange} />
          <InputField label="X (Twitter) ID" value={profile.x_id} field="x_id" placeholder="ユーザー名のみ" onChange={handleChange} />
          <InputField label="WebサイトURL" value={profile.website_url} field="website_url" placeholder="https://..." onChange={handleChange} />
        </section>
        
        <button 
          onClick={handleSave} 
          className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          保存して公開する
        </button>
      </main>
    </div>
  );
}