"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, FileCheck } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen pt-24 pb-16 gradient-hero overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-8 animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-accent-foreground">
                            Platform #1 untuk RPP Kurikulum Merdeka
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-in-up">
                        Bebas Begadang, <br />
                        <span className="text-gradient-primary">Administrasi Guru</span> <br />
                        Selesai dalam 2 Menit!
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Gak cuma RPP! Buat <b>Soal Otomatis</b> yang sinkron dengan materi Anda. 100% Sesuai Kurikulum Merdeka & PMM.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Link href="/login">
                            <Button variant="hero" size="xl">
                                Mulai Buat RPP Gratis
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="#fitur">
                            <Button variant="hero-outline" size="xl">
                                Lihat Fitur
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-card shadow-soft border border-border">
                            <Clock className="w-8 h-8 text-primary mb-3" />
                            <span className="text-3xl font-bold text-foreground">2 Menit</span>
                            <span className="text-sm text-muted-foreground">Waktu Pembuatan</span>
                        </div>
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-card shadow-soft border border-border">
                            <FileCheck className="w-8 h-8 text-secondary mb-3" />
                            <span className="text-3xl font-bold text-foreground">10.000+</span>
                            <span className="text-sm text-muted-foreground">RPP Dibuat</span>
                        </div>
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-card shadow-soft border border-border">
                            <Sparkles className="w-8 h-8 text-primary mb-3" />
                            <span className="text-3xl font-bold text-foreground">98%</span>
                            <span className="text-sm text-muted-foreground">Guru Puas</span>
                        </div>
                    </div>
                </div>

                {/* Hero Banner Preview */}
                <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-background/50 backdrop-blur-sm p-1 md:p-2">
                        <div className="rounded-2xl overflow-hidden bg-muted relative group">
                            <img
                                src="/banner.png"
                                alt="RPPGenius Platform Preview"
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
