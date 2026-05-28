import { Shield, Award, Handshake, Building2, Globe, Users, GraduationCap, BookOpen, MapPin, Briefcase, Trophy, Star, Medal, Crown } from 'lucide-react';

const Partners = () => {
  const governmentPartners = [
    {
      name: 'NSDC (National Skill Development Corporation)',
      icon: GraduationCap,
      color: 'from-blue-500/20 to-indigo-500/20',
      iconBg: 'bg-blue-500/10'
    },
    {
      name: 'PMKVY (Pradhan Mantri Kaushal Vikas Yojana)',
      icon: BookOpen,
      color: 'from-orange-500/20 to-amber-500/20',
      iconBg: 'bg-orange-500/10'
    },
    {
      name: 'NIESBUD (National Institute for Entrepreneurship and Small Business Development)',
      icon: Briefcase,
      color: 'from-purple-500/20 to-violet-500/20',
      iconBg: 'bg-purple-500/10'
    },
    {
      name: 'NULM (National Urban Livelihoods Mission)',
      icon: MapPin,
      color: 'from-red-500/20 to-rose-500/20',
      iconBg: 'bg-red-500/10'
    },
    {
      name: 'Ministry of Skill Development & Entrepreneurship',
      icon: Shield,
      color: 'from-teal-500/20 to-cyan-500/20',
      iconBg: 'bg-teal-500/10'
    }
  ];

  const privatePartners = [
    { name: 'TCS (Tata Consultancy Services)', emoji: '💻', sector: 'IT Services' },
    { name: 'Infosys Limited', emoji: '🌐', sector: 'Technology' },
    { name: 'Wipro Technologies', emoji: '⚡', sector: 'IT Solutions' },
    { name: 'HCL Technologies', emoji: '🔧', sector: 'Tech Services' },
    { name: 'Tech Mahindra', emoji: '📱', sector: 'Digital Solutions' },
    { name: 'Accenture India', emoji: '🎯', sector: 'Consulting' },
    { name: 'Amazon India', emoji: '📦', sector: 'E-commerce' },
    { name: 'Flipkart', emoji: '🛒', sector: 'Online Retail' },
    { name: 'Reliance Industries', emoji: '🏭', sector: 'Conglomerate' },
    { name: 'ITC Limited', emoji: '🏢', sector: 'Consumer Goods' },
    { name: 'Bharti Airtel', emoji: '📡', sector: 'Telecommunications' },
    { name: 'HDFC Bank', emoji: '🏦', sector: 'Banking' }
  ];

  const awards = [
    {
      name: 'Best Skill Development Institute 2023',
      icon: Crown,
      color: 'from-yellow-500/20 to-amber-500/20',
      iconBg: 'bg-yellow-500/10'
    },
    {
      name: 'Excellence in Training Award',
      icon: Trophy,
      color: 'from-blue-500/20 to-indigo-500/20',
      iconBg: 'bg-blue-500/10'
    },
    {
      name: 'NSDC Recognition Certificate',
      icon: Medal,
      color: 'from-green-500/20 to-emerald-500/20',
      iconBg: 'bg-green-500/10'
    },
    {
      name: 'Industry Partnership Excellence',
      icon: Star,
      color: 'from-purple-500/20 to-violet-500/20',
      iconBg: 'bg-purple-500/10'
    },
    {
      name: 'Rural Development Impact Award',
      icon: Award,
      color: 'from-red-500/20 to-rose-500/20',
      iconBg: 'bg-red-500/10'
    }
  ];

  return (
    <section id="affiliates" className="section-padding">
      <div className="container-custom">
        {/* Ultra Premium Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/20 to-orange-400/10 border border-primary/30 rounded-full px-6 py-3 text-base mb-8 backdrop-blur-sm">
            <Handshake className="h-5 w-5 text-primary" />
            <span className="text-primary font-bold tracking-wide">Strategic Alliances</span>
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground mb-8 leading-tight">
            Our <span className="text-gradient-enhanced bg-clip-text">Elite</span><br />
            <span className="text-primary">Partnerships</span>
          </h2>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
            <span className="text-primary font-bold">Premium affiliations</span> with India's leading 
            <span className="text-gradient font-bold"> government bodies and industry giants</span> for unmatched placement success
          </p>
        </div>

        {/* Government Partnerships */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-4">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-primary font-semibold">Government Certifications</span>
            </div>
            <h3 className="text-2xl font-semibold text-foreground">
              Your Gateway to Government Certification
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {governmentPartners.map((partner, index) => (
              <div 
                key={partner.name}
                className={`bg-gradient-to-br ${partner.color} backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${partner.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <partner.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium text-foreground text-sm leading-relaxed">
                  {partner.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Private Partnerships */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-4">
              <Handshake className="h-4 w-4 text-primary" />
              <span className="text-primary font-semibold">Industry Partners</span>
            </div>
            <h3 className="text-2xl font-semibold text-foreground">
              Esteemed Private Placement Partners
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {privatePartners.map((partner, index) => (
              <div 
                key={partner.name}
                className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-4 text-center hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">{partner.emoji}</span>
                </div>
                <h4 className="font-medium text-foreground text-xs mb-1">
                  {partner.name}
                </h4>
                <p className="text-xs text-muted-foreground">{partner.sector}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-4">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-primary font-semibold">Hall of Fame</span>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Awards & Recognition
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A testament to our unwavering dedication to excellence in skill development and training
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {awards.map((award, index) => (
              <div 
                key={award.name}
                className={`bg-gradient-to-br ${award.color} backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${award.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <award.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium text-foreground text-sm leading-relaxed">
                  {award.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Stats */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Partner Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Government Programs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">States Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Placement Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;