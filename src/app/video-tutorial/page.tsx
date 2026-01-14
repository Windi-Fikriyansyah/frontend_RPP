"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PlayCircle } from "lucide-react";

export default function VideoTutorialPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6 text-center">Video Tutorial</h1>
                <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
                    Tonton video tutorial singkat untuk memahami fitur-fitur RPPGenius secara visual.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center mb-4 group-hover:bg-muted/80 transition-colors relative overflow-hidden">
                                <PlayCircle className="w-16 h-16 text-primary opacity-80 group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Tutorial Bagian {i}: Dasar-Dasar</h3>
                            <p className="text-sm text-muted-foreground">Pelajari fitur dasar dalam 2 menit.</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
