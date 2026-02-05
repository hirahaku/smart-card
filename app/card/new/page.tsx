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
    card_id: "", 
    full_name: "",
    job_title: "",
    password: "", // パスワード項目を追加
    phone: "",
    email: "",
    line_id: "",
    instagram_id: "",
    x_id: "",
    website_url: "",
  });

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setProfile((prev: any) => ({ ...prev, card_id: idFromUrl }));
    }
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
      alert("名刺を登録しました！パスワードは忘れないようにしてください。");
      router.push(`/card/${profile.card_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      <header className="p-6 border-b border-neutral-800 text-center font-bold">初期セットアップ</header>
      <main className="p-6 max-w-md mx-auto">
        <div className="mb-8 p-4 bg-blue-900/20 border border-blue-800 rounded-xl text-center">
          <p className="text-xs text-blue-300 mb-1 font-bold">割り当てられたID</p>
          <p className="text-lg font-mono text-white">{profile.card_id || "IDを取得中..."}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">セキュリティ設定</h2>
          <InputField label="編集用パスワード（必須）" value={profile.password} field="password" type="password" placeholder="今後、情報を直す際に必要です" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">基本情報</h2>
          <InputField label="氏名（必須）" value={profile.full_name} field="full_name" onChange={handleChange} placeholder="山田 太郎" />
          <InputField label="役職" value={profile.job_title} field="job_title" onChange={handleChange} placeholder="営業部" />
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

        <button onClick={handleCreate} disabled={issubmitting} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
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