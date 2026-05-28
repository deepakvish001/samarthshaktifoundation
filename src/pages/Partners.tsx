import { 
  Building2,
  Award,
  Handshake,
  Target,
  Users,
  Globe,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Star,
  Crown,
  Shield,
  Briefcase,
  Truck,
  ShoppingBag,
  Car,
  Utensils,
  Shirt,
  Laptop,
  Hotel,
  Home,
  Coffee,
  Pizza,
  ShoppingCart,
  Gamepad2,
  Monitor,
  Zap,
  Sparkles,
  Rocket,
  TrendingUp,
  CircleDot,
  Gift,
  Badge,
  Gem,
  Flame,
  Layers,
  Network,
  Puzzle,
  Fingerprint,
  Eye,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Partners = () => {
  const privatePartners = [
    { name: "Swiggy", icon: "🍽️", sector: "Food Delivery", color: "text-primary", bg: "bg-primary/10" },
    { name: "OYO", icon: "🏨", sector: "Hospitality", color: "text-destructive", bg: "bg-destructive/10" },
    { name: "Amazon Logistics", icon: "📦", sector: "E-commerce & Logistics", color: "text-secondary", bg: "bg-secondary/20" },
    { name: "Maruti Suzuki", icon: "🚗", sector: "Automotive", color: "text-primary", bg: "bg-primary/10" },
    { name: "Myntra", icon: "👕", sector: "Fashion E-commerce", color: "text-accent", bg: "bg-accent/10" },
    { name: "Tanishq", icon: "💎", sector: "Jewelry & Luxury", color: "text-secondary", bg: "bg-secondary/20" },
    { name: "Vardhman Group", icon: "🏭", sector: "Textiles", color: "text-primary", bg: "bg-primary/10" },
    { name: "Portea", icon: "🏥", sector: "Healthcare", color: "text-primary", bg: "bg-primary/10" },
    { name: "Big Bazaar", icon: "🛒", sector: "Retail", color: "text-destructive", bg: "bg-destructive/10" },
    { name: "Domino's", icon: "🍕", sector: "Food & Beverage", color: "text-destructive", bg: "bg-destructive/10" },
    { name: "Aditya Birla Group", icon: "🏢", sector: "Conglomerate", color: "text-primary", bg: "bg-primary/10" },
    { name: "Barbeque Nation", icon: "🍖", sector: "Restaurant Chain", color: "text-primary", bg: "bg-primary/10" },
    { name: "Cogent", icon: "💻", sector: "BPO & Software", color: "text-accent", bg: "bg-accent/10" },
    { name: "Devyani International", icon: "🍔", sector: "QSR Chain", color: "text-accent", bg: "bg-accent/10" },
    { name: "Cinepolis", icon: "🎬", sector: "Entertainment", color: "text-accent", bg: "bg-accent/10" },
    { name: "Tandem Data Processing", icon: "📊", sector: "Data Processing", color: "text-primary", bg: "bg-primary/10" },
    { name: "Aathava Garments", icon: "👔", sector: "Apparel Manufacturing", color: "text-primary", bg: "bg-primary/10" },
    { name: "Infotech", icon: "⚙️", sector: "IT Services", color: "text-muted-foreground", bg: "bg-muted/50" }
  ];

  const governmentPartners = [
    { name: "NSDC", fullName: "National Skill Development Corporation", icon: Award, color: "text-primary", bg: "bg-primary/10" },
    { name: "PMKVY", fullName: "Pradhan Mantri Kaushal Vikas Yojana", icon: Target, color: "text-primary", bg: "bg-primary/10" },
    { name: "Ministry of Textiles", fullName: "Government of India", icon: Shirt, color: "text-accent", bg: "bg-accent/10" },
    { name: "NIELIT", fullName: "National Institute of Electronics & IT", icon: Monitor, color: "text-accent", bg: "bg-accent/10" },
    { name: "NTPC", fullName: "National Thermal Power Corporation", icon: Zap, color: "text-secondary", bg: "bg-secondary/20" },
    { name: "RSLDC", fullName: "Rajasthan Skill & Livelihood Development Corporation", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { name: "Uttarakhand Skill Development Mission", fullName: "Government of Uttarakhand", icon: Crown, color: "text-primary", bg: "bg-primary/10" },
    { name: "JSDHMS", fullName: "Jharkhand Skill Development & Human Resource", icon: Users, color: "text-destructive", bg: "bg-destructive/10" },
    { name: "Urban Development", fullName: "Government Schemes", icon: Home, color: "text-accent", bg: "bg-accent/10" },
    { name: "NIESBUD", fullName: "National Institute for Entrepreneurship", icon: Briefcase, color: "text-accent", bg: "bg-accent/10" },
    { name: "Ministry of Minority Affairs", fullName: "Government of India", icon: Shield, color: "text-muted-foreground", bg: "bg-muted/50" },
    { name: "Aajeevika", fullName: "Rural Livelihood Mission", icon: Globe, color: "text-primary", bg: "bg-primary/10" }
  ];

  const stats = [
    { number: "50+", label: "Private Partners", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { number: "25+", label: "Government Bodies", icon: Award, color: "text-primary", bg: "bg-primary/10" },
    { number: "15+", label: "Industry Sectors", icon: Target, color: "text-accent", bg: "bg-accent/10" },
    { number: "100%", label: "Placement Support", icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Clean & Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-muted/5 to-background">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,hsl(var(--primary)/0.05)_50%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 relative z-10 py-32">
          <div className="max-w-6xl mx-auto text-center space-y-16">
            
            {/* Clean Header Badge */}
            <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 rounded-full px-8 py-4 backdrop-blur-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-semibold text-lg">Strategic Partnerships</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>

            {/* Clean Title Design */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block text-foreground">OUR ESTEEMED</span>
                <span className="block text-gradient bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  PARTNERS
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
                  Building Excellence Through <span className="text-primary font-bold">Strategic Collaborations</span>
                </p>
                 <p className="text-xl text-muted-foreground/80 leading-relaxed">
                   <span className="text-primary font-bold">SAMARTH SHAKTI FOUNDATION</span> has tie-ups with various organizations for providing free courses job training & Placement assistance to Trained Candidates. Since 2020, under the leadership of Director <span className="font-semibold">Sanjay Rajbhar</span>, Manager <span className="font-semibold">Surendra Prajapati</span>, and Managing Director <span className="font-semibold">Neha Bhardwaj</span>, we've empowered 25,000+ students with 100+ expert faculties.
                 </p>
              </div>
            </div>

            {/* Clean Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-primary">50+</div>
                <div className="text-muted-foreground font-medium">Industry Partners</div>
                <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-primary">25+</div>
                <div className="text-muted-foreground font-medium">Government Bodies</div>
                <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-primary">15+</div>
                <div className="text-muted-foreground font-medium">Sectors Covered</div>
                <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-primary">100%</div>
                <div className="text-muted-foreground font-medium">Placement Support</div>
                <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
              </div>
            </div>

            {/* Clean CTA Section */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Handshake className="mr-3 h-6 w-6" />
                Partner With Us
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary/30 text-primary hover:bg-primary/5 px-10 py-4 rounded-xl font-semibold transition-all duration-300">
                <Mail className="mr-3 h-5 w-5" />
                View Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Partnership Impact Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Partnership Impact</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">SUCCESS IN</span>
                <span className="text-primary"> NUMBERS</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our strategic partnerships have created measurable impact across industries and regions.
              </p>
            </div>

            {/* Clean Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 group">
                  <div className={`w-16 h-16 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-3">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full mx-auto mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Private Partners Section - Clean Design */}
      <section className="py-24 bg-gradient-to-r from-background via-muted/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Industry Leaders</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">PRIVATE</span>
                <span className="text-primary"> PARTNERS</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Collaborating with industry-leading companies to provide exceptional placement opportunities across diverse sectors.
              </p>
            </div>

            {/* Partners Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {privatePartners.map((partner, index) => (
                <div key={index} className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 group">
                  <div className={`w-16 h-16 ${partner.bg} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{partner.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{partner.name}</h3>
                  <p className={`text-sm ${partner.color} font-medium mb-4`}>{partner.sector}</p>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Government Partners Section - Clean Design */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Crown className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Government Excellence</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">GOVERNMENT</span>
                <span className="text-primary"> PARTNERS</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Affiliated with prestigious government bodies to provide certified training programs and guaranteed placement opportunities.
              </p>
            </div>

            {/* Partners Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {governmentPartners.map((partner, index) => (
                <div key={index} className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 group">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 ${partner.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <partner.icon className={`h-8 w-8 ${partner.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3">{partner.name}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">{partner.fullName}</p>
                      <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-semibold">Certified Partner</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full mt-6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits Section - Clean Design */}
      <section className="py-24 bg-gradient-to-r from-background via-muted/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Partnership Excellence</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">WHY CHOOSE</span>
                <span className="text-primary"> US</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our comprehensive training programs ensure job-ready graduates who contribute effectively from day one.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Benefits Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  {[
                    { text: "Industry-ready skilled workforce", icon: Users },
                    { text: "Reduced training and onboarding costs", icon: TrendingUp },
                    { text: "Continuous skill upgradation support", icon: Rocket },
                    { text: "Access to diverse talent pool", icon: Globe },
                    { text: "Government certification and compliance", icon: Shield }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <benefit.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-lg text-foreground font-medium group-hover:text-primary transition-colors duration-300">
                        {benefit.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-8">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <Handshake className="mr-3 h-6 w-6" />
                    Start Partnership Journey
                  </Button>
                </div>
              </div>
              
              {/* Partnership Opportunities Panel */}
              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-10 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-8">
                  <Handshake className="h-10 w-10 text-primary" />
                </div>
                
                <h4 className="text-3xl font-bold text-foreground mb-8">Partnership Opportunities</h4>
                
                <div className="space-y-6">
                  {[
                    { text: "Recruitment Partnerships", icon: Users },
                    { text: "Skill Development Programs", icon: Puzzle },
                    { text: "Industry Collaborations", icon: Network },
                    { text: "Training Partnerships", icon: GraduationCap }
                  ].map((opportunity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300 group">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <opportunity.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-foreground font-medium">{opportunity.text}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl transition-all duration-300">
                  <Flame className="mr-3 h-5 w-5" />
                  Become a Partner
                </Button>
              </div>
            </div>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default Partners;