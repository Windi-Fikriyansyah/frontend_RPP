"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center">Ketentuan Layanan</h1>

                <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Penerimaan Ketentuan</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Dengan mendaftar atau menggunakan layanan RPPGenius, Anda menyetujui untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Izin Penggunaan</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Kami memberikan Anda lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan untuk menggunakan layanan kami sesuai dengan ketentuan ini. Anda dilarang menggunakan layanan untuk tujuan ilegal atau melanggar hak orang lain.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Akun Pengguna</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi. Segala aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Batasan Tanggung Jawab</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            RPPGenius tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat penggunaan atau ketidakmampuan menggunakan layanan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Perubahan Ketentuan</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Kami berhak untuk mengubah ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui situs web kami. Penggunaan layanan yang berkelanjutan setelah perubahan dianggap sebagai persetujuan Anda terhadap ketentuan yang baru.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
