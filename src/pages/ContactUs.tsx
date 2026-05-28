import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  Building2,
  Globe,
  CheckCircle,
  ArrowRight,
  FileText,
  Shield,
  Info,
  Calendar,
  HeadphonesIcon,
  Sparkles,
  Rocket,
  TrendingUp,
  Star,
  Award,
  Target,
  Users,
  Heart,
  Zap,
  Gift,
  Crown,
  Gem,
  Flame,
  ChevronRight,
  Eye,
  Network,
  CircleDot,
  Layers,
  Badge,
  Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ContactUs = () => {
  const contactMethods = [
    {
      title: "Call Us",
      description: "Speak directly with our experts",
      icon: Phone,
      details: ["+91 7007989716", "+91 9004362661"],
      color: "text-green-600",
      bg: "bg-green-50",
      action: "Call Now"
    },
    {
      title: "Email Us",
      description: "Send us your queries",
      icon: Mail,
      details: ["samarthshakti.azm@gmail.com"],
      color: "text-blue-600",
      bg: "bg-blue-50",
      action: "Send Email"
    },
    {
      title: "Visit Our Website",
      description: "Explore our complete offerings",
      icon: Globe,
      details: ["www.mataphoolpatidss.in"],
      color: "text-purple-600",
      bg: "bg-purple-50",
      action: "Visit Website"
    },
    {
      title: "Office Hours",
      description: "Monday - Saturday",
      icon: Clock,
      details: ["9:00 AM - 6:00 PM"],
      color: "text-orange-600",
      bg: "bg-orange-50",
      action: "Plan Visit"
    }
  ];

  const officeDetails = [
    {
      title: "GST Number",
      value: "09AAXAM0981E1Z3",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "PAN Number", 
      value: "AAXAM0981E",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "Registration Number",
      value: "BAL/10760/2019-2020",
      icon: Building2,
      color: "text-purple-600"
    }
  ];

  const services = [
    { name: "Skill Development Programs", icon: "🎓" },
    { name: "Government Training Schemes", icon: "🏛️" },
    { name: "Placement Assistance", icon: "💼" },
    { name: "Entrepreneurship Development", icon: "🚀" },
    { name: "Career Guidance", icon: "🎯" },
    { name: "Industry Partnerships", icon: "🤝" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Clean & Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-muted/5 to-background">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,127,0,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,127,0,0.05)_50%,transparent_60%)]" />
        
        <div className="container-custom relative z-10 py-32">
          <div className="max-w-6xl mx-auto text-center space-y-16">
            
            {/* Clean Header Badge */}
            <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 rounded-full px-8 py-4 backdrop-blur-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-semibold text-lg">Get In Touch</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>

            {/* Clean Title Design */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block text-foreground">CONTACT</span>
                <span className="block text-gradient bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  US TODAY
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
                  Ready to Transform Your <span className="text-primary font-bold">Career Journey?</span>
                </p>
                 <p className="text-xl text-muted-foreground/80 leading-relaxed">
                   Connect with <span className="text-primary font-bold">SAMARTH SHAKTI FOUNDATION</span> - A pioneer in the field of Education, Skill Training running skill development programs on PAN India Basis Since 2020. Under the leadership of Director <span className="font-semibold">Sanjay Rajbhar</span>, Manager <span className="font-semibold">Surendra Prajapati</span>, and Managing Director <span className="font-semibold">Neha Bhardwaj</span>, we've empowered 25,000+ students with 100+ expert faculties.
                 </p>
              </div>
            </div>

            {/* Clean Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-primary">24/7</div>
                <div className="text-muted-foreground font-medium">Support Available</div>
                <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-green-500">24hrs</div>
                <div className="text-muted-foreground font-medium">Response Time</div>
                <div className="w-16 h-0.5 bg-green-500/30 mx-auto rounded-full" />
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-blue-500">100+</div>
                <div className="text-muted-foreground font-medium">Expert Faculties</div>
                <div className="w-16 h-0.5 bg-blue-500/30 mx-auto rounded-full" />
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-purple-500">100%</div>
                <div className="text-muted-foreground font-medium">Query Resolution</div>
                <div className="w-16 h-0.5 bg-purple-500/30 mx-auto rounded-full" />
              </div>
            </div>

            {/* Clean CTA Section */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Phone className="mr-3 h-6 w-6" />
                Call Us Now
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary/30 text-primary hover:bg-primary/5 px-10 py-4 rounded-xl font-semibold transition-all duration-300">
                <Mail className="mr-3 h-5 w-5" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods - Clean Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Network className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Multiple Ways to Connect</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">CHOOSE YOUR</span>
                <span className="text-primary"> METHOD</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Connect with us through your preferred communication channel and get instant support from our expert team.
              </p>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 group"
                >
                  {/* Icon Container */}
                  <div className={`w-16 h-16 ${method.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-3">{method.title}</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full mx-auto mb-4" />
                  
                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">{method.description}</p>
                  
                  {/* Contact Details */}
                  <div className="space-y-3 mb-8">
                    {method.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                        <span className={`font-semibold ${method.color}`}>{detail}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    {method.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Office - Clean Layout */}
      <section className="py-24 bg-gradient-to-r from-background via-muted/5 to-background">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20">
              
              {/* Contact Form */}
              <div className="space-y-8">
                {/* Section Header */}
                <div>
                  <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                    <Send className="h-5 w-5 text-primary" />
                    <span className="text-primary font-semibold">Send Message</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="text-foreground">LET'S START</span>
                    <span className="text-primary"> CONVERSATION</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Fill out the form below and we'll get back to you within 24 hours with personalized guidance.
                  </p>
                </div>
                
                {/* Form Card */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-500">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-foreground font-semibold">First Name</Label>
                        <Input 
                          id="firstName" 
                          placeholder="Enter your first name" 
                          className="h-12 border-border/50 focus:border-primary/50 rounded-xl" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-foreground font-semibold">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Enter your last name" 
                          className="h-12 border-border/50 focus:border-primary/50 rounded-xl" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        className="h-12 border-border/50 focus:border-primary/50 rounded-xl" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="Enter your phone number" 
                        className="h-12 border-border/50 focus:border-primary/50 rounded-xl" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="program" className="text-foreground font-semibold">Program of Interest</Label>
                      <Input 
                        id="program" 
                        placeholder="Which program interests you?" 
                        className="h-12 border-border/50 focus:border-primary/50 rounded-xl" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-foreground font-semibold">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us how we can help you transform your career..." 
                        rows={5} 
                        className="border-border/50 focus:border-primary/50 rounded-xl resize-none" 
                      />
                    </div>
                    
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>

              {/* Office Details */}
              <div className="space-y-8">
                {/* Section Header */}
                <div>
                  <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="text-primary font-semibold">Our Office</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="text-foreground">VISIT OUR</span>
                    <span className="text-primary"> CAMPUS</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Visit us at our registered office or connect digitally for immediate assistance.
                  </p>
                </div>
                
                {/* Address Card */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-500">
                  <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-7 w-7 text-primary" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">Registered Office</h3>
                        <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-primary">
                          SAMARTH SHAKTI FOUNDATION
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          Shanti Nagar Mehmauni Gali<br />
                          Kaptanganj Azamgarh<br />
                          Uttar Pradesh Pin 276141
                        </p>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all duration-300">
                        <Eye className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Official Details Grid */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Official Information</h3>
                  <div className="grid gap-4">
                    {officeDetails.map((detail, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                            <detail.icon className={`h-5 w-5 ${detail.color}`} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">{detail.title}</p>
                            <p className="font-bold text-foreground">{detail.value}</p>
                          </div>
                          <div className="ml-auto">
                            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              <CheckCircle className="h-4 w-4" />
                              <span>Verified</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Grid */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">How Can We Help You?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-3 p-4 bg-card/50 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-xl">{service.icon}</span>
                        </div>
                        <span className="font-medium text-foreground">{service.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-8">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold px-8 py-3 transition-all duration-300">
                      <Calendar className="mr-2 h-5 w-5" />
                      Schedule Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Clean Layout */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                <Info className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">Quick Answers</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">FREQUENTLY</span>
                <span className="text-primary"> ASKED QUESTIONS</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Quick answers to common queries about our programs and services
              </p>
            </div>
            
            {/* FAQ Grid */}
            <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {[
                {
                  question: "How do I enroll in a program?",
                  answer: "Contact us through phone, email, or visit our office. Our counselors will guide you through the enrollment process and help you choose the right program.",
                  icon: Users
                },
                {
                  question: "Are the programs government certified?",
                  answer: "Yes, all our programs are government certified and aligned with NSDC standards. You'll receive recognized certificates upon completion.",
                  icon: Award
                },
                {
                  question: "Do you provide placement assistance?",
                  answer: "Absolutely! We have partnerships with 50+ companies and provide 100% placement assistance to all our trained candidates.",
                  icon: Rocket
                },
                {
                  question: "What is the duration of training programs?",
                  answer: "Program duration varies from 3 months to 1 year depending on the course. All programs include both theoretical and practical training components.",
                  icon: Clock
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 group"
                >
                  {/* FAQ Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <faq.icon className="h-7 w-7 text-primary" />
                  </div>
                  
                  {/* Question */}
                  <h3 className="text-xl font-bold text-foreground mb-4 leading-relaxed">
                    {faq.question}
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full mb-6" />
                  
                  {/* Answer */}
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-20">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground font-medium">
                  Still have questions? We're here to help!
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <HeadphonesIcon className="mr-3 h-6 w-6" />
                  Contact Our Support Team
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

export default ContactUs;