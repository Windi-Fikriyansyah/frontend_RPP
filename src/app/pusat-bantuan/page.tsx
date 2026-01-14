"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PusatBantuanPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6 text-center">Pusat Bantuan</h1>
                <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
                    Temukan jawaban atas pertanyaan Anda dan pelajari cara menggunakan RPPGenius dengan maksimal.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {/* Placeholder Content */}
                    <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-xl mb-2">Akun & Profil</h3>
                        <p className="text-muted-foreground">Cara mengelola akun, mengubah password, dan pengaturan profil.</p>
                    </div>
                    <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-xl mb-2">Pembayaran</h3>
                        <p className="text-muted-foreground">Info metode pembayaran, billing, dan upgrade paket.</p>
                    </div>
                    <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-xl mb-2">Teknis</h3>
                        <p className="text-muted-foreground">Solusi jika mengalami kendala teknis saat menggunakan platform.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
