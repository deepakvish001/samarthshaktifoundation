import { 
  GraduationCap,
  Target,
  Users,
  Monitor,
  Building2,
  Award,
  CheckCircle,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Briefcase,
  Stethoscope,
  Camera,
  Sparkles,
  Shirt,
  Wheat,
  BookOpen,
  UserCheck,
  Factory,
  ArrowRight,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const NSQF = () => {
  const sectors = [
    {
      name: "Agriculture",
      icon: Wheat,
      description: "Modern farming techniques and agricultural practices"
    },
    {
      name: "Healthcare",
      icon: Stethoscope,
      description: "Medical assistance and healthcare support services"
    },
    {
      name: "Media & Entertainment",
      icon: Camera,
      description: "Digital media production and entertainment industry skills"
    },
    {
      name: "Beauty and Wellness",
      icon: Sparkles,
      description: "Beauty therapy and wellness service expertise"
    },
    {
      name: "Apparel",
      icon: Shirt,
      description: "Garment manufacturing and fashion industry skills"
    }
  ];

  const commitments = [
    {
      title: "Lab Establishment",
      description: "Delivering and installing tools, machinery, and equipment to set up fully functional vocational training labs.",
      icon: Building2
    },
    {
      title: "Vocational Trainer Deployment",
      description: "Recruiting and deploying highly trained vocational trainers (VTs) to deliver practical and theoretical lessons to students.",
      icon: UserCheck
    },
    {
      title: "Monitoring Manpower Deployment",
      description: "Appointing dedicated personnel for the continuous monitoring and evaluation of the program's progress.",
      icon: Monitor
    },
    {
      title: "Guest Lectures",
      description: "Organizing expert-led guest sessions to provide insights into industry trends and real-world practices.",
      icon: Users
    },
    {
      title: "Industrial Visits",
      description: "Coordinating visits to industries to give students first-hand exposure to workplace environments and operations.",
      icon: Factory
    }
  ];

  const stats = [
    { number: "480+", label: "Schools Equipped", icon: Building2 },
    { number: "29", label: "States Covered", icon: MapPin },
    { number: "5", label: "Key Sectors", icon: Target },
    { number: "100%", label: "Industry Ready", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-500/3 to-muted/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--blue-500)/0.1),transparent_50%)]"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-1/3 left-12 w-28 h-28 bg-green-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-24 right-1/4 w-44 h-44 bg-primary/8 rounded-full blur-3xl animate-float" style={{animationDelay: '5s'}}></div>
          <div className="absolute bottom-40 left-1/3 w-32 h-32 bg-blue-500/6 rounded-full blur-2xl animate-float" style={{animationDelay: '7s'}}></div>
        </div>
        
        <div className="relative z-10 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-card/80 to-card/60 border border-blue-500/30 rounded-full px-8 py-4 shadow-lg backdrop-blur-sm animate-pulse-glow">
                <GraduationCap className="h-6 w-6 text-blue-500 animate-pulse" />
                <span className="text-sm font-bold text-foreground tracking-wider">NATIONAL INITIATIVE</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              </div>
              
              {/* Enhanced Main Title */}
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight animate-fade-in">
                  National Skills Qualification Framework<br />
                  <span className="text-gradient bg-gradient-to-r from-blue-500 via-primary to-green-500 bg-clip-text text-transparent animate-glow">
                    (NSQF) Project
                  </span>
                </h1>
                
                {/* Enhanced Subtitle */}
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground animate-slide-in-left">
                    Empowering the Future of Work
                  </h2>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative text-xl md:text-2xl font-black text-foreground bg-gradient-to-r from-muted to-muted/80 rounded-2xl px-8 py-4 inline-block shadow-xl border border-border group-hover:scale-105 transition-all duration-300">
                      Skills for Tomorrow's Industries
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="max-w-4xl mx-auto space-y-4">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  <span className="text-primary font-semibold">SAMARTH SHAKTI FOUNDATION</span> with 5+ years of excellence and 25,000+ students empowered, partners with JEPC and state governments to transform <span className="text-primary font-semibold">vocational education</span> nationwide
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Aligning education with modern workforce demands through hands-on training and industry-ready skill development programs
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">480+</div>
                  <div className="text-sm font-medium text-muted-foreground">Schools Equipped</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">29</div>
                  <div className="text-sm font-medium text-muted-foreground">States Covered</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5</div>
                  <div className="text-sm font-medium text-muted-foreground">Key Sectors</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm font-medium text-muted-foreground">Industry Ready</div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="space-y-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg shadow-sm font-medium">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Us Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Industry Partnerships</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Advanced Equipment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Expert Training</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Lab Infrastructure Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">LAB INFRASTRUCTURE</span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              State-of-the-Art <span className="text-gradient bg-gradient-to-r from-blue-500 via-primary to-green-500 bg-clip-text text-transparent">Lab Infrastructure</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-5xl mx-auto font-medium leading-relaxed">
              Advanced laboratories in <span className="text-blue-500 font-bold">480+ schools</span> equipped with cutting-edge tools and technology for hands-on training in high-demand sectors
            </p>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center mt-8">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {sectors.map((sector, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
                
                {/* Floating Icon Background */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <CardContent className="relative p-8 md:p-10 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                      <sector.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                      {sector.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                      {sector.description}
                    </p>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="pt-4">
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Bottom Stats */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-primary/20 rounded-2xl px-8 py-4">
              <Award className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-foreground">Industry-Ready Training Infrastructure</span>
              <Sparkles className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Implementation Commitments Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.1),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.05),transparent_60%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-green-500/10 rounded-full blur-lg animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-float" style={{animationDelay: '6s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-blue-500/10 to-green-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">IMPLEMENTATION EXCELLENCE</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              Our <span className="text-gradient bg-gradient-to-r from-primary via-blue-500 to-green-500 bg-clip-text text-transparent">Commitments</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto font-medium leading-relaxed">
              <span className="text-primary font-bold">SAMARTH SHAKTI FOUNDATION</span> ensures seamless project implementation through comprehensive support and expert services
            </p>
          </div>
          
          <div className="space-y-12">
            {commitments.map((commitment, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <CardContent className="relative p-8 md:p-12">
                  <div className="flex items-start gap-10">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <commitment.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                        {commitment.title}
                      </h3>
                      <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                        {commitment.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="pt-4">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-full blur-lg group-hover:scale-150 transition-all duration-500"></div>
                        <CheckCircle className="relative h-10 w-10 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Partnership Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="absolute top-1/4 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <CardContent className="relative p-8 md:p-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-full px-6 py-3">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="text-primary font-bold">Partnership Excellence</span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
                        Key Partner in <span className="text-primary">Educational Transformation</span>
                      </h3>
                    </div>
                    
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                      Our collaboration with <span className="text-blue-500 font-bold">Jharkhand Education Project Council (JEPC)</span> and various state governments demonstrates our commitment to transforming vocational education across India.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-primary/30 transition-colors duration-300">
                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-muted-foreground font-medium">Industry-aligned curriculum development</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-blue-500/30 transition-colors duration-300">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-muted-foreground font-medium">Hands-on practical training approach</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-green-500/30 transition-colors duration-300">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-muted-foreground font-medium">Continuous monitoring and evaluation</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-purple-500/30 transition-colors duration-300">
                        <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                        <span className="text-muted-foreground font-medium">Industry exposure and networking</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-10 border border-border shadow-2xl transform hover:scale-105 transition-all duration-500">
                      <div className="text-center space-y-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                          <Building2 className="relative h-20 w-20 text-primary mx-auto" />
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-2xl md:text-3xl font-black text-foreground">Future-Ready Infrastructure</h4>
                          <p className="text-muted-foreground font-medium leading-relaxed">
                            Advanced labs equipped with cutting-edge technology to prepare students for tomorrow's challenges.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center space-y-2">
                            <div className="text-3xl font-black text-primary">480+</div>
                            <div className="text-sm text-muted-foreground font-medium">Schools Equipped</div>
                          </div>
                          <div className="text-center space-y-2">
                            <div className="text-3xl font-black text-blue-500">5</div>
                            <div className="text-sm text-muted-foreground font-medium">Key Sectors</div>
                          </div>
                        </div>
                        
                        {/* Progress Indicators */}
                        <div className="space-y-3">
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                          </div>
                          <div className="text-sm text-muted-foreground">Implementation Progress: 80%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl px-8 py-4">
              <Target className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Transforming Education Through Innovation</span>
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NSQF;