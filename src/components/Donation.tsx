import { useState } from 'react';
import { Heart, Copy, Check, CreditCard, MapPin, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Donation = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const bankDetails = {
    bankName: 'STATE BANK OF INDIA',
    branch: 'JIYANPUR',
    branchAddress: 'STATE BANK OF INDIA JIYANPUR BAZAR, MAIN ROAD AZAMGARH',
    ifscCode: 'SBIN0012995',
    accountNumber: '44950376779',
    accountHolder: 'SAMARTH SHAKTI FOUNDATION'
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="section-padding bg-gradient-to-br from-primary/5 via-orange-50/50 to-red-50/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full px-6 py-2 mb-6">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-primary font-semibold">Support Our Mission</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Make a <span className="text-primary">Donation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your support helps us provide quality education and skill development to students across Uttar Pradesh. 
            Every contribution makes a difference in someone's life.
          </p>
        </div>

        {/* Donation Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Impact Stats */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Your Impact
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="card-premium text-center">
                  <div className="text-3xl font-bold text-primary mb-2">₹500</div>
                  <p className="text-sm text-muted-foreground">Can sponsor study materials for 1 student</p>
                </div>
                <div className="card-premium text-center">
                  <div className="text-3xl font-bold text-primary mb-2">₹2,000</div>
                  <p className="text-sm text-muted-foreground">Can fund certification fees for 1 student</p>
                </div>
                <div className="card-premium text-center">
                  <div className="text-3xl font-bold text-primary mb-2">₹5,000</div>
                  <p className="text-sm text-muted-foreground">Can support complete training for 1 student</p>
                </div>
                <div className="card-premium text-center">
                  <div className="text-3xl font-bold text-primary mb-2">₹10,000</div>
                  <p className="text-sm text-muted-foreground">Can sponsor placement support for 5 students</p>
                </div>
              </div>
            </div>

            {/* Organization Details */}
            <div className="card-premium">
              <h4 className="font-semibold text-foreground mb-4 flex items-center">
                <Building className="h-5 w-5 text-primary mr-2" />
                About Our Organization
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Organization:</strong> Samarth Shakti Foundation
                </p>
                <p>
                  <strong className="text-foreground">Location:</strong> Shanti Nagar Mehmauni Gali Kaptanganj, Azamgarh, UP - 276141
                </p>
                <p>
                  <strong className="text-foreground">Mission:</strong> Providing quality skill development and educational opportunities to empower students across Uttar Pradesh.
                </p>
              </div>
            </div>
          </div>

          {/* Donation Methods */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                How to Donate
              </h3>
              
              {/* Bank Transfer Option */}
              <div className="card-premium space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground flex items-center">
                    <CreditCard className="h-5 w-5 text-primary mr-2" />
                    Bank Transfer
                  </h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Recommended</span>
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                  {Object.entries({
                    'Name of the Account': bankDetails.accountHolder,
                    'Account number': bankDetails.accountNumber,
                    'Branch Name': bankDetails.branch,
                    'Branch IFSC': bankDetails.ifscCode,
                    'Branch Address': bankDetails.branchAddress
                  }).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-foreground">{label}</div>
                        <div className="text-sm text-muted-foreground">{value}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(value, label)}
                        className="ml-2"
                      >
                        {copiedField === label ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full btn-primary">
                        <Heart className="mr-2 h-5 w-5" />
                        View Bank Cheque
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Bank Account Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
                          <table className="w-full text-left">
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700 w-1/3">Name of the Account:</td>
                                <td className="px-4 py-3 text-gray-900">SAMARTH SHAKTI FOUNDATION</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">Account number:</td>
                                <td className="px-4 py-3 text-gray-900 font-mono">44950376779</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">Branch Name:</td>
                                <td className="px-4 py-3 text-gray-900">JIYANPUR</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">Branch IFSC:</td>
                                <td className="px-4 py-3 text-gray-900 font-mono">SBIN0012995</td>
                              </tr>
                              <tr>
                                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">Branch Address:</td>
                                <td className="px-4 py-3 text-gray-900">STATE BANK OF INDIA JIYANPUR BAZAR, MAIN ROAD AZAMGARH</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          Use the above bank details to make your donation via bank transfer
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="w-full btn-secondary">
                    Copy All Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact for Donations */}
            <div className="card-premium">
              <h4 className="font-semibold text-foreground mb-4 flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                Need Help with Donation?
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  For any queries regarding donations or if you need assistance with the transfer process, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong className="text-foreground">Phone:</strong> 
                    <a href="tel:+917007989716" className="text-primary hover:underline ml-1">+91 7007989716</a>
                  </p>
                  <p className="text-sm">
                    <strong className="text-foreground">Email:</strong> 
                    <a href="mailto:samarthshakti.azm@gmail.com" className="text-primary hover:underline ml-1">samarthshakti.azm@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Donation;