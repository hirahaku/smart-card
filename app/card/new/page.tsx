"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

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
    if (!profile.full_name || !profile.password) {
      alert("氏名とパスワードは必須です");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("profiles").insert([profile]);
    if (error) {
      alert(`作成失敗: ${error.message}`);
      setIsSubmitting(false);
    } else {
      alert("名刺を登録しました！");
      router.push(`/card/${profile.card_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 font-sans">
      <header className="p-6 border-b border-neutral-800 text-center font-bold">初期セットアップ</header>
      <main className="p-6 max-w-md mx-auto">
        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">セキュリティ</h2>
          <InputField label="パスワード（必須）" value={profile.password} field="password" type="password" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">基本情報</h2>
          <InputField label="氏名（必須）" value={profile.full_name} field="full_name" onChange={handleChange} />
          <InputField label="役職" value={profile.job_title} field="job_title" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 text-blue-400">スキル・資格</h2>
          <InputField label="保有資格" value={profile.certifications} field="certifications" onChange={handleChange} />
          <InputField label="スキル" value={profile.skills} field="skills" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 text-emerald-400">SNS・動画</h2>
          <InputField label="YouTube" value={profile.youtube_id} field="youtube_id" placeholder="@channel" onChange={handleChange} />
          <InputField label="TikTok" value={profile.tiktok_id} field="tiktok_id" placeholder="ID" onChange={handleChange} />
          <InputField label="Instagram" value={profile.instagram_id} field="instagram_id" onChange={handleChange} />
        </section>

        <button onClick={handleCreate} disabled={issubmitting} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-lg">
          {issubmitting ? "登録中..." : "この内容で登録する"}
        </button>
      </main>
    </div>
  );
}

export default function NewCard() {
  return (
    <Suspense fallback={<div className="p-10 text-white text-center">Loading...</div>}>
      <NewCardForm />
    </Suspense>
  );
}