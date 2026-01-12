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
import { Card, CardContent } from "@/components/ui/card";
import {
    Trash2,
    Eye,
    Download,
    Search,
    CheckCircle2,
    FileQuestion
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
import { cn } from "@/lib/utils";

import Navbar from "@/components/Navbar";

export default function QuizHistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

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
        if (!confirm("Apakah Anda yakin ingin menghapus kuis ini?")) return;
        try {
            await api.delete(`/api/rpp/quiz-history/${id}`);
            setHistory(history.filter((item) => item.id !== id));
            toast.success("Kuis berhasil dihapus");
        } catch (e) {
            toast.error("Gagal menghapus kuis");
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

    const filteredHistory = history.filter(item =>
        item.topik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mapel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)] mt-16">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        <p className="text-slate-500 font-medium">Memuat riwayat soal...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-12">
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-purple-600 shadow-lg shadow-purple-200">
                                <FileQuestion className="w-6 h-6 text-white" />
                            </div>
                            Riwayat Latihan Soal
                        </h1>
                        <p className="text-slate-500 mt-1 ml-12">Review dan download kembali soal kuis yang telah dibuat.</p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan topik atau mapel..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* TABLE CARD */}
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-700 py-4 h-auto pl-6">Tanggal</TableHead>
                                        <TableHead className="font-bold text-slate-700 py-4 h-auto">Mata Pelajaran</TableHead>
                                        <TableHead className="font-bold text-slate-700 py-4 h-auto">Topik</TableHead>
                                        <TableHead className="font-bold text-slate-700 py-4 h-auto">Kesulitan</TableHead>
                                        <TableHead className="font-bold text-slate-700 py-4 h-auto text-right pr-6">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHistory.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-purple-50/30 transition-colors group">
                                            <TableCell className="text-slate-500 py-4 pl-6">
                                                {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {item.mapel}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-900">{item.topik}</TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold",
                                                    item.tingkat_kesulitan === "Mudah" ? "bg-green-100 text-green-700" :
                                                        item.tingkat_kesulitan === "Sedang" ? "bg-blue-100 text-blue-700" :
                                                            "bg-orange-100 text-orange-700"
                                                )}>
                                                    {item.tingkat_kesulitan}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right py-4 pr-6">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedQuiz(item)}
                                                        className="h-8 w-8 p-0 rounded-full text-slate-600 hover:text-purple-600 hover:bg-purple-50"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleExportWord(item)}
                                                        className="h-8 w-8 p-0 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredHistory.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-20">
                                                <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                        <Search className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <p className="font-medium text-slate-500">Tidak ada riwayat soal yang ditemukan.</p>
                                                    <p className="text-sm">Mulailah membuat kuis melalui dashboard Anda!</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* PREVIEW MODAL */}
                <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-3xl border-none shadow-2xl">
                        <div className="flex flex-col h-[90vh]">
                            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-slate-900">{selectedQuiz?.topik}</DialogTitle>
                                    <DialogDescription className="text-slate-500 font-medium">
                                        {selectedQuiz?.mapel} • Kesulitan {selectedQuiz?.tingkat_kesulitan}
                                    </DialogDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExportWord(selectedQuiz)}
                                    className="rounded-xl border-slate-200 text-slate-600"
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download Word
                                </Button>
                            </div>
                            <div className="flex-1 overflow-auto p-8 bg-white space-y-8">
                                {selectedQuiz?.quiz_data.questions.map((q: any, idx: number) => (
                                    <div key={idx} className="p-6 border border-slate-100 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-200">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-lg font-bold text-slate-900 mb-4 leading-relaxed">{q.pertanyaan}</p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {Object.entries(q.options).map(([key, val]: [string, any]) => (
                                                        <div key={key} className={cn(
                                                            "p-4 border rounded-2xl flex gap-3 transition-all",
                                                            q.kunci_jawaban === key
                                                                ? "bg-green-50 border-green-200 text-green-900 ring-1 ring-green-100 shadow-sm"
                                                                : "bg-white border-slate-100 text-slate-600 shadow-sm shadow-slate-100/50"
                                                        )}>
                                                            <span className={cn(
                                                                "w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-lg font-bold text-xs",
                                                                q.kunci_jawaban === key ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"
                                                            )}>
                                                                {key}
                                                            </span>
                                                            <span className="flex-1">{val}</span>
                                                            {q.kunci_jawaban === key && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border-l-4 border-blue-500 backdrop-blur-sm">
                                                    <p className="font-bold text-blue-900 flex items-center gap-2 mb-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        Penjelasan:
                                                    </p>
                                                    <p className="text-blue-800 text-sm leading-relaxed italic">{q.penjelasan}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}

const Loader2 = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
