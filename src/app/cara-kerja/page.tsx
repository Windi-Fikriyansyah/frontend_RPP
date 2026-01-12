import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";

export default function CaraKerjaPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <HowItWorksSection />
            <CTASection />
            <Footer />
        </main>
    );
}
