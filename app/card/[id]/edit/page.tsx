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
  const [inputPassword, setInputPassword] = useState("");
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
    if (inputPassword !== profile.password) {
      alert("パスワードが正しくありません。");
      return;
    }
    const { error } = await supabase.from("profiles").update(profile).eq("card_id", id);
    if (error) alert("保存失敗");
    else {
      alert("更新しました！");
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
        <section className="mb-10 p-5 bg-red-950/20 border border-red-900/30 rounded-3xl">
          <InputField label="編集用パスワード" value={inputPassword} field="password" type="password" onChange={(_:any, v:string) => setInputPassword(v)} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">基本情報</h2>
          <InputField label="氏名" value={profile.full_name} field="full_name" onChange={handleChange} />
          <InputField label="役職" value={profile.job_title} field="job_title" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-blue-400">スキル・資格</h2>
          <InputField label="保有資格" value={profile.certifications} field="certifications" placeholder="例: 英検1級, 宅建" onChange={handleChange} />
          <InputField label="スキル" value={profile.skills} field="skills" placeholder="例: 動画編集, Python" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-emerald-400">SNS・動画</h2>
          <InputField label="YouTubeチャンネルID" value={profile.youtube_id} field="youtube_id" placeholder="@channel_id" onChange={handleChange} />
          <InputField label="TikTok ID" value={profile.tiktok_id} field="tiktok_id" placeholder="ユーザー名のみ" onChange={handleChange} />
          <InputField label="Instagram ID" value={profile.instagram_id} field="instagram_id" onChange={handleChange} />
          <InputField label="X ID" value={profile.x_id} field="x_id" onChange={handleChange} />
          <InputField label="LINE ID" value={profile.line_id} field="line_id" onChange={handleChange} />
          <InputField label="電話番号" value={profile.phone} field="phone" onChange={handleChange} />
          <InputField label="Webサイト" value={profile.website_url} field="website_url" onChange={handleChange} />
        </section>
        
        <button onClick={handleSave} className="w-full bg-white text-black font-black py-4 rounded-2xl">保存する</button>
      </main>
    </div>
  );
}