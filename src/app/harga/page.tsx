import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";

export default function HargaPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <PricingSection />
            <CTASection />
            <Footer />
        </main>
    );
}
