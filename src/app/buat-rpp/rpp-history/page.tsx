"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    Trash2,
    Eye,
    Download,
    Search,
    BookOpen,
    Printer,
    Filter,
    RotateCcw,
    Calendar,
    ChevronRight,
    MoreVertical,
    Plus,
    Loader2
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";

export default function RPPHistoryPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRPP, setSelectedRPP] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterMapel, setFilterMapel] = useState("Semua");
    const [filterKelas, setFilterKelas] = useState("Semua");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchUser();
        fetchHistory();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch (e) {
            console.error("Failed to load user");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get("/api/rpp/history");
            setHistory(res.data);
        } catch (e) {
            console.error(e);
            toast.error("Gagal mengambil riwayat RPP");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/rpp/history/${id}`);
            setHistory(history.filter((item) => item.id !== id));
            toast.success("RPP berhasil dihapus");
        } catch (e) {
            toast.error("Gagal menghapus RPP");
        } finally {
            setDeleteId(null);
        }
    };

    const handleExportWord = async (item: any) => {
        if (user?.subscription_plan !== "pro" && user?.subscription_plan !== "school") {
            toast.error("Fitur Premium", {
                description: "Upgrade paket Anda untuk mengunduh dokumen Word.",
                action: {
                    label: "Upgrade",
                    onClick: () => router.push("/harga")
                }
            });
            return;
        }

        try {
            const response = await api.post("/api/rpp/export-word", {
                content_markdown: item.content_markdown,
                mapel: item.mapel,
                topik: item.topik,
                kelas: item.kelas || "Semua"
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `RPP_${item.topik}.docx`.replace(/\s+/g, '_'));
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("File Word berhasil diunduh");
        } catch (e) {
            toast.error("Gagal mendownload file Word");
        }
    };

    const handleExportPDF = async (item: any) => {
        if (user?.subscription_plan !== "pro" && user?.subscription_plan !== "school") {
            toast.error("Fitur Premium", {
                description: "Upgrade paket Anda untuk mengunduh dokumen PDF.",
                action: {
                    label: "Upgrade",
                    onClick: () => router.push("/harga")
                }
            });
            return;
        }

        try {
            const response = await api.post("/api/rpp/export-pdf", {
                content_markdown: item.content_markdown,
                mapel: item.mapel,
                topik: item.topik,
                kelas: item.kelas || "Semua"
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `RPP_${item.topik}.pdf`.replace(/\s+/g, '_'));
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("File PDF berhasil diunduh");
        } catch (e) {
            toast.error("Gagal mendownload file PDF");
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilterMapel("Semua");
        setFilterKelas("Semua");
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.topik.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.mapel.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMapel = filterMapel === "Semua" || item.mapel === filterMapel;
        const matchesKelas = filterKelas === "Semua" || item.kelas === filterKelas;
        return matchesSearch && matchesMapel && matchesKelas;
    });

    // Extract unique values for filters
    const uniqueMapels = Array.from(new Set(history.map(item => item.mapel)));
    const uniqueKelas = Array.from(new Set(history.map(item => item.kelas)));

    // Statistics
    const totalDocs = history.length;
    const docsThisMonth = history.filter(item => {
        const date = new Date(item.created_at);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const lastUpdate = history.length > 0
        ? new Date(Math.max(...history.map(item => new Date(item.created_at).getTime()))).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })
        : "-";

    if (loading) {
        return <LoadingScreen message="Menyiapkan riwayat RPP Anda..." />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                {/* HEADER SECTION */}
                <div className="mb-10 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                                Riwayat <span className="text-gradient-primary">RPP</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Kelola, lihat, dan unduh kembali modul ajar (RPP) yang telah Anda buat dengan bantuan AI.
                            </p>
                        </div>
                        <Button variant="hero" className="rounded-2xl" asChild>
                            <Link href="/buat-rpp">
                                <Plus className="w-5 h-5 mr-2" />
                                Buat RPP Baru
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Dokumen</p>
                                <h3 className="text-3xl font-bold text-foreground mt-1">{totalDocs}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                                <Calendar className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bulan Ini</p>
                                <h3 className="text-3xl font-bold text-foreground mt-1">{docsThisMonth}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground group-hover:scale-110 transition-transform duration-500">
                                <RotateCcw className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Terakhir Dibuat</p>
                                <h3 className="text-3xl font-bold text-foreground mt-1">{lastUpdate}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* FILTERS & SEARCH */}
                <Card className="border-none shadow-soft mb-8 overflow-hidden rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row items-center gap-4">
                            <div className="relative w-full lg:flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan topik atau mata pelajaran..."
                                    className="w-full pl-12 pr-4 py-3 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-2xl border border-border/50 w-full md:w-auto">
                                    <Filter className="w-4 h-4 text-muted-foreground" />
                                    <select
                                        className="bg-transparent border-none focus:ring-0 text-sm font-medium text-foreground cursor-pointer outline-none"
                                        value={filterMapel}
                                        onChange={(e) => setFilterMapel(e.target.value)}
                                    >
                                        <option value="Semua">Semua Mapel</option>
                                        {uniqueMapels.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-2xl border border-border/50 w-full md:w-auto">
                                    <select
                                        className="bg-transparent border-none focus:ring-0 text-sm font-medium text-foreground cursor-pointer outline-none w-full"
                                        value={filterKelas}
                                        onChange={(e) => setFilterKelas(e.target.value)}
                                    >
                                        <option value="Semua">Semua Kelas</option>
                                        {uniqueKelas.map(k => <option key={k} value={k}>Kelas {k}</option>)}
                                    </select>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="text-muted-foreground hover:text-foreground rounded-xl"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* DATA DISPLAY */}
                {filteredHistory.length > 0 ? (
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-hidden rounded-3xl border border-border shadow-soft bg-card">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-b border-border">
                                        <TableHead className="font-bold text-foreground py-5 pl-8">Topik & Mapel</TableHead>
                                        <TableHead className="font-bold text-foreground py-5">Kelas</TableHead>
                                        <TableHead className="font-bold text-foreground py-5">Tanggal Dibuat</TableHead>
                                        <TableHead className="font-bold text-foreground py-5">Status</TableHead>
                                        <TableHead className="font-bold text-foreground py-5 text-right pr-8">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHistory.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-muted/20 transition-colors border-b border-border group">
                                            <TableCell className="py-5 pl-8">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{item.topik}</span>
                                                    <span className="text-xs text-muted-foreground mt-0.5">{item.mapel}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <div className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full inline-block">
                                                    Kelas {item.kelas}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 text-sm text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                                    Selesai
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 text-right pr-8">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="hero-outline"
                                                        size="sm"
                                                        onClick={() => setSelectedRPP(item)}
                                                        className="h-9 w-9 p-0 rounded-xl"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl border-border shadow-medium">
                                                            {/* <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-3 rounded-lg" onClick={() => window.print()}>
                                                                <Printer className="w-4 h-4 text-muted-foreground" /> Cetak
                                                            </DropdownMenuItem> */}
                                                            <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-3 rounded-lg" onClick={() => handleExportWord(item)}>
                                                                <Download className="w-4 h-4 text-muted-foreground" /> Unduh DOCX
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-3 rounded-lg" onClick={() => handleExportPDF(item)}>
                                                                <Download className="w-4 h-4 text-muted-foreground" /> Unduh PDF
                                                            </DropdownMenuItem>
                                                            <div className="h-px bg-border my-1" />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer gap-2 py-2 px-3 text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
                                                                onClick={() => setDeleteId(item.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card List */}
                        <div className="md:hidden space-y-4">
                            {filteredHistory.map((item) => (
                                <Card key={item.id} className="border-none shadow-soft overflow-hidden rounded-2xl group active:scale-[0.98] transition-transform">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full">
                                                Kelas {item.kelas}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
                                                {new Date(item.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-foreground text-lg mb-1 group-active:text-primary transition-colors line-clamp-2">{item.topik}</h4>
                                        <p className="text-xs text-muted-foreground mb-5">{item.mapel}</p>
                                        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                                Selesai
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="hero-outline" onClick={() => setSelectedRPP(item)} className="h-9 px-4 rounded-xl text-xs">
                                                    Lihat
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl bg-muted/30">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl border-border">
                                                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleExportWord(item)}>
                                                            <Download className="w-4 h-4" /> Unduh DOCX
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleExportPDF(item)}>
                                                            <Download className="w-4 h-4" /> Unduh PDF
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={() => setDeleteId(item.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="relative mb-8 group">
                            <div className="w-40 h-40 bg-primary/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                <FileText className="w-20 h-20 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                            </div>
                            <Search className="absolute bottom-2 right-2 w-10 h-10 text-primary animate-float-delayed p-2 bg-card rounded-2xl shadow-medium" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">Belum ada Riwayat RPP</h3>
                        <p className="text-muted-foreground text-center max-w-sm mb-8 leading-relaxed">
                            Sepertinya Anda belum membuat RPP bantuan AI. Mulai buat RPP pertama Anda sekarang!
                        </p>
                        <Button variant="hero" size="lg" className="rounded-2xl px-8 shadow-glow-primary" asChild>
                            <Link href="/buat-rpp">
                                <Plus className="w-5 h-5 mr-2" />
                                Mulai Buat RPP
                            </Link>
                        </Button>
                    </div>
                )}

                {/* PAGINATION (Mockup) */}
                {filteredHistory.length > 0 && (
                    <div className="mt-12 flex items-center justify-between border-t border-border pt-6 animate-fade-in-up">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-bold text-foreground">{filteredHistory.length}</span> dari <span className="font-bold text-foreground">{totalDocs}</span> RPP
                        </p>
                        <div className="flex gap-2">
                            <Button variant="hero-outline" size="sm" disabled className="rounded-xl px-4 opacity-50">Sebelumnya</Button>
                            <Button variant="hero" size="sm" className="rounded-xl px-4">Selanjutnya</Button>
                        </div>
                    </div>
                )}

                {/* PREVIEW MODAL */}
                <Dialog open={!!selectedRPP} onOpenChange={() => setSelectedRPP(null)}>
                    <DialogContent className="w-full max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-[2rem] border-none shadow-strong">
                        <div className="flex flex-col h-[90vh]">
                            <div className="p-6 md:p-8 bg-muted/30 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-hero">
                                <div className="space-y-2 w-full md:w-auto flex-1 min-w-0">
                                    <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight break-words whitespace-normal">{selectedRPP?.topik}</DialogTitle>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1.5 bg-card px-2.5 py-0.5 rounded-full border border-border shadow-sm">
                                            {selectedRPP?.mapel}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-card px-2.5 py-0.5 rounded-full border border-border shadow-sm">
                                            Kelas {selectedRPP?.kelas}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                    {/* <Button
                                        variant="hero-outline"
                                        size="sm"
                                        onClick={() => window.print()}
                                        className="rounded-xl border-border bg-card shadow-soft h-10 px-5"
                                    >
                                        <Printer className="w-4 h-4 mr-2" /> Cetak
                                    </Button> */}
                                    <Button
                                        variant="hero-outline"
                                        size="sm"
                                        onClick={() => handleExportWord(selectedRPP)}
                                        className="rounded-xl border-border bg-card shadow-soft h-10 px-5"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Word
                                    </Button>
                                    <Button
                                        variant="hero"
                                        size="sm"
                                        onClick={() => handleExportPDF(selectedRPP)}
                                        className="rounded-xl h-10 px-6"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Unduh PDF
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-4 md:p-12 bg-white selection:bg-primary/10 w-full">
                                <div className="max-w-[720px] mx-auto prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:font-extrabold prose-headings:text-foreground prose-p:text-slate-700 prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-blue-50/50 prose-blockquote:p-4 prose-blockquote:rounded-xl prose-table:border prose-table:border-border prose-th:bg-muted/50 break-words [overflow-wrap:anywhere]">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto w-full my-4 border rounded-lg">
                                                    <table {...props} className="w-full" />
                                                </div>
                                            )
                                        }}
                                    >
                                        {selectedRPP?.content_markdown}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* DELETE CONFIRMATION MODAL */}
                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent className="rounded-[2rem] border-none shadow-strong p-8">
                        <AlertDialogHeader className="space-y-4">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2 animate-bounce">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-bold text-center">Hapus Riwayat RPP?</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-muted-foreground leading-relaxed">
                                Apakah Anda yakin ingin menghapus RPP ini? Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara permanen dari server kami.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8 gap-3 sm:justify-center">
                            <AlertDialogCancel className="rounded-2xl h-12 px-8 border-border bg-muted/30 hover:bg-muted transition-colors sm:mt-0">
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && handleDelete(deleteId)}
                                className="rounded-2xl h-12 px-8 bg-red-600 hover:bg-red-700 text-white shadow-soft transition-all"
                            >
                                Ya, Hapus Sekarang
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
}
