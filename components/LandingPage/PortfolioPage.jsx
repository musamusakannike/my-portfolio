import AboutMe from "@/components/LandingPage/AboutMe";
import Experiences from "@/components/LandingPage/Experiences";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import Projects from "@/components/LandingPage/Projects";
import Testimonials from "@/components/LandingPage/Testimonials";
import Contact from "@/components/LandingPage/Contact";
import LoadingWrapper from "@/components/ui/LoadingWrapper";
import { getPortfolioData } from "@/utils/portfolioData";

// Server component: fetches CMS content + projects for a portfolio variant
// and renders the shared animated landing layout.
export default async function PortfolioPage({ variant = "main" }) {
  const { content, projects } = await getPortfolioData(variant);

  return (
    <LoadingWrapper text={content?.hero?.logo || "CODIAC"}>
      <div>
        <Hero content={content.hero} variant={variant} />
        <AboutMe content={content.about} cvUrl={content.cvUrl} variant={variant} />
        <Projects projects={projects} variant={variant} />
        <Experiences content={content.experiences} variant={variant} />
        <Testimonials content={content.testimonials} variant={variant} />
        <Contact content={content.contact} variant={variant} />
        <Footer content={content.footer} variant={variant} />
      </div>
    </LoadingWrapper>
  );
}
