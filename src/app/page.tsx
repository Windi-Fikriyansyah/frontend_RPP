"use client";

import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
// Dynamic imports for below-the-fold content
const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"), { ssr: true });
const HowItWorksSection = dynamic(() => import("@/components/HowItWorksSection"), { ssr: true });
const PricingSection = dynamic(() => import("@/components/PricingSection"), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), { ssr: true });
const CTASection = dynamic(() => import("@/components/CTASection"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  // const { user, loading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!loading && user) {
  //     router.push("/dashboard");
  //   }
  // }, [user, loading, router]);

  // if (loading) return null;

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
