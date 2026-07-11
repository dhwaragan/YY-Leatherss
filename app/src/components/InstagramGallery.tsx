import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, Edit2, Check, X, Film, Instagram, ArrowRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryItem {
  id: string;
  title: string;
  step: string;
  time: string;
  videoUrl: string;
  poster: string;
}

export const InstagramGallery: React.FC = () => {
  const { contentBlocks, updateContentBlock, user } = useApp();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  
  // Create an array of refs to control each native HTML5 video element directly
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Parse custom Instagram feed data from content_blocks or fallback to beautiful defaults
  const cbInstagram = contentBlocks.find(cb => cb.key === 'instagram');
  const defaultItems: GalleryItem[] = [
    {
      id: "ig-1",
      title: "Determining Grain Flow",
      step: "01 / PATTERN CUTTING",
      time: "Process Video • 1:45 mins",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "ig-2",
      title: "Double Stitch Lock",
      step: "02 / WAXLINEN DEVOTION",
      time: "Process Video • 2:20 mins",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "ig-3",
      title: "Blake Outsole Anchor",
      step: "03 / BLAKE WELT LOCK",
      time: "Process Video • 3:05 mins",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      poster: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "ig-4",
      title: "Melted Beeswax Lusters",
      step: "04 / ARTISAN POLISHING",
      time: "Process Video • 1:50 mins",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      poster: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const items: GalleryItem[] = cbInstagram ? JSON.parse(cbInstagram.value) : defaultItems;

  // Editor states
  const [editedItems, setEditedItems] = useState<GalleryItem[]>(items);
  const [customTitle, setCustomTitle] = useState(
    contentBlocks.find(cb => cb.key === 'instagram_title')?.value || "The 150-Step Handcraft Media Reels"
  );
  const [customSubtitle, setCustomSubtitle] = useState(
    contentBlocks.find(cb => cb.key === 'instagram_subtitle')?.value || "A visual saga of leather blueprints, waxes, patterns, and stitching recorded live in our Surapet workshops."
  );

  const handleSave = async () => {
    try {
      await updateContentBlock('instagram', editedItems);
      await updateContentBlock('instagram_title', customTitle);
      await updateContentBlock('instagram_subtitle', customSubtitle);
      setShowEditor(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.includes('instagram.com')) {
      const match = trimmed.match(/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        return `https://www.instagram.com/reel/${match[1]}/embed`;
      }
    }
    return trimmed;
  };

  const isInstagramUrl = (url: string) => {
    return url.trim().includes('instagram.com') || !!url.trim().match(/^[A-Za-z0-9_-]{11}$/);
  };

  // Hover Play and Unmute Handler
  const handleMouseEnter = (index: number, isInsta: boolean) => {
    setPlayingIndex(index);
    
    // For standard MP4 videos, auto-play programmatically and unmute
    if (!isInsta) {
      const videoEl = videoRefs.current[index];
      if (videoEl) {
        videoEl.muted = false;
        videoEl.play().catch(err => {
          // Browsers sometimes block unmuted autoplay without previous user interaction
          console.warn("Autoplay with audio blocked by browser settings, playing muted fallback:", err);
          videoEl.muted = true;
          videoEl.play();
        });
      }
    }
  };

  // Hover Pause and Mute Handler
  const handleMouseLeave = (index: number, isInsta: boolean) => {
    setPlayingIndex(null);

    if (!isInsta) {
      const videoEl = videoRefs.current[index];
      if (videoEl) {
        videoEl.pause();
        videoEl.muted = true;
      }
    }
  };

  return (
    <section id="handcraft-instagram-media-gallery" className="w-full px-4 sm:px-6 lg:px-8 space-y-8 select-none">
      <div className="text-center space-y-2 relative">
        <span className="text-leather text-xs tracking-[0.3em] font-sans font-bold uppercase block">
          ATELIER VIDEOS • CHENNAI INSTA REELS
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900">
          {customTitle}
        </h2>
        <p className="text-xs text-neutral-500 font-sans tracking-wide uppercase max-w-lg mx-auto">
          {customSubtitle}
        </p>

        {/* CMS Toggle button */}
        {user?.role === 'admin' && (
          <div className="pt-2">
            <button
              onClick={() => {
                setEditedItems(items);
                setShowEditor(!showEditor);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-sans font-medium text-amber-900 hover:text-white bg-amber-50 hover:bg-[#8B5A2B] border border-amber-200 hover:border-transparent rounded-full transition-all duration-300 cursor-pointer"
            >
              <Settings className="w-3 h-3 animate-spin-slow" />
              <span>Customize Insta Feed</span>
            </button>
          </div>
        )}
      </div>

      {/* Editor Modal Drawer */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6 overflow-hidden"
          >
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div className="flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-neutral-800 text-lg">Modify Instagram & Atelier Video Gallery</h3>
              </div>
              <button onClick={() => setShowEditor(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title / Subtitle configs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider font-sans block text-left">Gallery Headline Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-xs font-sans bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-left"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider font-sans block text-left">Gallery Info Subtitle</label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  className="w-full text-xs font-sans bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-left"
                />
              </div>
            </div>

            {/* Video Cards row editor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {editedItems.map((item, index) => (
                <div key={item.id} className="bg-white border border-stone-200 rounded-xl p-4 space-y-3 shadow-2xs">
                  <span className="text-[10px] font-bold text-amber-700 font-sans block text-left uppercase">Video Slot {index + 1}</span>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-500 block uppercase text-left">Process Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const copy = [...editedItems];
                        copy[index].title = e.target.value;
                        setEditedItems(copy);
                      }}
                      className="w-full text-xs font-sans bg-stone-50 border border-stone-200 rounded p-1.5 focus:outline-none text-left"
                      placeholder="Determining Grain Flow"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-500 block uppercase text-left">Step Description</label>
                    <input
                      type="text"
                      value={item.step}
                      onChange={(e) => {
                        const copy = [...editedItems];
                        copy[index].step = e.target.value;
                        setEditedItems(copy);
                      }}
                      className="w-full text-xs font-sans bg-stone-50 border border-stone-200 rounded p-1.5 focus:outline-none text-left"
                      placeholder="01 / PATTERN CUTTING"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-500 block uppercase text-left">Instagram Link or MP4 URL</label>
                    <input
                      type="text"
                      value={item.videoUrl}
                      onChange={(e) => {
                        const copy = [...editedItems];
                        copy[index].videoUrl = e.target.value;
                        setEditedItems(copy);
                      }}
                      className="w-full text-xs font-sans bg-stone-50 border border-stone-200 rounded p-1.5 focus:outline-none text-left"
                      placeholder="https://www.instagram.com/reel/..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-500 block uppercase text-left">Fallback Thumbnail Image</label>
                    <input
                      type="text"
                      value={item.poster}
                      onChange={(e) => {
                        const copy = [...editedItems];
                        copy[index].poster = e.target.value;
                        setEditedItems(copy);
                      }}
                      className="w-full text-xs font-sans bg-stone-50 border border-stone-200 rounded p-1.5 focus:outline-none text-left"
                      placeholder="Unsplash Image URL"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Insta Feed</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, index) => {
          const isPlaying = playingIndex === index;
          const isInsta = isInstagramUrl(item.videoUrl);

          return (
            <div 
              key={item.id} 
              className="relative aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden group border border-neutral-200/80 shadow-sm"
              onMouseEnter={() => handleMouseEnter(index, isInsta)}
              onMouseLeave={() => handleMouseLeave(index, isInsta)}
            >
              {/* Card Meta Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 text-white font-sans text-xs pointer-events-none">
                <span className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs w-max text-[9px] font-bold uppercase tracking-wider font-sans block text-left">
                  {item.step}
                </span>
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm block text-left">
                    {item.title}
                  </span>
                  <p className="text-[10px] text-neutral-300 leading-none text-left font-sans block">
                    {item.time}
                  </p>
                </div>
              </div>

              {/* Media viewer / dynamic active player */}
              <div className={`absolute inset-0 w-full h-full bg-black z-0 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {isInsta ? (
                  isPlaying && (
                    <iframe
                      src={getEmbedUrl(item.videoUrl) || undefined}
                      className="w-full h-full border-0 rounded-2xl"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      referrerPolicy="no-referrer"
                    />
                  )
                ) : (
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={item.videoUrl || undefined}
                    loop
                    playsInline
                    muted
                    controls={false}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                )}
              </div>

              <img
                src={item.poster || undefined}
                alt={item.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-[1000ms] filter brightness-75 group-hover:brightness-50 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
              />

              {/* Visual State Indicators (Optional/Informative badge) */}
              {isPlaying && (
                <div className="absolute top-4 right-4 z-20 bg-amber-600 animate-pulse text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>{isInsta ? 'Instagram Live' : 'Playing...'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
