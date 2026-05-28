import { 
  Lightbulb,
  Award,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Target,
  CheckCircle,
  Phone,
  Mail,
  ArrowRight,
  Trophy,
  BookOpen,
  HandHeart,
  Eye,
  Briefcase,
  BarChart3,
  Rocket,
  Star,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const EntrepreneurshipDevelopment = () => {
  const prizes = [
    { position: "1st Prize", amount: "₹5,000", icon: Trophy },
    { position: "2nd Prize", amount: "₹3,000", icon: Award },
    { position: "3rd Prize", amount: "₹2,000", icon: Star }
  ];

  const steps = [
    {
      step: "01",
      title: "1st Handholding Session",
      description: "Initial guidance and support to kickstart your entrepreneurial journey with personalized mentoring.",
      icon: HandHeart
    },
    {
      step: "02",
      title: "2nd Handholding Session",
      description: "Follow-up support session to address challenges and refine your business approach.",
      icon: Users
    },
    {
      step: "03",
      title: "Review Workshop",
      description: "Comprehensive review of your progress with feedback and strategic improvements.",
      icon: Eye
    },
    {
      step: "04",
      title: "Project Management",
      description: "Professional project management guidance to ensure successful implementation.",
      icon: Briefcase
    },
    {
      step: "05",
      title: "Mudra Workshop",
      description: "Specialized workshop on Mudra loan facilitation and financial planning.",
      icon: DollarSign
    }
  ];

  const features = [
    {
      title: "Mudra Facilitation Cell",
      description: "Dedicated cell with personal monitoring and mentoring by Director Sanjay Rajbhar, Manager Surendra Prajapati, and Managing Director Neha Bhardwaj at SAMARTH SHAKTI FOUNDATION",
      icon: Building2
    },
    {
      title: "Idea Generation Competition",
      description: "Competitions for self-employment at each Skill India training centre with attractive cash prizes",
      icon: Lightbulb
    },
    {
      title: "Sales & Marketing Training",
      description: "Special training provided to trainees who show interest in entrepreneurship development",
      icon: TrendingUp
    },
    {
      title: "Practical Product Experience",
      description: "Different products of ₹1000/- provided to trainees for real market experience and profit making",
      icon: BarChart3
    },
    {
      title: "Project Reports",
      description: "Small project reports of viable projects developed for entrepreneurial ventures",
      icon: BookOpen
    },
    {
      title: "Incubation Centre",
      description: "Dedicated space at each PMKK Centre providing office facilities, sourcing, market analysis and sales support",
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-green-500/3 to-muted/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--green-500)/0.1),transparent_50%)]"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-24 w-44 h-44 bg-green-500/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-2/3 left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '3.5s'}}></div>
          <div className="absolute bottom-28 right-1/3 w-40 h-40 bg-primary/8 rounded-full blur-2xl animate-float" style={{animationDelay: '5.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-green-500/6 rounded-full blur-2xl animate-float" style={{animationDelay: '7.5s'}}></div>
        </div>
        
        <div className="relative z-10 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                {/* Enhanced Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-card/80 to-card/60 border border-green-500/30 rounded-full px-8 py-4 shadow-lg backdrop-blur-sm animate-pulse-glow">
                  <Rocket className="h-6 w-6 text-green-500 animate-pulse" />
                  <span className="text-sm font-bold text-foreground tracking-wider">INNOVATION & GROWTH</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                
                {/* Enhanced Main Title */}
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight animate-fade-in">
                    ENTREPRENEURSHIP<br />
                    <span className="text-gradient bg-gradient-to-r from-green-500 via-primary to-blue-500 bg-clip-text text-transparent animate-glow">
                      DEVELOPMENT
                    </span>
                  </h1>
                </div>
                
                {/* Enhanced Description */}
                <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                    Comprehensive <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-lg">entrepreneurship ecosystem</span> with dedicated mentoring and support
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    <span className="text-primary font-black">SAMARTH SHAKTI FOUNDATION</span> with 5+ years of excellence and 25,000+ students empowered, has established a dedicated Mudra Facilitation cell with personal monitoring by Prof. Yogesh Kumar, Director
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg shadow-sm font-medium">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Start Your Journey
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  
                  <Button size="lg" variant="outline" className="border-border hover:bg-muted px-8 py-3 rounded-lg shadow-sm font-medium">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    Get Guidance
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
                
                {/* Feature Highlights */}
                <div className="flex items-center gap-6 text-muted-foreground text-sm pt-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Expert Mentoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Funding Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Incubation Centers</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Side Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-green-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-10 border border-border shadow-2xl transform hover:scale-105 transition-all duration-500">
                  <div className="text-center space-y-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                      <Building2 className="relative h-20 w-20 text-primary mx-auto" />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-black text-foreground">Complete Entrepreneurship Ecosystem</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-card/50 rounded-xl">
                        <span className="text-muted-foreground font-medium">Mentoring</span>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card/50 rounded-xl">
                        <span className="text-muted-foreground font-medium">Funding Support</span>
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card/50 rounded-xl">
                        <span className="text-muted-foreground font-medium">Market Access</span>
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card/50 rounded-xl">
                        <span className="text-muted-foreground font-medium">Incubation</span>
                        <CheckCircle className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Competition Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <Lightbulb className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">INNOVATION COMPETITION</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              Idea Generation <span className="text-gradient bg-gradient-to-r from-green-500 via-primary to-blue-500 bg-clip-text text-transparent">Competition</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">
              Competitive innovation platform with <span className="text-green-500 font-bold">attractive cash prizes</span> to encourage entrepreneurial thinking
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-20 stagger-animation">
            {prizes.map((prize, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
                
                <CardContent className="relative p-8 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                      <prize.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-500">{prize.position}</h3>
                    <div className="text-3xl md:text-4xl font-black text-primary">{prize.amount}</div>
                    <p className="text-muted-foreground font-medium">Cash prize for innovative ideas</p>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="pt-4">
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardContent className="relative p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-500">
                      Practical Market Experience
                    </h3>
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                      Special Sales & Marketing Training is provided to trainees who show interest in entrepreneurship. Different products of ₹1,000/- are provided to trainees for hands-on market experience.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-primary/30 transition-colors duration-300">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground font-medium">Hands-on sales experience</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-blue-500/30 transition-colors duration-300">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-muted-foreground font-medium">Real profit generation</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-primary/30 transition-colors duration-300">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground font-medium">Marketing skill development</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-green-500/10 rounded-3xl blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-10 border border-border shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                        <DollarSign className="relative h-20 w-20 text-primary mx-auto" />
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-2xl md:text-3xl font-black text-foreground">Product Investment</h4>
                        <div className="text-4xl md:text-5xl font-black text-primary">₹1,000</div>
                        <p className="text-muted-foreground font-medium">Per trainee for practical experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="absolute top-1/4 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-green-500/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">SUPPORT ECOSYSTEM</span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              Comprehensive <span className="text-gradient bg-gradient-to-r from-primary via-green-500 to-blue-500 bg-clip-text text-transparent">Support System</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">
              End-to-end entrepreneurship development ecosystem with dedicated support at every stage
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-lg shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2">
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
                
                <CardContent className="relative p-8 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="pt-4">
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced 5-Step Process Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.1),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.05),transparent_60%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-blue-500/10 rounded-full blur-lg animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-float" style={{animationDelay: '6s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-green-500/10 to-blue-500/10 border border-primary/20 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Target className="h-6 w-6 text-primary" />
              <span className="text-primary font-black text-lg tracking-wide">5-STEP PROCESS</span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight">
              Your <span className="text-gradient bg-gradient-to-r from-primary via-green-500 to-blue-500 bg-clip-text text-transparent">Partnership Journey</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">
              Structured guidance and support for <span className="text-green-500 font-bold">entrepreneurship success</span>
            </p>
          </div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
                
                <CardContent className="relative p-8 md:p-12">
                  <div className="flex items-start gap-10">
                    <div className="flex-shrink-0 space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <step.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl md:text-5xl font-black text-primary group-hover:text-green-500 transition-colors duration-500">{step.step}</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                        {step.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="pt-4">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-full blur-lg group-hover:scale-150 transition-all duration-500"></div>
                        <ArrowRight className="relative h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Incubation Center Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="absolute top-1/4 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-green-500/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <CardContent className="relative p-12 md:p-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 rounded-full px-6 py-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="text-primary font-bold">Innovation Hub</span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-500 leading-tight">
                        Incubation Centre Development
                      </h3>
                    </div>
                    
                    <div className="space-y-6">
                      <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                        <span className="text-primary font-bold">SAMARTH SHAKTI FOUNDATION</span> has developed small project reports of viable projects. For each PMKK Centre, we are developing dedicated incubation spaces.
                      </p>
                      
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        This centre works as a common office for all new entrepreneurs while providing comprehensive sourcing, market analysis and sales support.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-primary/30 transition-colors duration-300">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground font-medium">Common office space for entrepreneurs</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-green-500/30 transition-colors duration-300">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground font-medium">Sourcing and procurement support</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-blue-500/30 transition-colors duration-300">
                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span className="text-muted-foreground font-medium">Market analysis and research</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border hover:border-purple-500/30 transition-colors duration-300">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                        <span className="text-muted-foreground font-medium">Sales and marketing assistance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-green-500/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-10 border border-border shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                      <div className="text-center space-y-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                          <Rocket className="relative h-20 w-20 text-primary mx-auto" />
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-2xl md:text-3xl font-black text-foreground">Complete Ecosystem</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center space-y-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                              <Zap className="relative h-10 w-10 text-primary mx-auto" />
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Innovation</div>
                          </div>
                          <div className="text-center space-y-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg"></div>
                              <Target className="relative h-10 w-10 text-green-500 mx-auto" />
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Growth</div>
                          </div>
                          <div className="text-center space-y-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
                              <Users className="relative h-10 w-10 text-blue-500 mx-auto" />
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Community</div>
                          </div>
                          <div className="text-center space-y-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg"></div>
                              <Award className="relative h-10 w-10 text-purple-500 mx-auto" />
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Success</div>
                          </div>
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
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 rounded-2xl px-8 py-4">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Building Tomorrow's Entrepreneurs Today</span>
              <Building2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EntrepreneurshipDevelopment;