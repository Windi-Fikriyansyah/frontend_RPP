import {
    ClipboardList,
    Wand2,
    Edit3,
    Download,
    ArrowRight
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: ClipboardList,
        title: "Isi Informasi Dasar",
        description: "Masukkan mata pelajaran, kelas, topik pembelajaran, dan tujuan yang ingin dicapai."
    },
    {
        number: "02",
        icon: Wand2,
        title: "AI Generate RPP",
        description: "Sistem AI kami akan menganalisis dan menghasilkan RPP lengkap sesuai Kurikulum Merdeka."
    },
    {
        number: "03",
        icon: Edit3,
        title: "Edit & Sesuaikan",
        description: "Review dan edit bagian yang perlu disesuaikan dengan kebutuhan kelas Anda."
    },
    {
        number: "04",
        icon: Download,
        title: "Download & Gunakan",
        description: "Export RPP dalam format pilihan Anda dan langsung gunakan untuk mengajar."
    }
];

const HowItWorksSection = () => {
    return (
        <section id="cara-kerja" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                        Cara Kerja
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        4 Langkah Mudah{" "}
                        <span className="text-gradient-secondary">Membuat RPP</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Proses yang simpel dan cepat untuk menghasilkan RPP berkualitas tinggi.
                    </p>
                </div>

                {/* Steps */}
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-border">
                                        <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    </div>
                                )}

                                {/* Step Card */}
                                <div className="text-center">
                                    <div className="relative inline-block mb-6">
                                        <div className="w-24 h-24 rounded-2xl bg-accent border-2 border-primary/20 flex items-center justify-center mx-auto group hover:border-primary transition-colors duration-300">
                                            <step.icon className="w-10 h-10 text-primary" />
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
