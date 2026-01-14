"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PanduanPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6 text-center">Panduan Penggunaan</h1>
                <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
                    Langkah demi langkah menggunakan RPPGenius untuk membuat modul ajar (RPP) berkualitas.
                </p>
                <div className="prose prose-lg mx-auto bg-card p-8 rounded-2xl border border-border">
                    <h2>Cara Memulai</h2>
                    <ol>
                        <li>Daftar akun baru atau masuk jika sudah punya akun.</li>
                        <li>Pilih menu "Buat RPP".</li>
                        <li>Isi form detail modul ajar yang diinginkan (Mata pelajaran, kelas, topik, dll).</li>
                        <li>Klik tombol "Generate RPP".</li>
                        <li>Tunggu AI memproses, lalu review hasil RPP Anda.</li>
                        <li>Unduh dalam format Word atau PDF.</li>
                    </ol>
                </div>
            </div>
            <Footer />
        </main>
    );
}
