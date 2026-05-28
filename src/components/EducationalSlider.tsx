import React from 'react';

const EducationalSlider = () => {
  const images = [
    '/lovable-uploads/5a244998-078a-4cde-80ac-dda3328ff9d9.png',
    '/lovable-uploads/c83f9904-7dac-4a29-884a-d1ef548c8a14.png',
    '/lovable-uploads/cbd42561-5db2-42b3-a241-5c8d8615b11e.png',
    '/lovable-uploads/bad08f95-1ce7-4bf2-82a2-cb8fa732111c.png',
    '/lovable-uploads/f568af3f-79f2-4d93-ac91-9ea1226b5b30.png',
    '/lovable-uploads/29670075-707b-4bae-b43a-36977d2d2d01.png',
    '/lovable-uploads/9e03d703-beb5-4c8e-ad58-3ca993b1dbc9.png',
    '/lovable-uploads/81c7d7d9-1177-4997-8787-bdef38a0eda3.png',
    '/lovable-uploads/66872840-a0ff-4360-93db-0a6e70fc67ab.png',
    '/lovable-uploads/7b9fa7e6-dfa9-47f2-b837-4922cb830428.png'
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-black text-primary mb-4">
            Educational Excellence in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our comprehensive educational programs designed to empower students with practical skills and knowledge
          </p>
        </div>
      </div>
      
      <div className="relative">
        {/* Continuous sliding container */}
        <div className="flex animate-[slide_25s_linear_infinite] gap-6">
          {/* First set of images */}
          {images.map((image, index) => (
            <div
              key={`first-${index}`}
              className="flex-none w-80 h-56 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-4"
            >
              <img
                src={image}
                alt={`Educational program ${index + 1}`}
                className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {images.map((image, index) => (
            <div
              key={`second-${index}`}
              className="flex-none w-80 h-56 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-4"
            >
              <img
                src={image}
                alt={`Educational program ${index + 1}`}
                className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
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
          Transforming education through hands-on learning and skill development
        </p>
      </div>
    </section>
  );
};

export default EducationalSlider;