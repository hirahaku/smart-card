import { createClient } from '@supabase/supabase-js';
// @ts-ignore
import vCardsJS from 'vcards-js';
import { User, Briefcase, Globe, Instagram, Mail, Phone, Download } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// props の型定義を最新版に合わせます
export default async function CardPage(props: { params: Promise<{ id: string }> }) {
  // params を await して中身を取り出します
  const params = await props.params;
  const id = params.id;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('card_id', id)
    .single();

  // データが見つからなかった時の表示
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
        <h1 className="text-xl font-bold mb-4">名刺が見つかりません</h1>
        <p className="text-gray-400">URL: /card/{id}</p>
        <p className="text-sm text-gray-500 mt-2">Supabaseの「card_id」列にこのIDがあるか確認してください。</p>
      </div>
    );
  }

  // vCard生成
  // @ts-ignore
  const vCard = vCardsJS();
  vCard.firstName = profile.full_name;
  vCard.organization = profile.job_title;
  vCard.cellPhone = profile.phone;
  const vCardData = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard.getFormattedString())}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">
      <main className="max-w-md mx-auto pt-16 pb-12 px-6">
        <div className="text-center mb-10">
          <div className="w-28 h-28 bg-neutral-800 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-neutral-700">
            <User size={48} className="text-neutral-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{profile.full_name}</h1>
          <p className="text-neutral-400">{profile.job_title}</p>
        </div>
        <div className="space-y-4">
          <a href={vCardData} download="contact.vcf" className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-bold">
            <Download size={20} /> 連絡先を保存
          </a>
          {profile.instagram_id && (
            <a href={`https://instagram.com/${profile.instagram_id}`} className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
              <Instagram size={20} className="text-pink-400" />
              <span>Instagram</span>
            </a>
          )}
        </div>
      </main>
    </div>
  );
}