import { 
  Brain,
  BookOpen,
  Users,
  Lightbulb,
  Network,
  Award,
  Target,
  Globe,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  Bot,
  Code,
  Cpu,
  Database,
  FileText,
  Handshake,
  Search,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const AAIOE = () => {
  const stats = [
    { number: "21", label: "Published Books", icon: BookOpen },
    { number: "100+", label: "Expert Faculties", icon: Users },
    { number: "25K+", label: "Students Empowered", icon: Target },
    { number: "5+", label: "Years of Excellence", icon: Lightbulb }
  ];

  const benefits = [
    {
      title: "Collaborative Research Opportunities",
      description: "Work alongside industry experts and academic leaders on transformative AI and ML projects that shape the future.",
      icon: Search
    },
    {
      title: "Cutting-Edge Knowledge Resources",
      description: "Gain exclusive access to the latest research papers, publications, and insights that keep you ahead in the field.",
      icon: FileText
    },
    {
      title: "Joint Initiatives and Projects",
      description: "Partner with organizations and experts to co-create AI-powered solutions that address real-world industry challenges.",
      icon: Handshake
    },
    {
      title: "Skill Development Programs",
      description: "Access specialized workshops, training, and certifications tailored to equip members with advanced technical and leadership skills.",
      icon: TrendingUp
    },
    {
      title: "Professional Networking",
      description: "Build meaningful connections with peers, innovators, and thought leaders, opening doors to collaboration and new opportunities.",
      icon: Network
    },
    {
      title: "Global Recognition",
      description: "Enhance your professional profile by being part of a prestigious association recognized for its contributions to AI and ML advancements.",
      icon: Award
    }
  ];

  const features = [
    {
      title: "Pioneering Knowledge and Innovation",
      subtitle: "Thought Leaders in AI",
      description: "With 21 published books on AI and ML, authored by an inhouse team of experts, SAMARTH SHAKTI FOUNDATION is setting the benchmark for thought leadership in these transformative fields. Furthermore, the institution is actively writing additional books to empower students, working professionals, and organizations by providing cutting-edge insights and practical knowledge.",
      icon: BookOpen
    },
    {
      title: "Unparalleled Expertise",
      subtitle: "Industry Veterans",
      description: "SAMARTH SHAKTI FOUNDATION is powered by a team of 100+ expert faculties with vast real-world experience across diverse fields. Since 2020, under the leadership of Director Sanjay Rajbhar, Manager Surendra Prajapati, and Managing Director Neha Bhardwaj, our 5+ years of excellence has empowered 25,000+ students nationwide through comprehensive skill development programs.",
      icon: Users
    },
    {
      title: "Innovative Learning Programs",
      subtitle: "Future-Ready Skills",
      description: "SAMARTH SHAKTI FOUNDATION offers robust online courses designed to equip individuals with the tools and skills necessary to excel in today's AI-driven industries.",
      icon: Cpu
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-purple-500/3 to-muted/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--purple-500)/0.1),transparent_50%)]"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-24 left-20 w-40 h-40 bg-purple-500/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/4 right-16 w-28 h-28 bg-blue-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-36 h-36 bg-primary/10 rounded-full blur-2xl animate-float" style={{animationDelay: '4.5s'}}></div>
          <div className="absolute bottom-16 right-1/4 w-32 h-32 bg-purple-500/6 rounded-full blur-2xl animate-float" style={{animationDelay: '6.5s'}}></div>
        </div>
        
        <div className="relative z-10 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-card/80 to-card/60 border border-purple-500/30 rounded-full px-8 py-4 shadow-lg backdrop-blur-sm animate-pulse-glow">
                <Brain className="h-6 w-6 text-purple-500 animate-pulse" />
                <span className="text-sm font-bold text-foreground tracking-wider">AI & ML EXCELLENCE</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
              </div>
              
              {/* Enhanced Main Title */}
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight animate-fade-in">
                  Association of Artificial Intelligence<br />
                  for <span className="text-gradient bg-gradient-to-r from-purple-500 via-primary to-blue-500 bg-clip-text text-transparent animate-glow">
                    Organizations and Experts
                  </span>
                </h1>
                
                {/* Enhanced Subtitle */}
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground animate-slide-in-left">
                    SAMARTH SHAKTI FOUNDATION
                  </h2>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative text-xl md:text-2xl font-black text-foreground bg-gradient-to-r from-muted to-muted/80 rounded-2xl px-8 py-4 inline-block shadow-xl border border-border group-hover:scale-105 transition-all duration-300">
                      Shaping the Future of AI & ML
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="max-w-4xl mx-auto space-y-4">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Leading the <span className="text-primary font-semibold">AI revolution</span> through exceptional education, research, and collaboration
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  At the helm of AI and ML transformation, we drive innovation that reshapes careers, transforms industries, and redefines the future of technology
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">21</div>
                  <div className="text-sm font-medium text-muted-foreground">Published Books</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">55</div>
                  <div className="text-sm font-medium text-muted-foreground">AI/ML Experts</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm font-medium text-muted-foreground">Industry Focused</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">∞</div>
                  <div className="text-sm font-medium text-muted-foreground">Innovation Potential</div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="space-y-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg shadow-sm font-medium">
                  <Brain className="h-5 w-5 mr-2" />
                  Join AAIOE Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Expert Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Research Collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Global Recognition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <Lightbulb className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">AI INNOVATION</span>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              Leading <span className="text-gradient bg-gradient-to-r from-blue-500 via-primary to-purple-500 bg-clip-text text-transparent">AI Excellence</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">
              Driving innovation through research, expertise, and cutting-edge learning programs
            </p>
          </div>
          
          <div className="space-y-20">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                
                <CardContent className="relative p-8 md:p-16">
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                      <div className="space-y-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                          <div className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <feature.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                            {feature.title}
                          </h3>
                          <h4 className="text-xl md:text-2xl font-bold text-blue-500">{feature.subtitle}</h4>
                          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                            {feature.description}
                          </p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="pt-4">
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${index % 2 === 0 ? 'order-2' : 'order-1'} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-3xl blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-10 border border-border shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                        <div className="text-center space-y-8">
                          <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                            <Brain className="relative h-20 w-20 text-primary mx-auto" />
                          </div>
                          
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-card/50 rounded-xl">
                              <span className="text-muted-foreground font-medium">AI Innovation</span>
                              <span className="text-primary font-black">Advanced</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-card/50 rounded-xl">
                              <span className="text-muted-foreground font-medium">Research Impact</span>
                              <span className="text-blue-500 font-black">High</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-card/50 rounded-xl">
                              <span className="text-muted-foreground font-medium">Industry Connect</span>
                              <span className="text-purple-500 font-black">Strong</span>
                            </div>
                          </div>
                          
                          {/* Feature Stats */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center space-y-2">
                              <div className="text-3xl font-black text-primary">{index === 0 ? '21' : index === 1 ? '55' : '100+'}</div>
                              <div className="text-sm text-muted-foreground font-medium">{index === 0 ? 'Books' : index === 1 ? 'Experts' : 'Courses'}</div>
                            </div>
                            <div className="text-center space-y-2">
                              <div className="text-3xl font-black text-blue-500">{index === 0 ? '∞' : index === 1 ? '25+' : '24/7'}</div>
                              <div className="text-sm text-muted-foreground font-medium">{index === 0 ? 'Impact' : index === 1 ? 'Years' : 'Access'}</div>
                            </div>
                          </div>
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

      {/* Enhanced AAIOE Platform Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.1),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.05),transparent_60%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-purple-500/10 rounded-full blur-lg animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-float" style={{animationDelay: '6s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Network className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">COLLABORATIVE PLATFORM</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">AAIOE Platform</span>
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-8">A Catalyst for Collaboration and Progress</h3>
            
            <div className="max-w-5xl mx-auto">
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardContent className="relative p-8 md:p-12">
                  <div className="text-center space-y-8">
                    <div className="flex items-center justify-center gap-6 mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/30 rounded-3xl blur-lg"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-3xl flex items-center justify-center">
                          <Code className="h-10 w-10 text-blue-500" />
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/30 rounded-3xl blur-lg"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-3xl flex items-center justify-center">
                          <Database className="h-10 w-10 text-purple-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                        <span className="text-primary font-bold">SAMARTH SHAKTI FOUNDATION</span> in collaboration with various Start-ups and Industry Experts has established the Association of Artificial Intelligence for Organizations and Experts (AAIOE).
                      </p>
                      
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        A unique platform connecting businesses, researchers, and professionals with shared goals of driving innovation and success in AI and ML.
                      </p>
                      
                      <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                        This thriving community enables members to lead advancements in these fields while benefiting from:
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
                
                <CardContent className="relative p-8 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <benefit.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {benefit.description}
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
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
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
              
              <CardContent className="relative p-12 md:p-20">
                <div className="text-center space-y-12">
                  <div className="inline-flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Zap className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Bot className="h-12 w-12 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                      AAIOE is not just a <span className="text-gradient bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">platform</span>
                    </h2>
                    <p className="text-2xl md:text-3xl text-primary font-bold leading-relaxed">
                      It is a movement driving impactful change in Artificial Intelligence, creating pathways for groundbreaking innovation and success
                    </p>
                  </div>
                  
                  <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-10 md:p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]"></div>
                    <div className="relative space-y-6">
                      <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                        <span className="text-primary font-bold">SAMARTH SHAKTI FOUNDATION</span> has become synonymous with excellence, innovation, and expertise in Artificial Intelligence and Machine Learning.
                      </p>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Through relentless commitment to advancing education and research, we inspire professionals, organizations, and academic institutions to join forces in creating a smarter, AI-driven future.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button size="lg" className="group relative bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 font-bold text-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
                      <div className="relative flex items-center gap-3">
                        <Network className="h-6 w-6" />
                        Join AAIOE Community
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                    
                    <Button size="lg" variant="outline" className="group bg-card/50 border-2 border-primary/20 hover:border-primary/40 backdrop-blur-sm px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 font-bold text-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                        Explore AI Programs
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </div>
                  
                  {/* Bottom Features */}
                  <div className="flex items-center justify-center gap-8 text-muted-foreground/60 text-sm pt-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>21 Published Books</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>55 AI/ML Experts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span>Global Recognition</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AAIOE;