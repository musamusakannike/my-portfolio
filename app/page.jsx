import AboutMe from "@/components/LandingPage/AboutMe";
import Experiences from "@/components/LandingPage/Experiences";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import Projects from "@/components/LandingPage/Projects";
import Testimonials from "@/components/LandingPage/Testimonials";
import Contact from "@/components/LandingPage/Contact";
import LoadingWrapper from "@/components/ui/LoadingWrapper";

const LandingPage = () => {
  return (
    <LoadingWrapper text="CODIAC">
      <div>
        <Hero />
        <AboutMe />
        <Projects />
        <Experiences />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </LoadingWrapper>
  );
};

export default LandingPage;