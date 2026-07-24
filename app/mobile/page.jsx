import PortfolioPage from "@/components/LandingPage/PortfolioPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Musa Musa Kannike — Mobile Developer",
  description:
    "Mobile developer building smooth, native-quality cross-platform apps with React Native.",
};

const MobilePage = () => <PortfolioPage variant="mobile" />;

export default MobilePage;
