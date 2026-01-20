import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Ibu Sari Dewi",
        role: "Guru SD, Jakarta",
        content: "RPPGenius benar-benar membantu saya menghemat waktu. Dulu buat satu RPP bisa 2 jam, sekarang cuma 1 menit!",
        rating: 5
    },
    {
        name: "Bapak Ahmad Fauzi",
        role: "Guru SMP, Bandung",
        content: "Fitur AI-nya sangat pintar. RPP yang dihasilkan sudah sesuai dengan format Kurikulum Merdeka terbaru.",
        rating: 5
    },
    {
        name: "Ibu Maria Kristina",
        role: "Guru SMA, Surabaya",
        content: "Fitur Riwayat RPP dan Riwayat Soal sangat membantu. Saya bisa melihat kembali RPP dan soal yang pernah dibuat, mendownload nya kapan saja, dan tidak perlu mengulang dari awal.",
        rating: 5
    },
    {
        name: "Bapak Hendro",
        role: "Kepala Sekolah SMK, Yogyakarta",
        content: "Paket premium sangat worth it. Semua guru di sekolah kami sekarang pakai RPPGenius.",
        rating: 5
    }
];

const TestimonialsSection = () => {
    return (
        <section id="testimoni" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                        Testimoni
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Dipercaya oleh{" "}
                        <span className="text-gradient-secondary">Ribuan Guru</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Lihat apa kata guru-guru Indonesia tentang RPPGenius.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-card border border-border hover:shadow-medium transition-all duration-300"
                        >
                            {/* Quote Icon */}
                            <Quote className="w-10 h-10 text-primary/20 mb-4" />

                            {/* Content */}
                            <p className="text-foreground leading-relaxed mb-6">
                                "{testimonial.content}"
                            </p>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                                ))}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                                    {testimonial.name.split(' ').slice(1, 3).map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
