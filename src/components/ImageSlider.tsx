import React from 'react';

const ImageSlider = () => {
  const images = [
    '/lovable-uploads/fa22b092-0fae-4fd3-84e4-61513d2533c6.png',
    '/lovable-uploads/174d07a9-4227-4e6b-b307-3a6fdca4d15a.png',
    '/lovable-uploads/3340c4fb-dbb4-4a5c-b260-87e4d5a4ad3b.png',
    '/lovable-uploads/6746fd07-acd4-48f9-81ce-043af17c8b3d.png',
    '/lovable-uploads/a1146d18-230d-484d-ae40-ff5439edd4ed.png',
    '/lovable-uploads/ade740a9-8824-4c3f-be17-dd3443834ef0.png',
    '/lovable-uploads/216f993d-6433-4e0a-8d58-3df60c2f8d0f.png',
    '/lovable-uploads/160b7eaa-6ad6-488a-af88-fa7b24d69478.png',
    '/lovable-uploads/6cc4a1b9-3a9c-4f0a-a095-52b78971fbd1.png',
    '/lovable-uploads/d1f44324-44da-4d6f-9e28-a843fac807bc.png'
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-black text-primary mb-4">
            Our Certified Partners & Authorizations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Proud to be certified and authorized by leading government agencies and skill development councils across India
          </p>
        </div>
      </div>
      
      <div className="relative">
        {/* Continuous sliding container */}
        <div className="flex animate-[slide_30s_linear_infinite] gap-6">
          {/* First set of images */}
          {images.map((image, index) => (
            <div
              key={`first-${index}`}
              className="flex-none w-64 h-48 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex items-center justify-center"
            >
              <img
                src={image}
                alt={`Certified partner logo ${index + 1}`}
                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
           {images.map((image, index) => (
            <div
              key={`second-${index}`}
              className="flex-none w-64 h-48 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex items-center justify-center"
            >
              <img
                src={image}
                alt={`Certified partner logo ${index + 1}`}
                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for seamless blend */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
      </div>
      
      <div className="text-center mt-12">
        <p className="text-lg text-muted-foreground">
          Authorized by Government of India for quality skill development and certification programs
        </p>
      </div>
    </section>
  );
};

export default ImageSlider;