"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export default function NewCard() {
  const router = useRouter();
  const [issubmitting, setIsSubmitting] = useState(false);
  
  const [profile, setProfile] = useState({
    card_id: "", // ここが新しい名刺のURLになるID
    full_name: "",
    job_title: "",
    phone: "",
    email: "",
    line_id: "",
    instagram_id: "",
    x_id: "",
    website_url: "",
  });

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!profile.card_id || !profile.full_name) {
      alert("名刺IDと氏名は必須です");
      return;
    }

    setIsSubmitting(true);
    // Supabaseに新しい行を追加 (insert)
    const { error } = await supabase.from("profiles").insert([profile]);

    if (error) {
      alert(`作成に失敗しました: ${error.message}`);
      setIsSubmitting(false);
    } else {
      alert("新しい名刺を作成しました！");
      router.push(`/card/${profile.card_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      <header className="p-6 border-b border-neutral-800 bg-neutral-950 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-center">新規名刺作成</h1>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 italic text-blue-400">重要設定</h2>
          <InputField 
            label="名刺ID (URLになります)" 
            value={profile.card_id} 
            field="card_id" 
            placeholder="例: tanaka-01 (半角英数字)" 
            onChange={handleChange} 
          />
          <p className="text-xs text-gray-500 mt-1 mb-4">※このIDが /card/◯◯ の部分に使われます。他と被らないようにしてください。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">基本情報</h2>
          <InputField label="氏名" value={profile.full_name} field="full_name" onChange={handleChange} />
          <InputField label="役職・肩書き" value={profile.job_title} field="job_title" onChange={handleChange} />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">連絡先・SNS</h2>
          <InputField label="電話番号" value={profile.phone} field="phone" onChange={handleChange} />
          <InputField label="メールアドレス" value={profile.email} field="email" onChange={handleChange} />
          <InputField label="LINE ID" value={profile.line_id} field="line_id" onChange={handleChange} />
          <InputField label="Instagram ID" value={profile.instagram_id} field="instagram_id" onChange={handleChange} />
        </section>
        
        <button 
          onClick={handleCreate} 
          disabled={issubmitting}
          className={`w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform ${issubmitting ? 'opacity-50' : ''}`}
        >
          {issubmitting ? "作成中..." : "名刺を発行する"}
        </button>
      </main>
    </div>
  );
}