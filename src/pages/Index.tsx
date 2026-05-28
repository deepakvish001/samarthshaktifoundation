import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Welcome from '@/components/Welcome';
import ModiQuote from '@/components/ModiQuote';
import MissionCourses from '@/components/MissionCourses';
import EducationalSlider from '@/components/EducationalSlider';
import GovernmentSchemes from '@/components/GovernmentSchemes';
import ImageSlider from '@/components/ImageSlider';
import Donation from '@/components/Donation';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import StudentsCornerSection from '@/components/StudentsCornerSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <StudentsCornerSection />
        <Welcome />
        <ModiQuote />
        <MissionCourses />
        <EducationalSlider />
        <GovernmentSchemes />
        <ImageSlider />
        <div id="donation">
          <Donation />
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
