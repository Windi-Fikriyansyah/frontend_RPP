"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
                <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
                    Pertanyaan yang sering diajukan seputar RPPGenius.
                </p>

                <div className="max-w-2xl mx-auto bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Apakah RPPGenius gratis?</AccordionTrigger>
                            <AccordionContent>
                                RPPGenius menyediakan paket gratis untuk percobaan. Untuk fitur lengkap tanpa batas, Anda dapat melakukan upgrade ke paket Premium atau Pro.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Apakah RPP yang dihasilkan sesuai Kurikulum Merdeka?</AccordionTrigger>
                            <AccordionContent>
                                Ya, AI kami telah dilatih khusus untuk menghasilkan struktur modul ajar yang sesuai dengan standar Kurikulum Merdeka terbaru.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Bagaimana cara mengunduh ke Word?</AccordionTrigger>
                            <AccordionContent>
                                Setelah RPP selesai dibuat, Anda akan melihat tombol "Unduh Word" di halaman hasil atau di history RPP Anda.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <Footer />
        </main>
    );
}
