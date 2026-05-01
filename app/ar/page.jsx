import AboutMeAr from "@/components/LandingPageAr/AboutMeAr";
import ExperiencesAr from "@/components/LandingPageAr/ExperiencesAr";
import FooterAr from "@/components/LandingPageAr/FooterAr";
import HeroAr from "@/components/LandingPageAr/HeroAr";
import ProjectsAr from "@/components/LandingPageAr/ProjectsAr";
import TestimonialsAr from "@/components/LandingPageAr/TestimonialsAr";
import ContactAr from "@/components/LandingPageAr/ContactAr";
import LoadingWrapper from "@/components/ui/LoadingWrapper";

export const metadata = {
  title: "موسى كانيكي - مطور متكامل",
  description: "معرض أعمال موسى موسى كانيكي مطور متكامل وشغوف ببناء منتجات قوية وجميلة.",
};

const ArabicLandingPage = () => {
  return (
    <LoadingWrapper text="CODIAC">
      <div
        className="font-arabic bg-black text-white min-h-screen antialiased"
        dir="rtl"
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Amiri:wght@400;700&family=El+Messiri:wght@400;500;600;700&display=swap');
            .font-cairo {
              font-family: 'Cairo', var(--font-geist-sans), system-ui, -apple-system, sans-serif !important;
            }
            .font-amiri {
              font-family: 'Amiri', serif !important;
            }
            .font-el-messiri {
              font-family: 'El Messiri', sans-serif !important;
            }
            .font-arabic {
              font-family: 'Cairo', var(--font-geist-sans), system-ui, -apple-system, sans-serif !important;
            }
          `
        }} />
        <HeroAr />
        <AboutMeAr />
        <ProjectsAr />
        <ExperiencesAr />
        <TestimonialsAr />
        <ContactAr />
        <FooterAr />
      </div>
    </LoadingWrapper>
  );
}

export default ArabicLandingPage;
