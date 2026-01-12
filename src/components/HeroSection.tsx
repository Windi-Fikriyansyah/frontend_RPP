"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, FileCheck, Play } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const HeroSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

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
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Buat RPP{" "}
                        <span className="text-gradient-primary">Kurikulum Merdeka</span>
                        <br />
                        dalam Hitungan Menit
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        RPPGenius membantu guru Indonesia membuat Rencana Pelaksanaan Pembelajaran yang sesuai standar dengan bantuan AI. Hemat waktu, tingkatkan kualitas.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Link href="/login">
                            <Button variant="hero" size="xl">
                                Mulai Buat RPP Gratis
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Button variant="hero-outline" size="xl">
                            Lihat Demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-card shadow-soft border border-border">
                            <Clock className="w-8 h-8 text-primary mb-3" />
                            <span className="text-3xl font-bold text-foreground">5 Menit</span>
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

                {/* Hero Video/Preview */}
                <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="relative rounded-2xl overflow-hidden shadow-strong border border-border bg-card p-2">
                        <div className="rounded-xl overflow-hidden bg-muted aspect-video relative group">
                            <video
                                className="w-full h-full object-cover"
                                muted
                                loop
                                playsInline
                                autoPlay={isPlaying}
                            />

                            {/* Play overlay */}
                            {!isPlaying && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-foreground/30 cursor-pointer transition-all hover:bg-foreground/40"
                                    onClick={() => setIsPlaying(true)}
                                >
                                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                                    </div>
                                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground font-medium bg-foreground/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                        Lihat Demo RPPGenius
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
