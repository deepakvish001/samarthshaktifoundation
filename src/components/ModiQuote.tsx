import React from 'react';
import modiPhoto from '@/assets/modi-official-photo.jpg';

const ModiQuote = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-700"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/20 rotate-45 rounded-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/6 w-48 h-48 bg-orange-400/30 rotate-12 rounded-2xl animate-float-slower" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/15 -rotate-12 rounded-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,165,0,0.1),transparent_50%)]"></div>
        
        {/* Bottom fade for smooth transition */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-8 max-w-6xl mx-auto">
          {/* Modi Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-white/20 rounded-full blur-xl"></div>
              <img 
                src={modiPhoto} 
                alt="PM Shri Narendra Modi"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/30 shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          
          {/* Quote Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              WE NEED TO GIVE IMPETUS TO
            </h2>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-orange-200 leading-tight mt-2 drop-shadow-lg">
              ENTREPRENEURSHIP : PM SHRI NARENDRA MODI
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModiQuote;