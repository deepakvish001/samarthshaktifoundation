import { Award, Users, MapPin, Phone, Mail, Calendar, Target, Eye, User, Building2, GraduationCap, Trophy, Briefcase, Star, Search, CheckCircle, Sparkles, Globe, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const About = () => {
  const stats = [
    { icon: Calendar, number: "5+", label: "Years of Experience", gradient: "from-blue-500 to-blue-600" },
    { icon: Users, number: "100+", label: "Expert Faculties", gradient: "from-green-500 to-green-600" },
    { icon: Award, number: "15+", label: "National Awards", gradient: "from-purple-500 to-purple-600" },
    { icon: GraduationCap, number: "25K+", label: "Students Empowered", gradient: "from-primary to-orange-600" }
  ];

  const achievements = [
    "Excellence in Skill Development 2023",
    "Best Training Partner Award - NSDC",
    "Outstanding Placement Record Recognition",
    "Innovation in Rural Training Programs",
    "Digital Learning Excellence Award"
  ];

  const centers = [
    { state: "UTTAR PRADESH", district: "AZAMGARH", name: "SAMARTH SHAKTI FOUNDATION HEAD OFFICE", address: "Shanti Nagar Mehmauni Gali Kaptanganj Azamgarh Uttar Pradesh Pin 276141" },
    { state: "UTTAR PRADESH", district: "AMBEDKAR NAGAR", name: "SAMARTH SHAKTI FOUNDATION TRAINING CENTRE", address: "Training Centre Ambedkar Nagar, Uttar Pradesh" },
    { state: "UTTAR PRADESH", district: "JAUNPUR", name: "SAMARTH SHAKTI FOUNDATION TRAINING CENTRE", address: "Training Centre Jaunpur, Uttar Pradesh" },
    { state: "UTTAR PRADESH", district: "MAU", name: "SAMARTH SHAKTI FOUNDATION TRAINING CENTRE", address: "Training Centre MAU, Uttar Pradesh" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Enhanced Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-primary/2 to-background">
        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(59,130,246,0.03)_50%,transparent_60%)]" />
          
          {/* Floating geometric elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-primary/10 to-blue-500/5 rounded-full animate-float-slow blur-sm" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-500/8 to-primary/5 rounded-full animate-float-slower blur-sm" />
          <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-gradient-to-br from-primary/12 to-blue-600/6 rounded-full animate-float blur-sm" />
        </div>
        
        <div className="container-custom relative z-10 py-32">
          <div className="max-w-6xl mx-auto text-center space-y-16">
            
            {/* Enhanced Header Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 via-blue-500/8 to-primary/10 border border-primary/20 rounded-full px-8 py-4 backdrop-blur-sm shadow-lg">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-semibold text-lg tracking-wide">About Our Institution</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>

            {/* Enhanced Title Design */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                <span className="block text-foreground">SAMARTH SHAKTI</span>
                <span className="block bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent animate-gradient-x">
                  FOUNDATION
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
                  Pioneering Excellence in <span className="text-primary font-bold">Skill Development</span>
                </p>
                 <p className="text-xl text-muted-foreground/80 leading-relaxed">
                   <span className="text-primary font-bold">SAMARTH SHAKTI FOUNDATION</span> is a pioneer in the field of Education, Skill Training and has been successfully running the skill development programs on PAN India Basis Since 2020. We are NSDC Training Partner and having Pan India Presence with Expertise of providing free courses and Placement Skill Training in the Fields of Apparel, Organized Retail, Electronics, Healthcare, Food Processing, Agriculture etc.
                 </p>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="group text-center space-y-3 p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-xl">
                <div className="text-5xl font-black text-primary group-hover:scale-110 transition-transform duration-300">5+</div>
                <div className="text-muted-foreground font-medium">Years of Excellence</div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
              <div className="group text-center space-y-3 p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-green-500/10 hover:border-green-500/30 transition-all duration-500 hover:shadow-xl">
                <div className="text-5xl font-black text-green-500 group-hover:scale-110 transition-transform duration-300">25K+</div>
                <div className="text-muted-foreground font-medium">Students Empowered</div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
              <div className="group text-center space-y-3 p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-blue-500/10 hover:border-blue-500/30 transition-all duration-500 hover:shadow-xl">
                <div className="text-5xl font-black text-blue-500 group-hover:scale-110 transition-transform duration-300">100+</div>
                <div className="text-muted-foreground font-medium">Expert Faculties</div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
              <div className="group text-center space-y-3 p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-xl">
                <div className="text-5xl font-black text-purple-500 group-hover:scale-110 transition-transform duration-300">95%</div>
                <div className="text-muted-foreground font-medium">Success Rate</div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="group bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <GraduationCap className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Explore Our Programs
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button size="lg" variant="outline" className="group border-2 border-primary/30 text-primary hover:bg-primary/5 px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                <Phone className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Contact Us
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are - Clean Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Our Foundation</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">WHO WE</span>
                <span className="text-primary"> ARE</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A pioneering institution dedicated to transforming lives through comprehensive skill development and excellence in education.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              {/* Main Content Cards */}
              <div className="space-y-8">
                
                {/* Foundation Card */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 group">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Star className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Our Foundation</h3>
                      <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full" />
                    </div>
                  </div>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                     <span className="text-primary font-bold">SAMARTH SHAKTI FOUNDATION</span> is a pioneer in the field of Education, Skill Training and has been successfully running the skill development programs on PAN India Basis Since 2020. We are NSDC Training Partner and having Pan India Presence with Expertise of providing free courses and Placement Skill Training in the Fields of Apparel, Organized Retail, Electronics, Healthcare, Food Processing, Agriculture etc. We have successfully conducted various projects of Skill Training including PMKVY, UPSDM, NIESBUD, NULM Uttar Pradesh CSR etc.
                   </p>
                </div>

                {/* Impact Card */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 group">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Globe className="h-7 w-7 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Our Reach</h3>
                      <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We've developed India's largest Mega Skill Centres in challenging regions like Jharkhand, 
                    J&K, Uttarakhand, and North-East States, ensuring <span className="text-green-500 font-semibold">accessibility for all</span>.
                  </p>
                </div>

                {/* Excellence Card */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 group">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Trophy className="h-7 w-7 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Our Excellence</h3>
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Recognized as one of India's <span className="text-blue-500 font-bold">premier skill training organizations</span> 
                    with measurable impact on students, industries, and society at large.
                  </p>
                </div>
              </div>

              {/* Side Highlights */}
              <div className="space-y-8">
                
                {/* Mission Highlight */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">Our Mission</h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full mx-auto mb-6" />
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To train 5000 Thousand students per year in different skills and empower them with 
                    the ability to provide professional services, creating wealth for themselves and for the nation.
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-muted-foreground font-medium">Training Centers</div>
                  </div>
                  <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-green-500 mb-2">100+</div>
                    <div className="text-muted-foreground font-medium">Expert Faculty</div>
                  </div>
                  <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-blue-500 mb-2">100%</div>
                    <div className="text-muted-foreground font-medium">Placement Support</div>
                  </div>
                  <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-purple-500 mb-2">NSDC</div>
                    <div className="text-muted-foreground font-medium">Certified Partner</div>
                  </div>
                </div>

                {/* Achievement Highlight */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-8 text-center">
                  <Trophy className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-3">Recognition</h4>
                  <p className="text-muted-foreground">
                    Forefront skill training organization with measurable impact across India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - Clean & Aligned */}
      <section className="py-24 bg-gradient-to-r from-background via-muted/5 to-background">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Our Achievements</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">EXCELLENCE IN</span>
                <span className="text-primary"> NUMBERS</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our journey of transforming lives through comprehensive skill development and education excellence.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 group hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-semibold">
                    {stat.label}
                  </div>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section - Clean Cards */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Our Direction</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">VISION &</span>
                <span className="text-primary"> MISSION</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Guiding principles that drive our commitment to excellence in education and skill development.
              </p>
            </div>

            {/* Vision & Mission Cards */}
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Vision Card */}
              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-10 hover:shadow-xl transition-all duration-500 group">
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-blue-500 transition-colors">
                      OUR VISION
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-6" />
                     <p className="text-lg text-muted-foreground leading-relaxed">
                       To train <span className="text-blue-500 font-bold">5000 Thousand students per year</span> in different skills and 
                       empower them with the ability to provide professional services, creating wealth for themselves 
                       and for the nation.
                     </p>
                  </div>
                </div>
              </div>

              {/* Mission Card */}
              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-10 hover:shadow-xl transition-all duration-500 group">
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-green-500 transition-colors">
                      OUR MISSION
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-6" />
                     <p className="text-lg text-muted-foreground leading-relaxed">
                       SAMARTH SHAKTI FOUNDATION has tie-ups with various organizations for providing <span className="text-green-500 font-bold">free courses job training & Placement assistance</span> to Trained Candidates. To be world's premium institute in skill training & entrepreneurship development, committed to providing the best possible professional, skill oriented education that empowers students to become leaders with values, vision & versatility.
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Section - Clean & Professional */}
      <section className="py-24 bg-gradient-to-b from-muted/5 to-background">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Leadership Excellence</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">OUR</span>
                <span className="text-primary"> MANAGEMENT</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Visionary leaders driving educational excellence and transforming the landscape of skill development across India.
              </p>
            </div>

            {/* Management Cards */}
            <div className="grid lg:grid-cols-2 gap-12">
              
               {/* Director Profile */}
               <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-10 hover:shadow-xl transition-all duration-500 group">
                 <div className="text-center space-y-8">
                   <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                     <User className="h-12 w-12 text-white" />
                   </div>
                   
                   <div>
                     <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:text-blue-500 transition-colors">
                       Sanjay Rajbhar
                     </h3>
                     <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                       <Briefcase className="h-4 w-4 text-blue-500" />
                       <span className="text-blue-500 font-semibold">DIRECTOR</span>
                     </div>
                     <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-8" />
                   </div>
                   
                   <div className="space-y-6 text-left">
                     <div className="flex items-start space-x-4">
                       <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                         <GraduationCap className="h-4 w-4 text-blue-500" />
                       </div>
                       <p className="text-lg text-muted-foreground leading-relaxed">
                         <span className="text-primary font-semibold">Strategic leadership</span> in educational excellence and skill development, 
                         driving institutional growth and innovation across PAN India operations.
                       </p>
                     </div>
                     
                     <div className="flex items-start space-x-4">
                       <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                         <Trophy className="h-4 w-4 text-blue-500" />
                       </div>
                       <p className="text-lg text-muted-foreground leading-relaxed">
                         <span className="text-primary font-semibold">Expertise in government partnerships</span> with NSDC, PMKVY
                         and various state-level skill development initiatives.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Manager Profile */}
               <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-10 hover:shadow-xl transition-all duration-500 group">
                 <div className="text-center space-y-8">
                   <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                     <Briefcase className="h-12 w-12 text-white" />
                   </div>
                   
                   <div>
                     <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:text-green-500 transition-colors">
                       Surendra Prajapati
                     </h3>
                     <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
                       <Target className="h-4 w-4 text-green-500" />
                       <span className="text-green-500 font-semibold">MANAGER</span>
                     </div>
                     <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-8" />
                   </div>
                   
                   <div className="space-y-6 text-left">
                     <div className="flex items-start space-x-4">
                       <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                         <Building2 className="h-4 w-4 text-green-500" />
                       </div>
                       <p className="text-lg text-muted-foreground leading-relaxed">
                         <span className="text-primary font-semibold">Operational excellence</span> in managing training centers 
                         and ensuring quality delivery of skill development programs across multiple states.
                       </p>
                     </div>
                     
                     <div className="flex items-start space-x-4">
                       <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                         <CheckCircle className="h-4 w-4 text-green-500" />
                       </div>
                       <p className="text-lg text-muted-foreground leading-relaxed">
                         <span className="text-primary font-semibold">Expert coordination</span> of training programs, 
                         placement activities and maintaining strong industry partnerships.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Managing Director Profile - Full Width */}
             <div className="mt-12">
               <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-10 hover:shadow-xl transition-all duration-500 group">
                 <div className="text-center space-y-8">
                   <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                     <Star className="h-12 w-12 text-white" />
                   </div>
                   
                   <div>
                     <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:text-purple-500 transition-colors">
                       Neha Bhardwaj
                     </h3>
                     <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
                       <Trophy className="h-4 w-4 text-purple-500" />
                       <span className="text-purple-500 font-semibold">MANAGING DIRECTOR</span>
                     </div>
                     <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-8" />
                   </div>
                   
                   <div className="max-w-4xl mx-auto">
                     <div className="grid md:grid-cols-2 gap-8">
                       <div className="flex items-start space-x-4">
                         <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                           <Target className="h-4 w-4 text-purple-500" />
                         </div>
                         <p className="text-lg text-muted-foreground leading-relaxed">
                           <span className="text-primary font-semibold">Visionary leadership</span> driving the organization's 
                           mission to empower 25,000+ students with world-class skill development programs.
                         </p>
                       </div>
                       
                       <div className="flex items-start space-x-4">
                         <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                           <Building2 className="h-4 w-4 text-purple-500" />
                         </div>
                         <p className="text-lg text-muted-foreground leading-relaxed">
                           <span className="text-primary font-semibold">Strategic expansion</span> of training centers 
                           across 22+ states with focus on placement-linked skill training programs.
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Recognition & Awards</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">HALL OF</span>
                <span className="text-primary"> FAME</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A testament to our unwavering dedication to excellence, showcasing awards that reflect our commitment 
                to world-class education and innovation.
              </p>
            </div>

            {/* Awards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 group hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {achievement}
                  </h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Centers Section */}
      <section className="py-24 bg-gradient-to-b from-muted/5 to-background">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Pan India Network</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">OUR</span>
                <span className="text-primary"> CENTRES</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Strategically located across 22+ states to bring world-class skill training to every corner of India.
              </p>
              
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Phone className="mr-2 h-5 w-5" />
                Contact Our Centers
              </Button>
            </div>

            {/* Centers Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 text-center">
                <MapPin className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-500 mb-1">22+</div>
                <div className="text-muted-foreground font-medium">States Covered</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/20 rounded-xl p-6 text-center">
                <Building2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-500 mb-1">50+</div>
                <div className="text-muted-foreground font-medium">Active Centers</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6 text-center">
                <Users className="h-10 w-10 text-purple-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-500 mb-1">1000+</div>
                <div className="text-muted-foreground font-medium">Daily Students</div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-orange-600/5 border border-primary/20 rounded-xl p-6 text-center">
                <Trophy className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">95%</div>
                <div className="text-muted-foreground font-medium">Success Rate</div>
              </div>
            </div>

            {/* Centers Table */}
            <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20 p-6">
                <div className="flex items-center justify-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">Training Centers Across India</h3>
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-muted/30 backdrop-blur-sm border-b border-border/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-foreground">State</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-foreground">District</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Centre Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {centers.map((center, index) => (
                      <tr key={index} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="font-semibold text-foreground">{center.state}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">{center.district}</td>
                        <td className="px-6 py-4 text-primary font-semibold text-sm">{center.name}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{center.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Call Us</h3>
                <div className="space-y-3">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
                    <span className="text-primary font-semibold text-lg">0120 428 2837</span>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
                    <span className="text-primary font-semibold text-lg">0120 457 0318</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Email Us</h3>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
                  <span className="text-primary font-semibold text-lg break-all">
                    samarthshakti.azm@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;