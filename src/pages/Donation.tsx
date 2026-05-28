import { useState } from 'react';
import { Heart, Copy, Check, CreditCard, MapPin, Phone, Building, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const DonationPage = () => {
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="section-padding bg-gradient-to-br from-primary/5 via-orange-50/50 to-red-50/30">
        <div className="container-custom">
          {/* Back Button */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>

          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full px-6 py-2 mb-6">
              <Heart className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-primary font-semibold">Support Our Mission</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Make a <span className="text-primary">Donation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your support helps us provide quality education and skill development to students across Uttar Pradesh.
              Every contribution makes a difference in someone's life.
            </p>
            <div className="flex justify-center mt-8">
              <img 
                src="/lovable-uploads/6c6e5574-a79c-4491-9b27-f19a22d00a2c.png" 
                alt="Secure Payment Options" 
                className="h-12 w-auto opacity-90"
              />
            </div>
          </div>

          {/* Bank-Style Payment Section */}
          <div className="max-w-4xl mx-auto">
            
            {/* Direct Deposit Section */}
            <div className="bg-white border-2 border-gray-800 mb-8 shadow-2xl">
              {/* Header */}
              <div className="bg-gray-100 border-b-2 border-gray-800 p-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Direct Deposit In STATE BANK OF INDIA</h2>
              </div>

              {/* SBI Logo Section */}
              <div className="bg-gray-50 border-b border-gray-300 p-8 text-center">
                <div className="text-6xl font-bold text-[#1B3A6B] mb-4">
                  🏛️ STATE BANK OF INDIA
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <a
                    href="https://bank.sbi/web/home/locator/branch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700 transition-all duration-300 hover:scale-105 text-center block"
                  >
                    <span className="text-white font-medium">Open SBI Branch Locator</span>
                  </a>
                  <a
                    href="https://retail.onlinesbi.sbi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700 transition-all duration-300 hover:scale-105 text-center block"
                  >
                    <span className="text-white font-medium">Login to SBI Internet Banking</span>
                  </a>
                </div>
              </div>
              
              {/* Bank Details Table */}
              <div className="grid grid-cols-2">
                <div className="border-r border-gray-800">
                  <div className="bg-gray-100 border-b border-gray-800 p-3 font-semibold">Name of the Account</div>
                  <div className="bg-gray-100 border-b border-gray-800 p-3 font-semibold">Account number</div>
                  <div className="bg-gray-100 border-b border-gray-800 p-3 font-semibold">Branch Name</div>
                  <div className="bg-gray-100 border-b border-gray-800 p-3 font-semibold">Branch IFSC</div>
                  <div className="bg-gray-100 p-3 font-semibold">Branch Address</div>
                </div>
                <div>
                  <div className="border-b border-gray-800 p-3 flex justify-between items-center">
                    <span className="text-sm">SAMARTH SHAKTI FOUNDATION</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("SAMARTH SHAKTI FOUNDATION", "Account Name")}
                      className="h-6 w-6 p-0"
                    >
                      {copiedField === "Account Name" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="border-b border-gray-800 p-3 flex justify-between items-center">
                    <span className="font-mono">44950376779</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("44950376779", "Account Number")}
                      className="h-6 w-6 p-0"
                    >
                      {copiedField === "Account Number" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="border-b border-gray-800 p-3 flex justify-between items-center">
                    <span>JIYANPUR</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("JIYANPUR", "Branch Name")}
                      className="h-6 w-6 p-0"
                    >
                      {copiedField === "Branch Name" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="border-b border-gray-800 p-3 flex justify-between items-center">
                    <span className="font-mono">SBIN0012995</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("SBIN0012995", "IFSC Code")}
                      className="h-6 w-6 p-0"
                    >
                      {copiedField === "IFSC Code" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-sm">STATE BANK OF INDIA JIYANPUR BAZAR, MAIN ROAD AZAMGARH</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("STATE BANK OF INDIA JIYANPUR BAZAR, MAIN ROAD AZAMGARH", "Branch Address")}
                      className="h-6 w-6 p-0"
                    >
                      {copiedField === "Branch Address" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-yellow-50 border-t border-gray-800 p-4">
                <p className="font-semibold text-gray-800">IMPORTANT: PLEASE DEPOSIT CASH ONLY IN STATE BANK OF INDIA</p>
              </div>

              {/* Payment Methods */}
              <div className="border-t border-gray-800 p-4">
                <p className="font-semibold text-gray-800 mb-2">At All Your Nearest Branches of SBI You Can Pay Us By</p>
                <ol className="text-gray-700 space-y-1">
                  <li>1. Depositing Cash To Our SBI Account</li>
                  <li>2. Drop a Cheque for Collection in Our SBI Account</li>
                  <li>3. Online Transfer from Your SBI to Our SBI Account using EFT</li>
                  <li>4. Online Transfer from Any Bank to Our SBI Account using NEFT</li>
                </ol>
              </div>
            </div>
            
            {/* DD/Cheque Section */}
            <div className="bg-white border-2 border-gray-800 shadow-2xl">
              {/* Header */}
              <div className="bg-gray-100 border-b-2 border-gray-800 p-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  &gt;&gt; DD/Cheque By Post
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-gray-700 text-center">
                  Payments can also be made by Demand Draft/Cheque or Pay Order, to us by Post or Courier.
                </p>
                
                <div className="text-center">
                  <p className="text-gray-700 mb-2">The Demand Draft/Cheque should be drawn in favour of</p>
                  <p className="text-xl font-bold text-gray-800 mb-4">"Samarth Shakti Foundation"</p>
                </div>
                
                <p className="text-gray-700 text-center mb-6">
                  Please attach your details while mailing your DD/Cheque/Pay Order at the given address.
                </p>
                
                {/* Address */}
                <div className="text-center bg-gray-50 p-6 border border-gray-300 rounded">
                  <p className="font-bold text-gray-800 mb-2">To: SAMARTH SHAKTI FOUNDATION</p>
                  <p className="text-gray-700">Shanti Nagar Mehmauni Gali</p>
                  <p className="text-gray-700">Kaptanganj Azamgarh</p>
                  <p className="text-gray-700">Uttar Pradesh Pin code 276141</p>
                  <p className="text-gray-700 mt-3">Email id: samarthshakti.azm@gmail.com</p>
                </div>
              </div>
            </div>
            
            {/* Donate Now Button */}
            <div className="text-center mt-8">
              <Button className="donate-blink px-12 py-4 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white rounded-full shadow-xl transform transition-all duration-300 hover:scale-105">
                💖 Donate Now 💖
              </Button>
            </div>
            
            {/* View Bank Cheque Dialog */}
            <div className="text-center mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="px-6 py-3">
                    <CreditCard className="mr-2 h-5 w-5" />
                    View Bank Cheque Details
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
            </div>
            
            {/* Copy All Details Button */}
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  const allDetails = `Bank Name: STATE BANK OF INDIA\nAccount Name: SAMARTH SHAKTI FOUNDATION\nAccount Number: 44950376779\nIFSC Code: SBIN0012995\nBranch Name: JIYANPUR\nBranch Address: STATE BANK OF INDIA JIYANPUR BAZAR, MAIN ROAD AZAMGARH`;
                  copyToClipboard(allDetails, "All Details");
                }}
                className="flex items-center justify-center space-x-2 px-8 py-3"
              >
                <Copy className="h-5 w-5" />
                <span className="text-lg">Copy All Bank Details</span>
              </Button>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-16">
            <div className="card-premium max-w-2xl mx-auto">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Thank You for Your Support!</h3>
              <p className="text-muted-foreground">
                Your generosity helps us continue our mission of providing quality education and skill development 
                opportunities to students across Uttar Pradesh. Together, we're building a brighter future.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DonationPage;