import {
    Wand2,
    FileText,
    Download,
    Palette,
    BookOpen,
    Users,
    Clock
} from "lucide-react";

const features = [
    {
        icon: Wand2,
        title: "RPP Instan Kurikulum Merdeka",
        description: "Hasilkan Modul Ajar lengkap (Tujuan, Langkah, Asesmen) hanya dengan memasukkan topik materi.",
        color: "primary"
    },
    {
        icon: Palette,
        title: "Otomatis Jadi PPT Estetik",
        description: "Ubah materi RPP Anda menjadi slide presentasi yang siap pakai di kelas tanpa perlu desain manual.",
        color: "secondary"
    },
    {
        icon: BookOpen,
        title: "Generator Soal",
        description: "Buat soal pilihan ganda yang sesuai dengan materi RPP, lengkap dengan kunci jawaban.",
        color: "primary"
    },
    {
        icon: Download,
        title: "Export Word & PDF Rapi",
        description: "Download file yang sudah rapi, siap print, dan sesuai standar dinas atau pengawas sekolah.",
        color: "secondary"
    },
    {
        icon: Clock, // Import Clock dari Lucide
        title: "Riwayat & Bank Data",
        description: "Semua RPP dan soal tersimpan aman. Bisa diedit kembali atau digunakan untuk tahun ajaran depan.",
        color: "primary"
    },
    {
        icon: FileText,
        title: "Sesuai Format PMM",
        description: "Format dokumen telah disesuaikan untuk diupload ke Platform Merdeka Mengajar (PMM).",
        color: "secondary"
    }
];

const FeaturesSection = () => {
    return (
        <section id="fitur" className="py-24 bg-card">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                        Fitur Unggulan
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Semua yang Anda Butuhkan untuk{" "}
                        <span className="text-gradient-primary">Membuat RPP</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Fitur lengkap yang dirancang khusus untuk memudahkan guru Indonesia dalam menyusun RPP berkualitas.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-medium"
                        >
                            <div className={`w-14 h-14 rounded-xl ${feature.color === 'primary' ? 'gradient-primary' : 'gradient-secondary'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7 text-primary-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
