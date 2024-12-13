import AboutMe from "@/components/LandingPage/AboutMe";
import Experiences from "@/components/LandingPage/Experiences";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import Projects from "@/components/LandingPage/Projects";
import Testimonials from "@/components/LandingPage/Testimonials";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <AboutMe />
      <Projects />
      <Experiences />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default LandingPage;