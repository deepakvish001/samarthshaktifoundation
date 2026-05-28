import { Target, Eye, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  const features = [
    'NSDC Training Partner with Pan India Presence',
    'Expertise in Apparel, Retail, Electronics, Healthcare',
    'Food Processing and Agriculture Training',
    'Government Projects: DDUGKY, PMKVY, PMKK',
    'Free Courses with Job Training',
    'Placement Assistance to Trained Candidates'
  ];

  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/20 to-orange-400/10 border border-primary/30 rounded-full px-6 py-3 text-base backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-primary font-bold tracking-wide">Excellence Since 2020</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-foreground">
                Welcome to <br /><span className="text-gradient-enhanced bg-clip-text">SAMARTH SHAKTI</span><br />
                <span className="text-primary">FOUNDATION</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
                India's <span className="text-primary font-bold text-2xl">leading pioneer</span> in skill training excellence, 
                transforming lives through <span className="text-gradient font-bold">professional education</span> since inception. 
                With <span className="text-primary font-semibold">5+ years of experience</span>, we have successfully 
                <span className="text-primary font-semibold"> empowered 25,000+ students</span> across India with our 
                <span className="text-primary font-semibold">100+ expert faculties</span>.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary group">
                Know More About Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="btn-secondary">
                Call Us: 0120 428 2837
              </Button>
            </div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="space-y-8">
            {/* Vision Card */}
            <div className="card-premium group">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To train 5000 Thousand students per year in different skills and empower them with 
                    the ability to provide professional services, creating wealth for themselves 
                    and for the nation.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="card-premium group">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To be world's premium institute in skill training & entrepreneurship development, 
                    committed to providing the best possible professional, skill oriented education that 
                    empowers students to become leaders with values, vision & versatility.
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement Highlight */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Our Impact</div>
                <p className="text-muted-foreground">
                  Pioneer in skill training with 5+ years of experience, empowering 25,000+ students 
                  with 100+ expert faculties delivering professional education excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;