import { Mail, Phone, MapPin, Linkedin, Youtube, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Training Programs', href: '#training' },
    { name: 'Our Affiliates', href: '#affiliates' },
    { name: 'Contact Us', href: '#work-with-us' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' }
  ];

  const trainingPrograms = [
    'Apparel Manufacturing',
    'Organized Retail',
    'Electronics & Hardware',
    'Healthcare Services',
    'Food Processing',
    'Agriculture Services',
    'IT & Software',
    'Automotive Services'
  ];

  return (
    <footer className="bg-gradient-to-b from-card to-card/80 border-t border-border">
      <div className="container-custom">
        {/* Single Unified Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Company Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div>
                <a href="/" className="flex items-center space-x-3 mb-6 group cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-primary-foreground font-bold text-xl">M</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">SAMARTH SHAKTI</h3>
                    <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">FOUNDATION</h3>
                    <p className="text-sm text-primary font-medium">Skill Development Programs</p>
                  </div>
                </a>
                 <p className="text-muted-foreground leading-relaxed mb-6">
                   SAMARTH SHAKTI FOUNDATION is a pioneer in the field of Education, Skill Training and has been successfully running the skill development programs on PAN India Basis Since 2020. We are NSDC Training Partner with 5+ years of experience, empowering 25,000+ students across India with 100+ expert faculties and 100% placement assistance.
                 </p>
              </div>

              {/* Contact Info in Cards */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Shanti Nagar Mehmauni Gali Kaptanganj Azamgarh Uttar Pradesh Pin 276141
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    +91 7007989716, +91 9004362661
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    samarthshakti.azm@gmail.com
                  </span>
                </div>
              </div>

              {/* Legal Info */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                <h5 className="font-semibold text-foreground mb-3 text-sm">Official Registration</h5>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">REG No:</span>
                    <span className="font-medium text-foreground">BAL/10760/2019-2020</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST No:</span>
                    <span className="font-medium text-foreground">09AAXAM0981E1Z3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PAN No:</span>
                    <span className="font-medium text-foreground">AAXAM0981E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Website:</span>
                    <span className="font-medium text-primary">www.mataphoolpatidss.in</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6 border-b border-border pb-2">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Training Programs */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6 border-b border-border pb-2">Training Programs</h4>
              <ul className="space-y-3">
                {trainingPrograms.map((program) => (
                  <li key={program}>
                    <span className="text-sm text-muted-foreground flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full"></span>
                      <span>{program}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6 border-b border-border pb-2">Stay Connected</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest updates on training programs and industry news.
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input 
                    type="email"
                    placeholder="Enter your email"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary text-sm flex-1"
                  />
                  <Button className="btn-primary px-4 shrink-0 w-full sm:w-auto">
                    Subscribe
                  </Button>
                </div>

                {/* Social Links */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Follow Us</p>
                  <div className="flex space-x-3">
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors group"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors group"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors group"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground space-y-4 md:space-y-0">
            <p className="text-center md:text-left">
              © 2025 <span className="font-semibold text-foreground">SAMARTH SHAKTI FOUNDATION</span>. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;