import { 
  Users, 
  Target, 
  BookOpen, 
  Award, 
  Globe, 
  Heart, 
  Shield, 
  Droplets, 
  Leaf, 
  Building, 
  UserCheck,
  Crown,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  Calendar,
  ClipboardList,
  Monitor,
  Scale,
  TrendingUp,
  MessageSquare,
  DollarSign,
  Computer,
  Gavel,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const RashtriyaGramSwarajAbhiyan = () => {
  const objectives = [
    {
      icon: Users,
      title: "Capacity Building",
      description: "Enhance the capabilities of PRIs, functionaries, and other stakeholders through comprehensive capacity building and training on various skills."
    },
    {
      icon: Target,
      title: "Participatory Development",
      description: "Promote inclusive and participatory development process, reflecting the needs and aspirations of the local community."
    },
    {
      icon: Globe,
      title: "SDG Implementation",
      description: "Empower Panchayati Raj Institutions (PRIs) to effectively implement Sustainable Development Goals (SDGs) at the grassroots level."
    },
    {
      icon: Monitor,
      title: "Technology Integration",
      description: "Leveraging emerging technologies to our training sessions and ensuring timely delivery of all learning materials."
    },
    {
      icon: Crown,
      title: "Governance Enhancement",
      description: "Train Elected Representatives to develop their governance capabilities, capacity building, enhance capability of panchayats, revenue generation capabilities."
    }
  ];

  const lsdgs = [
    { name: "POVERTY FREE VILLAGE", icon: DollarSign },
    { name: "HEALTHY VILLAGE", icon: Heart },
    { name: "CHILD-FRIENDLY VILLAGE", icon: Users },
    { name: "WATER SUFFICIENT VILLAGE", icon: Droplets },
    { name: "CLEAN AND GREEN VILLAGE", icon: Leaf },
    { name: "SELF-SUFFICIENT VILLAGE", icon: Building },
    { name: "SOCIALLY SECURED VILLAGE", icon: Shield },
    { name: "VILLAGE WITH GOOD GOVERNANCE", icon: Crown },
    { name: "WOMEN FRIENDLY VILLAGE", icon: UserCheck }
  ];

  const specializedTrainings = [
    {
      number: "01",
      title: "Financial Management related Trainings:",
      description: "Provide specialized training to representatives at the State, District, and Block levels on the following topics:",
      topics: "GeM /PFMS /FRA/ (Own Source Revenue (OSR) Strategies / MIS through various digital portals & platforms / Contract Management",
      issues: ["Rural unemployment", "Rural Financing", "Skilling", "Rural Technology", "Eco-system for MSME"],
      icon: DollarSign
    },
    {
      number: "02",
      title: "IT Based Trainings:",
      description: "MIS /AI /TMP /SPATIAL Planning / Digital Literacy / E-Governance",
      icon: Computer
    },
    {
      number: "03",
      title: "Governance & Legal Laws:",
      description: "Provide comprehensive knowledge and understanding of all legal laws to all representatives.",
      topics: "Women Rights / Children Rights / Scheduled Tribes & Scheduled Area / PESA related special provisions",
      icon: Gavel
    },
    {
      number: "04",
      title: "Planning & Development Strategies:",
      description: "Rural Area Development Plan Formulation and Implementation (RADPFI)",
      topics: "SHG-PRI Convergence, Carbon Neutrality",
      icon: TrendingUp
    },
    {
      number: "05",
      title: "Organisational Behaviour:",
      description: "Leadership, Communication, Team Building, Negotiation Skills",
      icon: MessageSquare
    }
  ];

  const phases = [
    {
      phase: "Phase 1",
      title: "Needs Assessment & Planning",
      items: [
        "Identify: PRI training needs & locations.",
        "Develop: Customized training curriculum & batching.",
        "Plan: Diverse training methodologies (PPTs, discussions, etc.)."
      ]
    },
    {
      phase: "Phase 2",
      title: "Delivery & Implementation",
      items: [
        "Train-the-Trainer (TOT): Equip master trainers.",
        "Conduct: Accessible & inclusive training sessions.",
        "Leverage: Technology (digital platforms, AI, etc.).",
        "Organize: Exposure visits & evening cultural programs."
      ]
    },
    {
      phase: "Phase 3",
      title: "Post-Training Support & Feedback",
      items: [
        "Provide: Continuous support (mentorship, coaching).",
        "Facilitate: Knowledge sharing & experience exchange.",
        "Assess: Long-term impact on PRI performance.",
        "Track: Attendance, feedback, and post-training performance."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-muted/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-orange-500/8 rounded-full blur-2xl animate-float" style={{animationDelay: '6s'}}></div>
        </div>
        
        <div className="relative z-10 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-card/80 to-card/60 border border-primary/30 rounded-full px-8 py-4 shadow-lg backdrop-blur-sm animate-pulse-glow">
                <Crown className="h-6 w-6 text-primary animate-pulse" />
                <span className="text-sm font-bold text-foreground tracking-wider">GOVERNMENT INITIATIVE</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              </div>
              
              {/* Enhanced Main Title */}
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight animate-fade-in">
                  Training Under Revamped<br />
                  <span className="text-gradient bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent animate-glow">
                    Rashtiya Gram Swaraj Abhiyan
                  </span>
                </h1>
                
                {/* Enhanced Subtitle */}
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground animate-slide-in-left">
                    Panchayati Raj Training by
                  </h2>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative text-xl md:text-2xl font-black text-foreground bg-gradient-to-r from-muted to-muted/80 rounded-2xl px-8 py-4 inline-block shadow-xl border border-border group-hover:scale-105 transition-all duration-300">
                      SAMARTH SHAKTI FOUNDATION
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Description */}
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                  Empowering Elected Representatives across <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-lg">29 Constitutional Subjects</span> under Article 243(G) and the 11th Schedule
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Integrating Sustainable Development Goals (SDGs) to enhance local governance effectiveness and build stronger democratic institutions at the grassroots level.
                </p>
              </div>
              
              {/* Enhanced Stats Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in" style={{animationDelay: '0.5s'}}>
                <div className="group relative overflow-hidden bg-gradient-to-br from-card/90 to-card/70 border border-primary/30 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-black text-primary mb-3 group-hover:scale-110 transition-transform duration-300">465,300</div>
                    <div className="text-sm font-bold text-muted-foreground tracking-wider">Training Man-days Completed</div>
                  </div>
                </div>
                
                <div className="group relative overflow-hidden bg-gradient-to-br from-card/90 to-card/70 border border-orange-500/30 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-black text-orange-500 mb-3 group-hover:scale-110 transition-transform duration-300">29</div>
                    <div className="text-sm font-bold text-muted-foreground tracking-wider">Constitutional Subjects</div>
                  </div>
                </div>
                
                <div className="group relative overflow-hidden bg-gradient-to-br from-card/90 to-card/70 border border-green-500/30 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-black text-green-500 mb-3 group-hover:scale-110 transition-transform duration-300">6+</div>
                    <div className="text-sm font-bold text-muted-foreground tracking-wider">States Covered</div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced CTA Section */}
              <div className="space-y-8 animate-fade-in" style={{animationDelay: '0.7s'}}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <Button size="lg" className="relative bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white px-12 py-4 rounded-2xl shadow-2xl font-bold text-lg transform group-hover:scale-105 transition-all duration-300">
                    <Phone className="h-6 w-6 mr-3" />
                    Contact Us Today
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-8 text-muted-foreground">
                  <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 hover:bg-card/70 transition-all duration-300">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">Expert Training</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 hover:bg-card/70 transition-all duration-300">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Multilingual Support</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 hover:bg-card/70 transition-all duration-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Nationwide Coverage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Training Approach Section */}
      <section className="section-padding bg-gradient-to-r from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <CardContent className="relative p-8 md:p-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="text-primary font-bold">Our Methodology</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
                        Comprehensive Training <span className="text-primary">Approach</span>
                      </h3>
                    </div>
                    
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      We utilize engaging and diverse methodologies including presentations, group discussions, audio-visual modules, field visits, role-playing, case studies, and debates.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground font-medium">Hindi, English & Regional Languages</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-muted-foreground font-medium">Interactive Learning Methods</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-muted-foreground font-medium">Real-world Case Studies</span>
                      </div>
                    </div>
                    
                    <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]"></div>
                      <div className="relative text-center space-y-4">
                        <div className="text-4xl md:text-5xl font-black text-primary">465,300</div>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                          Man-days of comprehensive PRI training delivered across Uttarakhand, Haryana, Himachal Pradesh, Jharkhand, Andhra Pradesh and expanding to more states
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-10 border border-border shadow-2xl transform hover:scale-105 transition-all duration-500">
                      <div className="text-center space-y-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                          <Crown className="relative h-20 w-20 text-primary mx-auto" />
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-2xl md:text-3xl font-black text-foreground">Constitutional Coverage</h4>
                          <p className="text-muted-foreground font-medium">29 subjects under Article 243(G) & 11th Schedule of Indian Constitution</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center space-y-2">
                            <div className="text-3xl font-black text-primary">29</div>
                            <div className="text-sm text-muted-foreground font-medium">Subjects</div>
                          </div>
                          <div className="text-center space-y-2">
                            <div className="text-3xl font-black text-green-500">100%</div>
                            <div className="text-sm text-muted-foreground font-medium">Coverage</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Objectives Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Target className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">TRAINING OBJECTIVES</span>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              Our Core <span className="text-gradient bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">Objectives</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">
              Strategic goals driving our comprehensive PRI training initiatives across the nation
            </p>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center mt-8">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {objectives.map((objective, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
                
                <CardContent className="relative p-8 md:p-10 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <objective.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                      {objective.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                      {objective.description}
                    </p>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="pt-4">
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Training Categories Section */}
      <section className="section-padding bg-gradient-to-br from-muted/10 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">TRAINING CATEGORIES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-foreground mb-8 leading-tight">
              Comprehensive <span className="text-gradient bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Training Programs</span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* General Orientation - Enhanced */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
              
              <CardContent className="relative p-10 md:p-12 space-y-8">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-3xl blur-xl"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-3xl flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-blue-500" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
                    GENERAL ORIENTATION<br />
                    <span className="text-blue-500">TRAININGS FOR ERS</span>
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="relative bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-2xl p-6 border border-blue-500/20">
                    <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                      Comprehensive coverage of all PRI functions across <span className="text-blue-500 font-bold">29 Constitutional Subjects</span> under Article 243(G) & 11th Schedule, integrated with LSDGs for enhanced local governance.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        Interactive delivery through PPTs, group discussions, audio-visual modules, exposure visits, and case studies
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        Multilingual accessibility in Hindi, English, and regional languages
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        Clear and engaging information delivery for maximum understanding
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refresher Programme - Enhanced */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl"></div>
              
              <CardContent className="relative p-10 md:p-12 space-y-8">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-600/20 rounded-3xl blur-xl"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-3xl flex items-center justify-center">
                      <ClipboardList className="h-12 w-12 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
                    REFRESHER PROGRAMME<br />
                    <span className="text-green-500">TRAININGS FOR ERS</span>
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="relative bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-2xl p-6 border border-green-500/20">
                    <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                      Advanced assessment and evaluation programs with <span className="text-green-500 font-bold">questionnaires, surveys, and case studies</span> to measure understanding and retention.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        Comprehensive evaluation through questionnaires and surveys with expert assistance
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        Interactive group discussions and open-ended assessments for critical thinking
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        Real-world case studies with innovative solution development
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced LSDG Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.1),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.05),transparent_60%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-green-500/10 rounded-full blur-lg animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '6s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-green-500/10 to-blue-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">SUSTAINABLE DEVELOPMENT</span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 leading-tight">
              Thematic <span className="text-gradient bg-gradient-to-r from-primary via-green-500 to-blue-500 bg-clip-text text-transparent">Training</span>
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-8">
              Localization of Sustainable Development Goals (LSDGs)
            </h3>
            <p className="text-2xl text-muted-foreground max-w-5xl mx-auto font-medium leading-relaxed">
              Transforming villages through comprehensive development programs aligned with <span className="text-primary font-bold">global sustainability goals</span> and local community needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lsdgs.map((lsdg, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-lg shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2">
                {/* Card Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
                
                {/* Floating Icon Background */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <CardContent className="relative p-8 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                      <lsdg.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                    {lsdg.name}
                  </h3>
                  
                  {/* Progress Indicator */}
                  <div className="pt-2">
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 rounded-2xl px-8 py-4">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Building Sustainable Communities for Tomorrow</span>
              <Sparkles className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Specialized Trainings Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="absolute top-1/4 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Award className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">SPECIALIZED TRAINING</span>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              Expert <span className="text-gradient bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">Training Programs</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-5xl mx-auto font-medium leading-relaxed">
              Advanced training modules designed to build <span className="text-primary font-bold">specialized expertise</span> in critical governance and technology areas
            </p>
          </div>
          
          <div className="space-y-12">
            {specializedTrainings.map((training, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <CardContent className="relative p-8 md:p-12">
                  <div className="flex items-start gap-10">
                    <div className="flex-shrink-0 space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <training.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-5xl md:text-6xl font-black text-primary/60 group-hover:text-primary transition-colors duration-500">{training.number}</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                          {training.title}
                        </h3>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                          {training.description}
                        </p>
                      </div>
                      
                      {training.topics && (
                        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20 overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]"></div>
                          <div className="relative">
                            <h4 className="text-lg font-bold text-primary mb-4">Key Training Areas:</h4>
                            <p className="text-muted-foreground font-medium leading-relaxed">{training.topics}</p>
                          </div>
                        </div>
                      )}
                      
                      {training.issues && (
                        <div className="space-y-6">
                          <h4 className="text-2xl font-black text-foreground">Focus Areas & Solutions:</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {training.issues.map((issue, issueIndex) => (
                              <div key={issueIndex} className="group/item relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border hover:border-primary/30 transition-colors duration-300">
                                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                  <span className="text-muted-foreground font-medium">{issue}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="pt-4">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Work Plan Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.08),transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <ClipboardList className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">IMPLEMENTATION PLAN</span>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              Strategic <span className="text-gradient bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">Work Plan</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">
              Comprehensive implementation strategy for effective training delivery
            </p>
          </div>
          
          {/* Key Areas Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-lg shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <CardContent className="relative p-8 text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-3xl flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-foreground group-hover:text-blue-500 transition-colors duration-300">Strategic Location</h3>
                <p className="text-muted-foreground leading-relaxed">Prioritize accessibility, infrastructure, and trainee convenience for optimal learning environments.</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-lg shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <CardContent className="relative p-8 text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-3xl flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-foreground group-hover:text-green-500 transition-colors duration-300">Needs Assessment</h3>
                <p className="text-muted-foreground leading-relaxed">Comprehensive surveys to identify knowledge gaps and customize training modules for maximum impact.</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-lg shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <CardContent className="relative p-8 text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors duration-300">Training Calendar</h3>
                <p className="text-muted-foreground leading-relaxed">Structured scheduling based on identified needs and optimal timing for maximum participation.</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Training Phases */}
          <div className="space-y-12">
            {phases.map((phase, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
                
                <CardContent className="relative p-8 md:p-12">
                  <div className="flex items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <span className="text-3xl font-black text-primary">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                          {phase.phase}: {phase.title}
                        </h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {phase.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="group/item relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-start gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-primary/30 transition-colors duration-300">
                              <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground font-medium leading-relaxed">{item}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="pt-4">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl px-8 py-4">
              <Crown className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Building Stronger Democratic Institutions</span>
              <Target className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RashtriyaGramSwarajAbhiyan;