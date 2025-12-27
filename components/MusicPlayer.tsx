
import React, { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  autoPlay?: boolean;
}

const DEFAULT_SOURCES = [
  "https://www.chosic.com/wp-content/uploads/2021/11/We-Wish-You-A-Merry-Christmas.mp3",
  "https://upload.wikimedia.org/wikipedia/commons/b/b7/We_Wish_you_a_Merry_Christmas_%28Kevin_MacLeod_%29_%28ISRC_USUAN1100369%29.oga"
];

const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSource = DEFAULT_SOURCES[sourceIndex];

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(e => console.log("Auto-play prevented", e));
      }
    }
  }, [autoPlay]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(tryNextSource);
    }
  };

  const tryNextSource = () => {
    if (sourceIndex < DEFAULT_SOURCES.length - 1) {
      setSourceIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto flex items-center gap-4">
      <audio
        ref={audioRef}
        loop
        src={currentSource}
        onError={tryNextSource}
      />
      
      <div className="flex items-center gap-3">
        {/* زر تشغيل/إيقاف الموسيقى */}
        <button
          onClick={toggleMusic}
          className={`group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border-2 transition-all duration-500 hover:scale-110 shadow-2xl ${
            isPlaying 
              ? 'border-green-500/50 bg-green-900/20' 
              : 'border-[#e1b147] bg-black/60'
          }`}
          title={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        >
          <span className="text-2xl md:text-3xl">
            {isPlaying ? '🎵' : '🔇'}
          </span>
        </button>

        {/* أيقونة إنستغرام */}
        <a
          href="https://www.instagram.com/3non_art/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#e1b147] bg-black/60 transition-all duration-500 hover:scale-110 shadow-2xl group"
          title="تابعني على إنستغرام @3non_art"
        >
          <svg 
            className="w-8 h-8 md:w-10 md:h-10 text-[#f9dfa5] transition-colors group-hover:text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default MusicPlayer;
