"use client"; // クライアント側で動く設定
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditCard() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>({
    full_name: "",
    job_title: "",
    phone: "",
    instagram_id: "",
    x_id: "",
    line_id: "",
    website_url: "",
  });

  // 1. 最初に対象者のデータを読み込む
  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.from("profiles").select("*").eq("card_id", id).single();
      if (data) setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [id]);

  // 2. 保存ボタンを押した時の処理
  const handleSave = async () => {
    const { error } = await supabase.from("profiles").update(profile).eq("card_id", id);
    if (error) alert("保存に失敗しました");
    else {
      alert("保存しました！");
      router.push(`/card/${id}`); // 名刺ページへ戻る
    }
  };

  if (loading) return <div className="p-10 text-white">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <h1 className="text-xl font-bold mb-6">名刺情報の編集 ({id})</h1>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm text-gray-400">氏名</label>
          <input type="text" className="w-full bg-neutral-800 p-3 rounded" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-400">肩書き</label>
          <input type="text" className="w-full bg-neutral-800 p-3 rounded" value={profile.job_title} onChange={e => setProfile({...profile, job_title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-400">LINE ID</label>
          <input type="text" className="w-full bg-neutral-800 p-3 rounded" value={profile.line_id || ""} onChange={e => setProfile({...profile, line_id: e.target.value})} />
        </div>
        {/* 他のSNS項目も同様に追加可能 */}
        
        <button onClick={handleSave} className="w-full bg-white text-black font-bold py-4 rounded-xl mt-6">
          保存する
        </button>
      </div>
    </div>
  );
}