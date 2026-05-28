import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import upsdmLogo from '@/assets/upsdm-logo.png';
import nabardLogo from '@/assets/nabard-logo.png';
import indiaEmblem from '@/assets/india-emblem.png';

const GovernmentSchemes = () => {
  const schemes = [
    {
      title: "NULM",
      fullName: "National Urban Livelihoods Mission",
      ministry: "Ministry of Housing and Urban Poverty Alleviation",
      government: "Government of India",
      description: "Training and placement of more than 1300 urban poor under ICT/Beauty wellness/Textile in Buland-Shahr. To reduce poverty and vulnerability of the urban poor households by enabling them to access gainful self employment and skilled wage employment opportunities, resulting in an appreciable improvement in their livelihoods in a sustainable basis",
      logoUrl: indiaEmblem,
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      titleColor: "text-red-600"
    },
    {
      title: "UPSDM",
      fullName: "Uttar Pradesh Skill Development Mission",
      ministry: "Department of Vocational Education and Skill Development",
      government: "Government of Uttar Pradesh",
      description: "Training and Placement of 5400 beneficiaries per year for 3 years under ICT/Retail of Distt Etah / Kasganj / Azamgarh / Deoria / Bahraich. A National Skill Development Policy was launched in 2009 with the aim of skilling 500 million persons by 2022. Under the National Plan, the State of Uttar Pradesh aims to skill over 4 million youth by the end of the 12th Five Year Plan.",
      logoUrl: upsdmLogo,
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      titleColor: "text-red-600"
    },
    {
      title: "PANCHAYATI RAJ",
      fullName: "Capacity Development Program",
      ministry: "Ministry of Panchayati Raj",
      government: "Government of India",
      description: "Capacity Development Program for more than 45000+ PRI beneficiaries of Etah & Kasganj Districts 8994 beneficiaries, Moradabad Distt -9458 Beneficiaries Bijnore Distt -9458 Beneficiaries. Panchayats or village assemblies existed in ancient India as self-governing institutions which had distinct and well-defined functions. The institution of Panchayat",
      logoUrl: indiaEmblem,
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      titleColor: "text-red-600"
    },
    {
      title: "NABARD",
      fullName: "National Bank for Agriculture and Rural Development",
      ministry: "Ministry of Finance",
      government: "Government of India",
      description: "60 Beneficiaries each at Faizabad & Deoria Districts. Promoting cultural and social development of society through the provision of information services, consulting, implementation of education and creative programs that help all-round",
      logoUrl: nabardLogo,
      color: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      titleColor: "text-red-600"
    },
    {
      title: "PMKVY",
      fullName: "Pradhan Mantri Kaushal Vikas Yojana",
      ministry: "Ministry of Skill Development and Entrepreneurship",
      government: "Government of India",
      description: "Flagship scheme of the Ministry of Skill Development & Entrepreneurship (MSDE) implemented by the National Skill Development Corporation. The objective is to enable a large number of Indian youth to take up industry-relevant skill training that will help them in securing a better livelihood. Samarth Shakti Foundation is an empanelled training partner delivering short-term training and recognition of prior learning across multiple sectors.",
      logoUrl: indiaEmblem,
      color: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      titleColor: "text-red-600"
    },
    {
      title: "CSR TRAINING",
      fullName: "Corporate Social Responsibility Skill Training",
      ministry: "In partnership with Corporate CSR Initiatives",
      government: "Pan India",
      description: "Customized skill development and livelihood programs delivered in partnership with corporate CSR partners. Focused on empowering underprivileged youth, women and rural communities through industry-aligned training and 100% placement assistance. Programs cover Apparel, Retail, Electronics, Healthcare, Food Processing, Agriculture and IT-ITES sectors.",
      logoUrl: indiaEmblem,
      color: "from-rose-50 to-rose-100",
      borderColor: "border-rose-200",
      textColor: "text-rose-700",
      titleColor: "text-red-600"
    }
  ];

  return (
    <section id="schemes" className="py-20 bg-gradient-to-br from-background via-background/98 to-primary/3 relative overflow-hidden scroll-mt-24">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/5 w-80 h-80 bg-gradient-to-br from-primary/4 to-blue-500/2 rotate-45 rounded-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 left-1/5 w-60 h-60 bg-gradient-to-br from-orange-500/4 to-green-500/2 -rotate-12 rounded-2xl animate-float-slower" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Government </span>
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Schemes </span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">& Programs</span>
            </h2>
            <div className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/20 inline-block">
              <p className="text-lg md:text-xl text-foreground font-semibold">
                <span className="text-red-600 font-bold">Samarth Shakti Foundation</span> - Implementing Government Initiatives for Nation Building
              </p>
            </div>
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {schemes.map((scheme, index) => (
              <Card 
                key={index} 
                className={`group bg-gradient-to-br ${scheme.color} hover:shadow-2xl transition-all duration-500 hover:scale-105 ${scheme.borderColor} border-2 relative overflow-hidden h-full`}
              >
                {/* Card Header with Icon and Title */}
                <CardHeader className="text-center pb-4">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 p-2">
                      <img 
                        src={scheme.logoUrl} 
                        alt={`${scheme.title} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <CardTitle className={`text-2xl font-black ${scheme.titleColor} mb-2`}>
                      {scheme.title}
                    </CardTitle>
                    <div className={`text-sm font-bold ${scheme.textColor} text-center leading-tight`}>
                      <div className="font-black text-base">{scheme.fullName}</div>
                      <div className="text-xs mt-1 opacity-80">{scheme.ministry}</div>
                      <div className="text-xs opacity-70">{scheme.government}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className={`text-sm ${scheme.textColor} leading-relaxed text-justify`}>
                    {scheme.description}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <button className={`text-sm font-bold ${scheme.textColor} hover:underline flex items-center gap-1 group-hover:gap-2 transition-all duration-200`}>
                      Read More... 
                      <span className="text-xs">→</span>
                    </button>
                  </div>
                </CardContent>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full translate-y-4 -translate-x-4"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GovernmentSchemes;