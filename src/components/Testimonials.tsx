import { Star, Quote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Gaurav Kumar',
      quote: "SAMARTH SHAKTI FOUNDATION gave me the platform and opportunities to enhance my career and change my life.",
      role: 'Software Developer',
      company: 'Tech Solutions Pvt Ltd',
      image: '/placeholder-avatar-1.jpg'
    },
    {
      name: 'Uttam Arya',
      quote: "Taking admission at SAMARTH SHAKTI FOUNDATION gave a new turn to my life. I learned a lot of things including discipline and etiquette.",
      role: 'Retail Manager',
      company: 'Fashion Hub',
      image: '/placeholder-avatar-2.jpg'
    },
    {
      name: 'Praveen Kumar',
      quote: "I am thankful to SAMARTH SHAKTI FOUNDATION for helping me secure a placement at a reputed IT company.",
      role: 'Systems Analyst',
      company: 'InfoTech Corp',
      image: '/placeholder-avatar-3.jpg'
    }
  ];

  return (
    <section className="section-padding bg-muted/20">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-4">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold">Success Stories</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What Our <span className="text-primary">Students Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At SAMARTH SHAKTI FOUNDATION, we believe that every student has the potential to succeed. 
            Here are some inspiring stories from our graduates.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="card-premium group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Quote className="h-6 w-6 text-primary" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-primary" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-center mb-6">
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Student Info */}
              <div className="text-center border-t border-border/50 pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-primary font-medium mb-1">
                  {testimonial.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stats */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Student Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">88%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Placement Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">₹25K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Average Starting Salary</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Partner Companies</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Ready to Write Your Success Story?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with SAMARTH SHAKTI FOUNDATION. 
            Start your journey toward professional success today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-primary group">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="btn-secondary">
              See More Success Stories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;