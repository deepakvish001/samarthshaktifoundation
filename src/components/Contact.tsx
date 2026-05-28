import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
const Contact = () => {
  return <section id="work-with-us" className="section-padding bg-muted/10">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your skill development journey? Contact us today to learn more 
            about our training programs and placement opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Our Location</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Shanti Nagar Mehmauni Gali,<br />
                      Kaptanganj Azamgarh,<br />
                      Uttar Pradesh Pin 276141
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Call Us</h4>
                    <div className="space-y-1">
                      
                      <p className="text-muted-foreground">
                        <a href="tel:01204570318" className="hover:text-primary transition-colors">
                          0120 457 0318
                        </a>
                      </p>
                      <p className="text-muted-foreground">
                        <a href="tel:+917007989716" className="hover:text-primary transition-colors">
                          +91 7007989716
                        </a>
                      </p>
                      <p className="text-muted-foreground">
                        <a href="tel:+919004362661" className="hover:text-primary transition-colors">
                          +91 9004362661
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Email Us</h4>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">
                        <a href="mailto:samarthshakti.azm@gmail.com" className="hover:text-primary transition-colors">
                          samarthshakti.azm@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Business Hours</h4>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-muted-foreground">Saturday: 9:00 AM - 2:00 PM</p>
                      <p className="text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-premium">
              <h4 className="font-semibold text-foreground mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button className="w-full btn-primary group">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Schedule a Call
                </Button>
                <Button variant="outline" className="w-full btn-secondary">
                  Download Brochure
                </Button>
                <Button variant="outline" className="w-full btn-secondary">
                  WhatsApp Us
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-premium">
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Send us a Message
            </h3>
            
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input placeholder="Enter your first name" className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input placeholder="Enter your last name" className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input type="email" placeholder="Enter your email address" className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <Input type="tel" placeholder="Enter your phone number" className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course of Interest
                </label>
                <Input placeholder="Which course are you interested in?" className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea placeholder="Tell us about your requirements..." rows={4} className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary" />
              </div>

              <Button type="submit" className="w-full btn-primary group">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>;
};
export default Contact;