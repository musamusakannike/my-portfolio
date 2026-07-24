import PortfolioPage from "@/components/LandingPage/PortfolioPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Musa Musa Kannike — Backend Engineer",
  description:
    "Backend engineer building robust, scalable APIs, data models, and infrastructure that power reliable products.",
};

const BackendPage = () => <PortfolioPage variant="backend" />;

export default BackendPage;
