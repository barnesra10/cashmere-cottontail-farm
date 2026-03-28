import { useState, useEffect } from 'react';
import { ArrowLeft, Facebook, Instagram, Edit3, Send, Clock, X, Copy, CheckCircle, Loader } from 'lucide-react';
import SEO from '../components/SEO';

const EDGE_URL = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/social-preview';

function getAdminKeyFromSession() {
  return sessionStorage.getItem('ccf_admin_key') || '';
}

// TikTok icon since lucide doesn't have one
function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z"/>
    </svg>
  );
}

const PLATFORM_CONFIG = {
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-600',
    maxLength: 63206,
    optimalLength: 400,
    note: 'No prices shown. Narrative, warm tone. Link to website.',
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    lightColor: 'bg-pink-50 border-pink-200',
    textColor: 'text-pink-600',
    maxLength: 2200,
    optimalLength: 2000,
    note: 'Hashtag-rich. First line is the hook. Emojis welcome.',
  },
  tiktok: {
    name: 'TikTok',
    icon: TikTokIcon,
    color: 'bg-black',
    lightColor: 'bg-gray-50 border-gray-300',
    textColor: 'text-gray-800',
    maxLength: 2200,
    optimalLength: 300,
    note: 'Short & punchy. Trending hashtags. Call to action.',
  }
};

export default function SocialPreview() {
  const [loading, setLoading] = useState(true);
  const [captions, setCaptions] = useState({});
  const [enabled, setEnabled] = useState({ facebook: true, instagram: true, tiktok: true });
  const [editing, setEditing] = useState(null);
  const [posting, setPosting] = useState({});
  const [posted, setPosted] = useState({});
  const [animalData, setAnimalData] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    // Get animal data from sessionStorage (set by QuickPost after creating)
    const data = sessionStorage.getItem('ccf_social_preview');
    if (data) {
      const parsed = JSON.parse(data);
      setAnimalData(parsed);
      generateCaptions(parsed);
    } else {
      setLoading(false);
    }
  }, []);

  const generateCaptions = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': getAdminKeyFromSession() },
        body: JSON.stringify({
          animal_name: data.animal?.name || data.name,
          breed: data.breedName || data.breed,
          sex: data.animal?.sex || data.sex,
          role: data.animal?.role || data.role,
          price: data.animal?.price || data.price,
          description: data.animal?.description || data.description,
          media_urls: data.media_urls || [],
        })
      });
      const result = await res.json();
      setCaptions({
        facebook: result.facebook || '',
        instagram: result.instagram || '',
        tiktok: result.tiktok || '',
      });
    } catch (err) {
      console.error('Failed to generate captions:', err);
    }
    setLoading(false);
  };

  const postToBuffer = async (platform) => {
    setPosting(prev => ({ ...prev, [platform]: true }));
    try {
      const res = await fetch(EDGE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': getAdminKeyFromSession() },
        body: JSON.stringify({
          platform,
          caption: captions[platform],
          media_urls: animalData?.media_urls || [],
        })
      });
      const result = await res.json();
      if (result.success) {
        setPosted(prev => ({ ...prev, [platform]: true }));
      } else {
        alert(`Failed to post to ${platform}: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Failed: ${err.message}`);
    }
    setPosting(prev => ({ ...prev, [platform]: false }));
  };

  const postAll = async () => {
    for (const platform of Object.keys(enabled)) {
      if (enabled[platform] && !posted[platform] && captions[platform]) {
        await postToBuffer(platform);
      }
    }
  };

  const copyCaption = (platform) => {
    navigator.clipboard.writeText(captions[platform]);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!animalData && !loading) {
    return (
      <>
        <SEO title="Social Preview" description="" />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <p className="font-body text-charcoal-400">No animal data found. Post an animal from the Quick Post page first.</p>
          <a href="/post" className="inline-block mt-4 bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Go to Quick Post</a>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Social Media Preview" description="" />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <a href="/post" className="text-charcoal-300 hover:text-charcoal-500"><ArrowLeft className="w-5 h-5" /></a>
          <h1 className="font-display text-xl font-bold text-charcoal-600">Social Media Preview</h1>
        </div>

        {/* Animal summary */}
        {animalData && (
          <div className="bg-cream-100 rounded-xl p-4 mb-6 border border-cream-200">
            <p className="font-display font-semibold text-charcoal-600">{animalData.animal?.name || animalData.name}</p>
            <p className="text-xs text-charcoal-300">{animalData.breedName || animalData.breed} · {animalData.animal?.sex || animalData.sex} · {animalData.media_urls?.length || 0} media</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-8 h-8 text-sage-500 mx-auto mb-4 animate-spin" />
            <p className="font-body text-charcoal-400">Claude is writing your social media posts...</p>
            <p className="font-body text-xs text-charcoal-300 mt-1">Optimizing for each platform</p>
          </div>
        ) : (
          <>
            {/* Platform cards */}
            <div className="space-y-4 mb-6">
              {Object.entries(PLATFORM_CONFIG).map(([platform, config]) => {
                const Icon = config.icon;
                const caption = captions[platform] || '';
                const isEditing = editing === platform;
                const isPosted = posted[platform];
                const isPosting = posting[platform];
                const isEnabled = enabled[platform];

                return (
                  <div key={platform} className={`rounded-xl border overflow-hidden transition-opacity ${isEnabled ? config.lightColor : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${config.color} flex items-center justify-center`}>
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-semibold text-sm text-charcoal-600">{config.name}</span>
                        {isPosted && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="flex items-center gap-1">
                        {!isPosted && (
                          <button onClick={() => setEnabled(prev => ({ ...prev, [platform]: !isEnabled }))}
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                            {isEnabled ? 'On' : 'Skip'}
                          </button>
                        )}
                      </div>
                    </div>

                    {isEnabled && (
                      <div className="px-4 pb-3">
                        {/* Caption */}
                        {isEditing ? (
                          <div>
                            <textarea value={caption}
                              onChange={e => setCaptions(prev => ({ ...prev, [platform]: e.target.value }))}
                              rows={6}
                              className="w-full px-3 py-2 bg-white border border-cream-200 rounded-lg text-sm text-charcoal-600 resize-none focus:outline-none focus:ring-2 focus:ring-sage-300"
                              maxLength={config.maxLength} />
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-[10px] ${caption.length > config.optimalLength ? 'text-amber-500' : 'text-charcoal-300'}`}>
                                {caption.length}/{config.maxLength} (optimal: {config.optimalLength})
                              </span>
                              <button onClick={() => setEditing(null)} className="text-xs text-sage-500 font-semibold">Done</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-charcoal-600 leading-relaxed whitespace-pre-wrap line-clamp-6">{caption}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button onClick={() => setEditing(platform)} className="text-[10px] text-charcoal-300 hover:text-charcoal-500 flex items-center gap-1">
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                              <button onClick={() => copyCaption(platform)} className="text-[10px] text-charcoal-300 hover:text-charcoal-500 flex items-center gap-1">
                                <Copy className="w-3 h-3" /> {copied === platform ? 'Copied!' : 'Copy'}
                              </button>
                              <span className={`text-[10px] ${caption.length > config.optimalLength ? 'text-amber-500' : 'text-charcoal-200'}`}>
                                {caption.length} chars
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Post button per platform */}
                        {!isPosted && (
                          <button onClick={() => postToBuffer(platform)} disabled={isPosting || !caption}
                            className={`mt-3 w-full py-2 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-40 ${config.color}`}>
                            {isPosting ? <><Loader className="w-4 h-4 animate-spin" /> Posting...</> : <><Send className="w-4 h-4" /> Post to {config.name}</>}
                          </button>
                        )}
                        {isPosted && (
                          <div className="mt-2 text-center text-xs text-green-600 font-semibold">Posted to {config.name}!</div>
                        )}

                        <p className="text-[9px] text-charcoal-200 mt-2">{config.note}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Post All button */}
            {Object.values(posted).filter(Boolean).length < Object.values(enabled).filter(Boolean).length && (
              <button onClick={postAll}
                className="w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-lg transition-colors shadow-lg mb-4">
                <Send className="w-5 h-5" /> Post to All Platforms
              </button>
            )}

            {Object.values(posted).filter(Boolean).length > 0 && Object.values(posted).filter(Boolean).length === Object.values(enabled).filter(Boolean).length && (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-sage-500 mx-auto mb-3" />
                <p className="font-display text-lg font-bold text-charcoal-600">All posts sent!</p>
                <a href="/post" className="inline-block mt-4 bg-sage-500 text-white font-semibold px-6 py-3 rounded-full">Post Another Animal</a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
