import React from 'react';

const MissionCourses = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background/98 to-primary/3 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/5 to-blue-500/3 rotate-45 rounded-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-500/5 to-green-500/3 -rotate-12 rounded-2xl animate-float-slower" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header Card */}
          <div className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-border/20 mb-12 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              <span className="text-foreground">WELCOME TO </span>
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">SAMARTH </span>
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">SHAKTI </span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">FOUNDATION</span>
            </h1>
            
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-8 shadow-lg border-l-4 border-red-500 max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-red-600 mb-4 flex items-center justify-center gap-3">
                <span className="text-3xl">🎯</span>
                OUR MISSION
              </h2>
              <p className="text-lg md:text-xl text-foreground font-semibold leading-relaxed">
                Our mission is to create a <span className="text-blue-600 font-bold">digital</span> and <span className="text-green-600 font-bold">skilled India</span> through comprehensive training and development programs.
              </p>
            </div>
          </div>

          {/* Courses Section */}
          <div className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-border/20">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <span className="text-4xl">📚</span>
                COURSES OFFERED
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* PMKVY Course */}
              <div className="group bg-gradient-to-br from-orange-50 to-orange-100/70 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-orange-200/50 hover:border-orange-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-orange-600/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="h-40 flex flex-col items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <span className="text-2xl text-white">🏆</span>
                    </div>
                    <div className="text-orange-700 font-bold text-center text-sm leading-relaxed">
                      <div className="text-xs">प्रधानमंत्री कौशल विकास योजना</div>
                      <div className="text-base font-black">PRADHAN MANTRI KAUSHAL VIKAS YOJANA</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-orange-700 text-center mb-3">PMKVY</h3>
                  <p className="text-sm text-orange-600 text-center font-medium">
                    Skill Development for Better Future
                  </p>
                </div>
              </div>

              {/* PMGDISHA Course */}
              <div className="group bg-gradient-to-br from-green-50 to-green-100/70 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-green-200/50 hover:border-green-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="h-40 flex flex-col items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <span className="text-2xl text-white">💻</span>
                    </div>
                    <div className="text-green-700 font-bold text-center text-sm leading-relaxed">
                      <div className="text-base font-black">PRADHAN MANTRI GRAMIN</div>
                      <div>DIGITAL SAKSHARTA ABHIYAN</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-green-700 text-center mb-3">PMGDISHA</h3>
                  <p className="text-sm text-green-600 text-center font-medium">
                    Digital Literacy for Rural India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionCourses;