"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center">Kebijakan Privasi</h1>

                <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Pendahuluan</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Selamat datang di RPPGenius. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan layanan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Informasi yang Kami Kumpulkan</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Informasi Akun (Nama, Email, dan data profil lainnya).</li>
                            <li>Data Penggunaan (Log aktivitas, interaksi dengan AI).</li>
                            <li>Konten yang Anda buat (RPP, Modul Ajar, Soal).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Penggunaan Informasi</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Kami menggunakan data Anda untuk menyediakan layanan, meningkatkan kualitas AI, memproses pembayaran, dan berkomunikasi dengan Anda terkait pembaruan layanan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Keamanan Data</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Hubungi Kami</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui whatsapp di 089622981080.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
