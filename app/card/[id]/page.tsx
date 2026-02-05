import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
// @ts-ignore
import vCardsJS from 'vcards-js';
import { User, Instagram, Mail, Phone, Download, Globe, MessageCircle, Send, Award, Youtube, Video } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function CardPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { data: profile, error } = await supabase.from('profiles').select('*').eq('card_id', id).single();
  if (!profile || error) redirect(`/card/new?id=${id}`);

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
          <div className="w-24 h-24 bg-neutral-800 rounded-3xl mx-auto mb-4 flex items-center justify-center border border-neutral-700">
            <User size={40} className="text-neutral-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{profile.full_name}</h1>
          <p className="text-blue-400 text-sm font-medium">{profile.job_title}</p>
        </div>

        {/* スキル・資格セクション */}
        {(profile.certifications || profile.skills) && (
          <div className="mb-8 p-5 bg-neutral-900/50 border border-neutral-800 rounded-3xl">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <Award size={14} /> Skills & Certs
            </div>
            {profile.certifications && <p className="text-sm text-white mb-2">● {profile.certifications}</p>}
            {profile.skills && <p className="text-sm text-gray-400">● {profile.skills}</p>}
          </div>
        )}

        <div className="space-y-3">
          <a href={vCardData} download="contact.vcf" className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-bold mb-6">
            <Download size={20} /> 連絡先を保存
          </a>

          {/* SNSボタン群 */}
          <div className="grid grid-cols-1 gap-3">
            {profile.phone && <LinkButton href={`tel:${profile.phone}`} icon={<Phone size={20} className="text-blue-400" />} label="電話をかける" />}
            {profile.youtube_id && <LinkButton href={`https://youtube.com/${profile.youtube_id}`} icon={<Youtube size={20} className="text-red-500" />} label="YouTube" />}
            {profile.tiktok_id && <LinkButton href={`https://tiktok.com/@${profile.tiktok_id}`} icon={<Video size={20} className="text-pink-500" />} label="TikTok" />}
            {profile.instagram_id && <LinkButton href={`https://instagram.com/${profile.instagram_id}`} icon={<Instagram size={20} className="text-purple-400" />} label="Instagram" />}
            {profile.line_id && <LinkButton href={`https://line.me/ti/p/~${profile.line_id}`} icon={<MessageCircle size={20} className="text-green-500" />} label="LINE" />}
            {profile.website_url && <LinkButton href={profile.website_url} icon={<Globe size={20} className="text-emerald-400" />} label="Website" />}
          </div>
        </div>
      </main>
    </div>
  );
}

const LinkButton = ({ href, icon, label }: any) => (
  <a href={href} target="_blank" className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:bg-neutral-800 transition-all">
    {icon}
    <span className="flex-1 font-medium">{label}</span>
  </a>
);