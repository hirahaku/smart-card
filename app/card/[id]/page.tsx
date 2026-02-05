import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation'; // ★これが必要です！
// @ts-ignore
import vCardsJS from 'vcards-js';
import { User, Instagram, Mail, Phone, Download, Globe, MessageCircle, Send } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CardPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('card_id', id)
    .single();

  // データがない場合は新規作成画面へ
  if (!profile || error) {
    redirect(`/card/new?id=${id}`); 
  }

  // vCard生成
  // @ts-ignore
  const vCard = vCardsJS();
  vCard.firstName = profile.full_name;
  vCard.organization = profile.job_title;
  vCard.cellPhone = profile.phone;
  vCard.email = profile.email;
  const vCardData = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard.getFormattedString())}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans pb-20">
      <main className="max-w-md mx-auto pt-16 px-6">
        <div className="text-center mb-10">
          <div className="w-28 h-28 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-neutral-700 shadow-xl">
            <User size={48} className="text-neutral-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{profile.full_name}</h1>
          <p className="text-neutral-400 font-medium">{profile.job_title}</p>
        </div>

        <div className="space-y-3">
          <a href={vCardData} download="contact.vcf" className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-neutral-200 transition-colors">
            <Download size={20} /> 連絡先を保存
          </a>

          <div className="grid grid-cols-1 gap-3">
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:bg-neutral-800 transition-all">
                <Phone size={20} className="text-blue-400" />
                <span className="flex-1">電話をかける</span>
              </a>
            )}

            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:bg-neutral-800 transition-all">
                <Mail size={20} className="text-emerald-400" />
                <span className="flex-1">メールを送る</span>
              </a>
            )}

            {profile.line_id && (
              <a href={`https://line.me/ti/p/~${profile.line_id}`} target="_blank" className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:bg-neutral-800 transition-all">
                <MessageCircle size={20} className="text-green-500" />
                <span className="flex-1">LINEを追加</span>
              </a>
            )}

            {profile.instagram_id && (
              <a href={`https://instagram.com/${profile.instagram_id}`} target="_blank" className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:bg-neutral-800 transition-all">
                <Instagram size={20} className="text-pink-500" />
                <span className="flex-1">Instagram</span>
              </a>
            )}

            {profile.x_id && (
              <a href={`https://x.com/${profile.x_id}`} target="_blank" className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:bg-neutral-800 transition-all">
                <Send size={20} className="text-sky-400" />
                <span className="flex-1">X (Twitter)</span>
              </a>
            )}

            {profile.website_url && (
              <a href={profile.website_url} target="_blank" className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:bg-neutral-800 transition-all">
                <Globe size={20} className="text-indigo-400" />
                <span className="flex-1">公式Webサイト</span>
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}