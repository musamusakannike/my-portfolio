import PortfolioPage from "@/components/LandingPage/PortfolioPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Musa Musa Kannike — Frontend Developer",
  description:
    "Frontend developer crafting pixel-perfect, performant, and accessible interfaces with React and Next.js.",
};

const FrontendPage = () => <PortfolioPage variant="frontend" />;

export default FrontendPage;
