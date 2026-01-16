"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Loader2, Receipt, ExternalLink, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Transaction {
    id: number;
    merchant_ref: string;
    tripay_reference: string | null;
    amount: number;
    payment_method: string | null;
    payment_status: string;
    checkout_url: string | null;
    created_at: string;
}

export default function RiwayatTransaksi() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get("/api/payment/history");
                setTransactions(res.data);
            } catch (err: any) {
                setError(err.response?.data?.detail || "Gagal mengambil riwayat transaksi.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case "PAID":
                return <Badge className="bg-emerald-500 hover:bg-emerald-600">Terbayar</Badge>;
            case "UNPAID":
                return <Badge variant="outline" className="text-amber-600 border-amber-600">Menunggu Pembayaran</Badge>;
            case "EXPIRED":
                return <Badge variant="secondary">Kedaluwarsa</Badge>;
            case "FAILED":
                return <Badge variant="destructive">Gagal</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Memuat riwayat transaksi...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8 lg:py-12 mt-16 lg:mt-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Riwayat Transaksi</h1>
                        <p className="text-muted-foreground text-lg">Pantau semua transaksi dan status langganan Anda.</p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!transactions || transactions.length === 0 ? (
                        <Card className="border-dashed flex flex-col items-center justify-center py-16 px-4 bg-muted/30">
                            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mb-4">
                                <Receipt className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <CardTitle className="mb-2">Belum Ada Transaksi</CardTitle>
                            <CardDescription className="text-center max-w-xs">
                                Anda belum melakukan pembelian paket. Silakan hubungi tim kami atau pilih paket di halaman Harga.
                            </CardDescription>
                            <Button className="mt-6" asChild>
                                <a href="/harga">Pilih Paket</a>
                            </Button>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((trx) => (
                                <Card key={trx.id} className="overflow-hidden hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/10 hover:border-l-primary/40">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-primary/5 h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-primary/10">
                                                    <Receipt className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-bold text-lg text-foreground">{trx.merchant_ref}</span>
                                                        {getStatusBadge(trx.payment_status)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {format(new Date(trx.created_at), "PPP p", { locale: id })}
                                                    </p>
                                                    {trx.payment_method && (
                                                        <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
                                                            Metode: <span className="text-foreground">{trx.payment_method}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:items-end justify-between md:justify-center gap-4">
                                                <div className="text-2xl font-black text-foreground">
                                                    {formatCurrency(trx.amount)}
                                                </div>
                                                {trx.payment_status.toUpperCase() === "UNPAID" && trx.checkout_url && (
                                                    <Button size="sm" className="w-full md:w-auto gap-2 group shadow-sm" asChild>
                                                        {/* <a href={trx.checkout_url} target="_blank" rel="noopener noreferrer">
                                                            Bayar Sekarang
                                                            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        </a> */}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
