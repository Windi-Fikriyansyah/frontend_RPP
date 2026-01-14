"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Loader2, CreditCard, Wallet, Banknote, QrCode, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

const plans = [
    {
        id: "free",
        name: "Gratis",
        price: "Rp 0",
        priceNumeric: 0,
        period: "selamanya",
        description: "Cocok untuk mencoba fitur dasar",
        features: [
            "3 RPP per bulan",
            "Export PDF",
            // "Copy Text"
        ],
        cta: "Mulai Gratis",
        popular: false
    },
    {
        id: "monthly",
        name: "Pro (Guru Juara)",
        price: "Rp 39.000",
        priceNumeric: 39000,
        period: "per bulan",
        description: "Solusi lengkap administrasi guru anti pusing",
        features: [
            "RPP Tanpa Batas (Unlimited)",
            "Generate PPT Estetik (Unlimited)",
            "Buat Soal Otomatis",
            "Download Format Word (Bisa Diedit)",
            "Simpan Riwayat Selamanya",
            "Bebas Watermark & Iklan"
        ],
        cta: "Langganan Sekarang",
        popular: true
    },
    // {
    //     id: "school",
    //     name: "Sekolah",
    //     price: "Rp 299.000",
    //     priceNumeric: 299000,
    //     period: "per bulan",
    //     description: "Untuk sekolah dengan banyak guru",
    //     features: [
    //         "Semua fitur Pro",
    //         "Hingga 50 guru",
    //         "Dashboard admin",
    //         "Laporan statistik",
    //         "Training onboarding",
    //         "Dedicated support"
    //     ],
    //     cta: "Pilih Paket",
    //     popular: false
    // }
];

type TripayChannel = {
    code: string;
    name: string;
    type: string;
    fee_merchant: {
        flat: number;
        percent: number;
    };
    fee_customer: {
        flat: number;
        percent: number;
    };
    group: string;
    icon_url: string;
    active: boolean;
};

const PricingSection = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [channels, setChannels] = useState<TripayChannel[]>([]);
    const [fetchingChannels, setFetchingChannels] = useState(false);

    useEffect(() => {
        if (showModal && channels.length === 0) {
            fetchChannels();
        }
    }, [showModal]);

    const fetchChannels = async () => {
        setFetchingChannels(true);
        try {
            const res = await api.get("/api/payment/channels");
            if (res.data.success) {
                setChannels(res.data.data);
            }
        } catch (error) {
            toast.error("Gagal memuat metode pembayaran.");
        } finally {
            setFetchingChannels(false);
        }
    };

    const handlePlanSelect = (planId: string) => {
        if (planId === "free") {
            router.push("/buat-rpp");
            return;
        }
        setSelectedPlanId(planId);
        setShowModal(true);
    };

    const handleSubscribe = async (channelCode: string) => {
        if (!selectedPlanId) return;

        setLoading(channelCode);
        try {
            const res = await api.post("/api/payment/create", {
                plan_id: selectedPlanId,
                payment_method: channelCode
            });

            if (res.data.success && res.data.checkout_url) {
                toast.success("Mengarahkan ke pembayaran...");
                window.location.href = res.data.checkout_url;
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("Silakan login terlebih dahulu.");
                router.push("/login");
            } else {
                toast.error("Gagal memproses pembayaran. Silakan coba lagi.");
            }
        } finally {
            setLoading(null);
        }
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateFee = (baseAmount: number, channel: TripayChannel) => {
        const flat = channel.fee_merchant?.flat || 0;
        const percent = channel.fee_merchant?.percent || 0;
        return flat + (baseAmount * percent) / 100;
    };

    // Group channels
    const groupedChannels: Record<string, TripayChannel[]> = {};
    channels.filter(c => c.active).forEach(c => {
        if (!groupedChannels[c.group]) groupedChannels[c.group] = [];
        groupedChannels[c.group].push(c);
    });

    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    return (
        <section id="harga" className="py-24 bg-card relative">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                        Harga
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Pilih Paket yang{" "}
                        <span className="text-gradient-primary">Sesuai Kebutuhan</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Mulai gratis, upgrade kapan saja sesuai kebutuhan Anda.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-8 transition-all hover:translate-y-[-4px] ${plan.popular
                                ? 'bg-foreground text-background shadow-strong scale-105'
                                : 'bg-background border border-border shadow-soft'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-secondary text-secondary-foreground text-sm font-medium shadow-glow-secondary">
                                        <Sparkles className="w-4 h-4" />
                                        Paling Populer
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-background' : 'text-foreground'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1 mb-2 whitespace-nowrap">
                                    <span className={`text-4xl font-extrabold ${plan.popular ? 'text-background' : 'text-foreground'}`}>
                                        {plan.price}
                                    </span>
                                    <span className={`text-sm ${plan.popular ? 'text-background/70' : 'text-muted-foreground'}`}>
                                        /{plan.period}
                                    </span>
                                </div>
                                <p className={`text-sm ${plan.popular ? 'text-background/70' : 'text-muted-foreground'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-background/20' : 'bg-primary/10'}`}>
                                            <Check className={`w-3 h-3 ${plan.popular ? 'text-background' : 'text-primary'}`} />
                                        </div>
                                        <span className={`text-sm ${plan.popular ? 'text-background/90' : 'text-foreground'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? "secondary" : "hero"}
                                size="lg"
                                className="w-full"
                                onClick={() => handlePlanSelect(plan.id)}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Channel Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-background border border-border rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
                            <div className="flex-1 min-w-0 pr-4">
                                <h2 className="text-xl md:text-2xl font-bold text-foreground truncate">Detail Pembayaran</h2>
                                <p className="text-muted-foreground text-sm truncate">
                                    Paket: <span className="font-semibold text-foreground">{selectedPlan?.name}</span> ({selectedPlan?.price})
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Banner Info */}
                        <div className="bg-orange-50 border-b border-orange-100 p-4 flex items-start gap-3">
                            <div className="bg-orange-500 rounded-full p-1 mt-0.5">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-sm text-orange-800 font-medium">
                                Sesuai ketentuan, biaya layanan metode pembayaran ditanggung oleh pengguna.
                            </p>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto p-6 space-y-8">
                            {fetchingChannels ? (
                                <div className="py-12 flex flex-col items-center justify-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                                    <p className="text-muted-foreground">Memuat metode pembayaran...</p>
                                </div>
                            ) : (
                                Object.entries(groupedChannels).map(([group, groupChannels]) => (
                                    <div key={group} className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                            {group === 'Virtual Account' && <CreditCard className="w-4 h-4" />}
                                            {group === 'E-Wallet' && <Wallet className="w-4 h-4" />}
                                            {group === 'Convenience Store' && <Banknote className="w-4 h-4" />}
                                            {group === 'QRIS' && <QrCode className="w-4 h-4" />}
                                            {group}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {groupChannels.map((channel) => {
                                                const fee = calculateFee(selectedPlan?.priceNumeric || 0, channel);
                                                const total = (selectedPlan?.priceNumeric || 0) + fee;
                                                return (
                                                    <button
                                                        key={channel.code}
                                                        onClick={() => handleSubscribe(channel.code)}
                                                        disabled={loading !== null}
                                                        className="flex items-center p-3 sm:p-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-accent transition-all text-left relative overflow-hidden group"
                                                    >
                                                        <div className="w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center mr-4 border border-border group-hover:scale-105 transition-transform shrink-0">
                                                            <img src={channel.icon_url} alt={channel.name} className="max-w-full max-h-full object-contain" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-foreground leading-tight mb-1 truncate">{channel.name}</p>
                                                            <p className="text-xs font-bold text-primary whitespace-nowrap">Biaya Layanan: {formatRupiah(fee)}</p>
                                                        </div>
                                                        {loading === channel.code && (
                                                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-muted/30 border-t border-border text-center">
                            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3 text-primary" />
                                Aktivasi instan setelah pembayaran diverifikasi oleh Tripay.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PricingSection;
