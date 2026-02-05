"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { User, ShieldCheck, Share2, Award, Laptop } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const InputField = ({ label, value, field, placeholder, type = "text", onChange }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-gray-400 mb-1 ml-1">{label}</label>
    <input
      type={type}
      className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(field, e.target.value)}
    />
  </div>
);

function NewCardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [issubmitting, setIsSubmitting] = useState(false);
  
  const [profile, setProfile] = useState<any>({
    card_id: "", full_name: "", job_title: "", password: "",
    phone: "", email: "", line_id: "", instagram_id: "",
    x_id: "", website_url: "", tiktok_id: "", youtube_id: "",
    skills: "", certifications: ""
  });

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) setProfile((prev: any) => ({ ...prev, card_id: idFromUrl }));
  }, [searchParams]);

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!profile.full_name || !profile.password || !profile.card_id) {
      alert("ID、氏名、パスワードは必須です");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("profiles").insert([profile]);
    if (error) {
      alert(`作成失敗: ${error.message}`);
      setIsSubmitting(false);
    } else {
      localStorage.setItem("login_card_id", profile.card_id);
      router.push(`/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 font-sans selection:bg-blue-500/30">
      <header className="p-8 text-center">
        <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">
          SMART CARD SETTING
        </h1>
        <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em]">初期セットアップ</p>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {/* 重要：セキュリティと基本情報 */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <ShieldCheck size={18} />
            <h2 className="text-xs font-black uppercase tracking-widest">必須・セキュリティ</h2>
          </div>
          <InputField label="カードID (半角英数字)" value={profile.card_id} field="card_id" placeholder="例: tanaka01" onChange={handleChange} />
          <InputField label="管理用パスワード" value={profile.password} field="password" type="password" placeholder="編集時に必要です" onChange={handleChange} />
          <InputField label="氏名" value={profile.full_name} field="full_name" placeholder="山田 太郎" onChange={handleChange} />
          <InputField label="役職・肩書き" value={profile.job_title} field="job_title" placeholder="UX Designer / Manager" onChange={handleChange} />
        </section>

        {/* スキル・資格 */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Award size={18} />
            <h2 className="text-xs font-black uppercase tracking-widest">スキル・資格</h2>
          </div>
          <InputField label="保有資格" value={profile.certifications} field="certifications" placeholder="例: 応用情報技術者, TOEIC 800" onChange={handleChange} />
          <InputField label="主要スキル" value={profile.skills} field="skills" placeholder="例: React, Figma, 動画編集" onChange={handleChange} />
        </section>

        {/* SNS・連絡先（すべて） */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-purple-400">
            <Share2 size={18} />
            <h2 className="text-xs font-black uppercase tracking-widest">SNS・連絡先</h2>
          </div>
          <div className="grid grid-cols-1 gap-1">
            <InputField label="X (Twitter) ID" value={profile.x_id} field="x_id" placeholder="@なしのID" onChange={handleChange} />
            <InputField label="Instagram ID" value={profile.instagram_id} field="instagram_id" placeholder="ユーザー名" onChange={handleChange} />
            <InputField label="LINE ID" value={profile.line_id} field="line_id" placeholder="友達検索用ID" onChange={handleChange} />
            <InputField label="TikTok ID" value={profile.tiktok_id} field="tiktok_id" placeholder="@ユーザー名" onChange={handleChange} />
            <InputField label="YouTubeチャンネル" value={profile.youtube_id} field="youtube_id" placeholder="@channel_id" onChange={handleChange} />
            <InputField label="電話番号" value={profile.phone} field="phone" placeholder="09012345678" onChange={handleChange} />
            <InputField label="メールアドレス" value={profile.email} field="email" placeholder="example@mail.com" onChange={handleChange} />
            <InputField label="Webサイト URL" value={profile.website_url} field="website_url" placeholder="https://..." onChange={handleChange} />
          </div>
        </section>

        <button 
          onClick={handleCreate} 
          disabled={issubmitting} 
          className="w-full bg-white text-black font-black py-5 rounded-[2rem] shadow-xl hover:bg-neutral-200 active:scale-95 transition-all sticky bottom-6"
        >
          {issubmitting ? "登録中..." : "デジタル名刺を完成させる"}
        </button>
      </main>
    </div>
  );
}

export default function NewCard() {
  return (
    <Suspense fallback={<div className="p-10 text-white text-center">読み込み中...</div>}>
      <NewCardForm />
    </Suspense>
  );
}