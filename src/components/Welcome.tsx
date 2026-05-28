import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Award, Sparkles, Star, Heart } from "lucide-react";

const Welcome = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-background/98 to-primary/3 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-blue-500/3 rotate-45 rounded-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-500/5 to-green-500/3 -rotate-12 rounded-2xl animate-float-slower" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-red-500/40 rounded-full animate-bounce delay-75"></div>
        <div className="absolute top-40 right-32 w-4 h-4 bg-blue-500/40 rounded-full animate-bounce delay-150"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-green-500/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-purple-500/40 rounded-full animate-bounce delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Welcome Header */}
          <div className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-border/20 mb-12 text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 px-6 py-3 rounded-full text-lg font-black mb-8 animate-scale-in border border-purple-200">
              <span className="text-2xl">✨</span>
              <span className="font-black">Welcome to Excellence in Education</span>
              <span className="text-2xl">✨</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
              <span className="text-foreground text-2xl md:text-3xl block mb-4 font-bold">
                Welcome to
              </span>
              <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent animate-fade-in delay-200 font-black">
                SAMARTH SHAKTI
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent animate-fade-in delay-400 font-black">
                FOUNDATION
              </span>
            </h1>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-8 shadow-lg border-l-4 border-green-500 max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-green-600 mb-4 flex items-center justify-center gap-3">
                <span className="text-3xl">🎯</span>
                TRANSFORMING LIVES THROUGH EDUCATION
              </h2>
              <p className="text-lg md:text-xl text-foreground font-bold leading-relaxed">
                We are dedicated to <span className="text-blue-600 font-black">empowering communities</span> through quality education, comprehensive 
                <span className="text-purple-600 font-black"> skill development</span>, and <span className="text-green-600 font-black">sustainable growth</span> initiatives. 
                Join us in building a brighter, more prosperous future for everyone.
              </p>
            </div>
          </div>

          {/* Enhanced Key Highlights */}
          <div className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-border/20">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
              <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <span className="text-4xl">🌟</span>
                OUR KEY STRENGTHS
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Community Focus */}
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100/70 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-purple-200/50 hover:border-purple-300 relative overflow-hidden animate-fade-in delay-700">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-purple-600/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="h-32 flex flex-col items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-purple-700 text-center mb-4">
                    COMMUNITY FOCUSED
                  </h3>
                  <p className="text-purple-600 text-center font-bold leading-relaxed">
                    <span className="font-black text-purple-700">Dedicated to Community Growth:</span><br />
                    We are committed to serving and uplifting local communities through comprehensive 
                    educational programs and community development initiatives.
                  </p>
                </div>
              </div>
              
              {/* Quality Education */}
              <div className="group bg-gradient-to-br from-orange-50 to-orange-100/70 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-orange-200/50 hover:border-orange-300 relative overflow-hidden animate-fade-in delay-800">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-orange-600/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="h-32 flex flex-col items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-orange-700 text-center mb-4">
                    QUALITY EDUCATION
                  </h3>
                  <p className="text-orange-600 text-center font-bold leading-relaxed">
                    <span className="font-black text-orange-700">Excellence in Learning:</span><br />
                    Providing accessible, comprehensive, and high-quality education for learners 
                    of all ages with modern teaching methodologies and resources.
                  </p>
                </div>
              </div>
              
              {/* Certified Programs */}
              <div className="group bg-gradient-to-br from-green-50 to-green-100/70 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-green-200/50 hover:border-green-300 relative overflow-hidden animate-fade-in delay-900">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="h-32 flex flex-col items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-green-700 text-center mb-4">
                    CERTIFIED PROGRAMS
                  </h3>
                  <p className="text-green-600 text-center font-bold leading-relaxed">
                    <span className="font-black text-green-700">Government Approved:</span><br />
                    Offering officially recognized, government-approved courses and comprehensive 
                    skill development programs with industry-standard certifications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Call to Action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 animate-fade-in delay-1000">
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-white/20"
            >
              <span className="text-xl font-black">🚀 EXPLORE OUR PROGRAMS</span>
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform font-bold" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="group border-3 border-blue-500/30 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:bg-blue-200 px-12 py-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <span className="text-xl font-black">💖 LEARN MORE ABOUT US</span>
              <Heart className="ml-3 h-6 w-6 group-hover:scale-125 transition-transform text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;