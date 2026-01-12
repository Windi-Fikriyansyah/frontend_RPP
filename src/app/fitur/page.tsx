import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

export default function FiturPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <FeaturesSection />
            <CTASection />
            <Footer />
        </main>
    );
}
