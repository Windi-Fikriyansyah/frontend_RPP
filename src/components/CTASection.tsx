import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 gradient-cta" />
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm mb-8">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                        <span className="text-sm font-medium text-primary-foreground">
                            Mulai sekarang, gratis selamanya
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                        Siap Membuat RPP dengan Lebih Cepat?
                    </h2>

                    <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
                        Bergabung dengan 10.000+ guru Indonesia yang sudah menghemat waktu dengan RPPGenius.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="xl"
                            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-strong hover:scale-[1.02] transition-all"
                        >
                            Mulai Buat RPP Gratis
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="xl"
                            className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10"
                        >
                            Jadwalkan Demo
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <p className="mt-8 text-sm text-primary-foreground/60">
                        ✓ Tidak perlu kartu kredit &nbsp;&nbsp; ✓ Setup dalam 30 detik &nbsp;&nbsp; ✓ Bisa cancel kapan saja
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
