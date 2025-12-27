import React from 'react';
import SnowLayer from './components/SnowLayer';
import FireworksLayer from './components/FireworksLayer';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0a192f] via-[#020c1b] to-black overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Background Layers */}
      <SnowLayer />
      <FireworksLayer />
      
      {/* Background Music & Social */}
      <MusicPlayer autoPlay={true} />

      {/* Content Overlay */}
      <div className="relative z-30 text-center px-4 pointer-events-none animate-in fade-in zoom-in duration-1000">
        <h1 className="font-playfair text-6xl md:text-8xl mb-6 gold-text animate-pulse">
          Merry Christmas
          <span className="block mt-2">2026</span>
        </h1>
        
        <p className="font-amiri text-xl md:text-3xl text-yellow-100/80 max-w-2xl mx-auto leading-relaxed tracking-wide opacity-90">
          اتمنى لك عاماً جميلاً
          <br />
          <span className="text-lg md:text-xl text-yellow-500/60 mt-4 block">
            اضغط على السماء لاحتفال خاص!
          </span>
        </p>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-8 opacity-40">
           <span className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎄</span>
           <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
           <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎅</span>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-500/5 to-transparent pointer-events-none" />
      
      {/* Corner Decorations */}
      <div className="fixed top-4 left-4 text-white/10 text-4xl pointer-events-none hidden md:block">❄️</div>
      <div className="fixed top-4 right-4 text-white/10 text-4xl pointer-events-none hidden md:block">❄️</div>
    </div>
  );
};

export default App;