import { BookOpen, Briefcase, Award, Users, CheckCircle, ArrowRight, Scissors, ShoppingCart, Cpu, Heart, ChefHat, Tractor, Code, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const certificationBenefits = [
    {
      icon: Briefcase,
      title: 'Multiple Career Opportunities',
      description: 'Access to diverse job roles across various industries'
    },
    {
      icon: BookOpen,
      title: 'E-Content & Syllabus',
      description: 'Digital learning materials and comprehensive curriculum'
    },
    {
      icon: CheckCircle,
      title: 'Industry Preferred Certificate',
      description: 'Government recognized certifications valued by employers'
    },
    {
      icon: Users,
      title: '100% Placement Assistance',
      description: 'Dedicated support for job placement and career guidance'
    },
    {
      icon: Award,
      title: 'Training by Certified Trainers',
      description: 'Learn from industry experts and certified professionals'
    },
    {
      icon: BookOpen,
      title: 'Online Assessment',
      description: 'Digital evaluation and progress tracking system'
    }
  ];

  const trainingAreas = [
    {
      name: 'Apparel Manufacturing',
      icon: Scissors,
      color: 'from-pink-500/20 to-purple-500/20',
      iconBg: 'bg-pink-500/10'
    },
    {
      name: 'Organized Retail',
      icon: ShoppingCart,
      color: 'from-blue-500/20 to-cyan-500/20',
      iconBg: 'bg-blue-500/10'
    },
    {
      name: 'Electronics & Hardware',
      icon: Cpu,
      color: 'from-green-500/20 to-emerald-500/20',
      iconBg: 'bg-green-500/10'
    },
    {
      name: 'Healthcare Services',
      icon: Heart,
      color: 'from-red-500/20 to-rose-500/20',
      iconBg: 'bg-red-500/10'
    },
    {
      name: 'Food Processing',
      icon: ChefHat,
      color: 'from-orange-500/20 to-amber-500/20',
      iconBg: 'bg-orange-500/10'
    },
    {
      name: 'Agriculture & Allied Services',
      icon: Tractor,
      color: 'from-lime-500/20 to-green-500/20',
      iconBg: 'bg-lime-500/10'
    },
    {
      name: 'IT & Software Development',
      icon: Code,
      color: 'from-violet-500/20 to-purple-500/20',
      iconBg: 'bg-violet-500/10'
    },
    {
      name: 'Automotive Services',
      icon: Car,
      color: 'from-slate-500/20 to-gray-500/20',
      iconBg: 'bg-slate-500/10'
    }
  ];

  return (
    <section id="training" className="section-padding bg-muted/10">
      <div className="container-custom">
        {/* Ultra Premium Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/20 to-orange-400/10 border border-primary/30 rounded-full px-6 py-3 text-base mb-8 backdrop-blur-sm">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-primary font-bold tracking-wide">Professional Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 sm:mb-8 leading-tight">
            Our <span className="text-gradient-enhanced bg-clip-text">Training</span><br />
            <span className="text-primary">Programs</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed px-4 sm:px-0">
            <span className="text-primary font-bold">Government certified</span> training programs engineered to 
            <span className="text-gradient font-bold"> transform careers</span> and unlock unlimited opportunities
          </p>
        </div>

        {/* Training Areas */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
            Specialized Training Areas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {trainingAreas.map((area, index) => (
              <div 
                key={area.name}
                className={`bg-gradient-to-br ${area.color} backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4 text-center hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 sm:w-12 h-10 sm:h-12 ${area.iconBg} rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                  <area.icon className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground text-xs sm:text-sm leading-tight">{area.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Benefits */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
            SAMARTH SHAKTI FOUNDATION Certification Benefits
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {certificationBenefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className="card-premium group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-foreground mb-3">
                  {benefit.title}
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Process */}
        <div className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-primary/5 rounded-3xl p-8 sm:p-12 border border-border/50 shadow-2xl backdrop-blur-sm">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/20 to-orange-400/10 border border-primary/30 rounded-full px-6 py-3 text-sm mb-6 backdrop-blur-sm">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-primary font-semibold tracking-wide">Career Journey</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text">
              SAMARTH SHAKTI FOUNDATION
            </h3>
            <h4 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
              Placement Process
            </h4>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A systematic approach to <span className="text-primary font-semibold">transform your skills</span> into career success
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
            
            <div className="relative text-center group">
              <div className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-2xl shadow-lg group-hover:shadow-primary/25 group-hover:shadow-xl transition-all duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl sm:text-2xl">1</span>
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-3 text-base sm:text-lg">Training</h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Complete your certified training program with expert guidance</p>
            </div>

            <div className="relative text-center group">
              <div className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:shadow-blue-500/25 group-hover:shadow-xl transition-all duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl sm:text-2xl">2</span>
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-3 text-base sm:text-lg">Assessment</h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Pass comprehensive online and practical evaluations</p>
            </div>

            <div className="relative text-center group">
              <div className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg group-hover:shadow-green-500/25 group-hover:shadow-xl transition-all duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl sm:text-2xl">3</span>
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-3 text-base sm:text-lg">Certification</h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Receive government recognized industry certificate</p>
            </div>

            <div className="relative text-center group">
              <div className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-lg group-hover:shadow-purple-500/25 group-hover:shadow-xl transition-all duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl sm:text-2xl">4</span>
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-3 text-base sm:text-lg">Placement</h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Get 100% guaranteed placement assistance</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Enhance your skills and take your career to the next level with SAMARTH SHAKTI FOUNDATION
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-primary group">
              Explore Training Programs
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="btn-secondary">
              Download Course Catalog
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;