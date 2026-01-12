"use client";

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
    Trash2,
    Eye,
    Download,
    Search,
    CheckCircle2,
    FileQuestion,
    Filter,
    RotateCcw,
    Calendar,
    MoreVertical,
    Plus,
    Loader2,
    BarChart3,
    Clock
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
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function QuizHistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterMapel, setFilterMapel] = useState("Semua");
    const [filterDifficulty, setFilterDifficulty] = useState("Semua");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get("/api/rpp/quiz-history");
            setHistory(res.data);
        } catch (e) {
            console.error(e);
            toast.error("Gagal mengambil riwayat kuis");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/rpp/quiz-history/${id}`);
            setHistory(history.filter((item) => item.id !== id));
            toast.success("Kuis berhasil dihapus");
        } catch (e) {
            toast.error("Gagal menghapus kuis");
        } finally {
            setDeleteId(null);
        }
    };

    const handleExportWord = async (item: any) => {
        try {
            const response = await api.post("/api/rpp/export-quiz-word", {
                quiz_data: item.quiz_data,
                mapel: item.mapel,
                topik: item.topik
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Quiz_${item.topik}.docx`.replace(/\s+/g, '_'));
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            toast.error("Gagal mendownload file Word");
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilterMapel("Semua");
        setFilterDifficulty("Semua");
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.topik.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.mapel.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMapel = filterMapel === "Semua" || item.mapel === filterMapel;
        const matchesDifficulty = filterDifficulty === "Semua" || item.tingkat_kesulitan === filterDifficulty;
        return matchesSearch && matchesMapel && matchesDifficulty;
    });

    // Extract unique values for filters
    const uniqueMapels = Array.from(new Set(history.map(item => item.mapel)));
    const uniqueDifficulty = Array.from(new Set(history.map(item => item.tingkat_kesulitan)));

    // Statistics
    const totalQuizzes = history.length;
    const totalQuestions = history.reduce((acc, curr) => acc + (curr.quiz_data?.questions?.length || 0), 0);
    const lastUpdate = history.length > 0
        ? new Date(Math.max(...history.map(item => new Date(item.created_at).getTime()))).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })
        : "-";

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] mt-16">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground font-medium animate-pulse">Memuat riwayat soal Anda...</p>
                </div>
            </div>
        );
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
                                Riwayat <span className="text-gradient-secondary">Soal</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Review, kelola, dan unduh kembali kumpulan latihan soal bantuan AI untuk berbagai mata pelajaran.
                            </p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="hero" className="rounded-2xl gradient-secondary shadow-glow-secondary">
                                <Plus className="w-5 h-5 mr-2" />
                                Buat Soal Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                                <FileQuestion className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Kuis</p>
                                <h3 className="text-3xl font-bold text-foreground mt-1">{totalQuizzes}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-500">
                                <BarChart3 className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Pertanyaan</p>
                                <h3 className="text-3xl font-bold text-foreground mt-1">{totalQuestions}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground group-hover:scale-110 transition-transform duration-500">
                                <Clock className="w-7 h-7" />
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
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan topik atau mata pelajaran..."
                                    className="w-full pl-12 pr-4 py-3 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-2xl border border-border/50">
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
                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-2xl border border-border/50">
                                    <select
                                        className="bg-transparent border-none focus:ring-0 text-sm font-medium text-foreground cursor-pointer outline-none"
                                        value={filterDifficulty}
                                        onChange={(e) => setFilterDifficulty(e.target.value)}
                                    >
                                        <option value="Semua">Semua Tingkat</option>
                                        {uniqueDifficulty.map(d => <option key={d} value={d}>{d}</option>)}
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
                                        <TableHead className="font-bold text-foreground py-5">Pertanyaan</TableHead>
                                        <TableHead className="font-bold text-foreground py-5">Kesulitan</TableHead>
                                        <TableHead className="font-bold text-foreground py-5">Tanggal</TableHead>
                                        <TableHead className="font-bold text-foreground py-5 text-right pr-8">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHistory.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-muted/20 transition-colors border-b border-border group">
                                            <TableCell className="py-5 pl-8">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground group-hover:text-secondary transition-colors">{item.topik}</span>
                                                    <span className="text-xs text-muted-foreground mt-0.5">{item.mapel}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                                                    <div className="px-2 py-0.5 bg-secondary/5 text-secondary border border-secondary/20 rounded-lg text-xs">
                                                        {item.quiz_data?.questions?.length || 0} Soal
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold shadow-sm",
                                                    item.tingkat_kesulitan === "Mudah" ? "bg-green-50 text-green-700 border border-green-100" :
                                                        item.tingkat_kesulitan === "Sedang" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                                            "bg-orange-50 text-orange-700 border border-orange-100"
                                                )}>
                                                    {item.tingkat_kesulitan}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-5 text-sm text-muted-foreground whitespace-nowrap">
                                                {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </TableCell>
                                            <TableCell className="py-5 text-right pr-8">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="hero-outline"
                                                        size="sm"
                                                        onClick={() => setSelectedQuiz(item)}
                                                        className="h-9 w-9 p-0 rounded-xl hover:border-secondary hover:text-secondary"
                                                        title="Lihat Soal"
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
                                                            <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-3 rounded-lg" onClick={() => handleExportWord(item)}>
                                                                <Download className="w-4 h-4 text-muted-foreground" /> Unduh DOCX
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-3 rounded-lg">
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
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold",
                                                item.tingkat_kesulitan === "Mudah" ? "bg-green-50 text-green-700" :
                                                    item.tingkat_kesulitan === "Sedang" ? "bg-blue-50 text-blue-700" :
                                                        "bg-orange-50 text-orange-700"
                                            )}>
                                                {item.tingkat_kesulitan}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-medium">
                                                {new Date(item.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-foreground text-lg mb-1 group-active:text-secondary transition-colors line-clamp-2">{item.topik}</h4>
                                        <p className="text-xs text-muted-foreground mb-4">{item.mapel}</p>
                                        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                                            <div className="px-2 py-0.5 bg-secondary/5 text-secondary border border-secondary/20 rounded-lg text-[10px] font-bold">
                                                {item.quiz_data?.questions?.length || 0} Pertanyaan
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="hero-outline" onClick={() => setSelectedQuiz(item)} className="h-9 px-4 rounded-xl text-xs hover:border-secondary hover:text-secondary">
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
                                                            <Download className="w-4 h-4" /> Unduh
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
                            <div className="w-40 h-40 bg-secondary/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                <FileQuestion className="w-20 h-20 text-secondary opacity-20 group-hover:opacity-40 transition-opacity" />
                            </div>
                            <Search className="absolute bottom-2 right-2 w-10 h-10 text-secondary animate-float-delayed p-2 bg-card rounded-2xl shadow-medium" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">Belum ada Riwayat Soal</h3>
                        <p className="text-muted-foreground text-center max-w-sm mb-8 leading-relaxed">
                            Mulai buat kumpulan latihan soal berkualitas tinggi untuk siswa Anda dengan AI sekarang juga!
                        </p>
                        <Link href="/dashboard">
                            <Button variant="hero" size="lg" className="rounded-2xl px-8 gradient-secondary shadow-glow-secondary">
                                <Plus className="w-5 h-5 mr-2" />
                                Buat Soal Pertama
                            </Button>
                        </Link>
                    </div>
                )}

                {/* PAGINATION (Mockup) */}
                {filteredHistory.length > 0 && (
                    <div className="mt-12 flex items-center justify-between border-t border-border pt-6 animate-fade-in-up">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-bold text-foreground">{filteredHistory.length}</span> dari <span className="font-bold text-foreground">{totalQuizzes}</span> Kuis
                        </p>
                        <div className="flex gap-2">
                            <Button variant="hero-outline" size="sm" disabled className="rounded-xl px-4 opacity-50">Sebelumnya</Button>
                            <Button variant="hero" size="sm" className="rounded-xl px-4 gradient-secondary">Selanjutnya</Button>
                        </div>
                    </div>
                )}

                {/* PREVIEW MODAL */}
                <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                    <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0 rounded-[2rem] border-none shadow-strong">
                        <div className="flex flex-col h-[95vh]">
                            <div className="p-8 bg-muted/30 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-hero">
                                <div className="space-y-1">
                                    <DialogTitle className="text-3xl font-extrabold text-foreground leading-tight">{selectedQuiz?.topik}</DialogTitle>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1.5 bg-card px-2.5 py-0.5 rounded-full border border-border shadow-sm">
                                            {selectedQuiz?.mapel}
                                        </span>
                                        <span className={cn(
                                            "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border shadow-sm",
                                            selectedQuiz?.tingkat_kesulitan === "Mudah" ? "bg-green-50 text-green-700 border-green-100" :
                                                selectedQuiz?.tingkat_kesulitan === "Sedang" ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                    "bg-orange-50 text-orange-700 border-orange-100"
                                        )}>
                                            {selectedQuiz?.tingkat_kesulitan}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-secondary/5 text-secondary border border-secondary/20 px-2.5 py-0.5 rounded-full">
                                            {selectedQuiz?.quiz_data?.questions?.length || 0} Pertanyaan
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="hero-outline"
                                        size="sm"
                                        onClick={() => handleExportWord(selectedQuiz)}
                                        className="rounded-xl border-border bg-card shadow-soft h-12 px-6 flex-1 md:flex-none"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Word
                                    </Button>
                                    <Button
                                        variant="hero"
                                        size="sm"
                                        className="rounded-xl h-12 px-8 gradient-secondary shadow-glow-secondary flex-1 md:flex-none"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> PDF
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-6 md:p-10 bg-slate-50/30">
                                <div className="max-w-[800px] mx-auto space-y-8 pb-10">
                                    {selectedQuiz?.quiz_data.questions.map((q: any, idx: number) => (
                                        <div key={idx} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                            <div className="flex gap-5">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-2xl gradient-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg shadow-glow-secondary">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 space-y-6">
                                                    <h4 className="text-xl font-bold text-foreground leading-relaxed">{q.pertanyaan}</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {Object.entries(q.options).map(([key, val]: [string, any]) => (
                                                            <div key={key} className={cn(
                                                                "p-5 border-2 rounded-2xl flex gap-4 transition-all duration-300 group/option relative overflow-hidden",
                                                                q.kunci_jawaban === key
                                                                    ? "border-green-500/30 bg-green-50 text-green-900 ring-4 ring-green-100/50"
                                                                    : "border-border bg-card text-muted-foreground hover:border-secondary/30 hover:bg-secondary/5"
                                                            )}>
                                                                <span className={cn(
                                                                    "w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl font-bold text-sm transition-colors",
                                                                    q.kunci_jawaban === key ? "bg-green-600 text-white" : "bg-muted text-muted-foreground group-hover/option:bg-secondary group-hover/option:text-white"
                                                                )}>
                                                                    {key}
                                                                </span>
                                                                <span className="flex-1 font-medium">{val}</span>
                                                                {q.kunci_jawaban === key && (
                                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                                        <CheckCircle2 className="w-6 h-6 text-green-600 animate-in zoom-in duration-300" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {q.penjelasan && (
                                                        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl relative overflow-hidden group/penjelasan">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                                                            <h5 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                                                                <BarChart3 className="w-4 h-4" /> Penjelasan
                                                            </h5>
                                                            <p className="text-blue-800 text-sm leading-relaxed italic line-clamp-3 group-hover/penjelasan:line-clamp-none transition-all duration-500">
                                                                {q.penjelasan}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                            <AlertDialogTitle className="text-2xl font-bold text-center">Hapus Riwayat Soal?</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-muted-foreground leading-relaxed">
                                Apakah Anda yakin ingin menghapus kumpulan soal ini? Tindakan ini tidak dapat dibatalkan dan semua data pertanyaan akan hilang.
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
