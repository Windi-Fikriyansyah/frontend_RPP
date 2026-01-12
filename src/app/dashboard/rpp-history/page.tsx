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
    FileText,
    Trash2,
    Eye,
    Download,
    Search,
    BookOpen,
    Printer
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

import Navbar from "@/components/Navbar";

export default function RPPHistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRPP, setSelectedRPP] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

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
        if (!confirm("Apakah Anda yakin ingin menghapus RPP ini?")) return;
        try {
            await api.delete(`/api/rpp/history/${id}`);
            setHistory(history.filter((item) => item.id !== id));
            toast.success("RPP berhasil dihapus");
        } catch (e) {
            toast.error("Gagal menghapus RPP");
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
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-slate-500 font-medium">Memuat riwayat RPP...</p>
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
                            <div className="p-2 rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            Riwayat Modul Ajar (RPP)
                        </h1>
                        <p className="text-slate-500 mt-1 ml-12">Kelola dan lihat kembali modul ajar yang telah Anda buat.</p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan topik atau mapel..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                                        <TableHead className="font-bold text-slate-700 py-4 h-auto">Kelas</TableHead>
                                        <TableHead className="font-bold text-slate-700 py-4 h-auto">Topik</TableHead>
                                        <TableHead className="font-bold text-slate-700 py-4 h-auto text-right pr-6">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHistory.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <TableCell className="text-slate-500 py-4 pl-6">
                                                {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {item.mapel}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-600">{item.kelas}</TableCell>
                                            <TableCell className="font-medium text-slate-900">{item.topik}</TableCell>
                                            <TableCell className="text-right py-4 pr-6">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedRPP(item)}
                                                        className="h-8 w-8 p-0 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Eye className="w-4 h-4" />
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
                                                    <p className="font-medium text-slate-500">Tidak ada riwayat RPP yang ditemukan.</p>
                                                    <p className="text-sm">Mulailah membuat RPP di dashboard Anda!</p>
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
                <Dialog open={!!selectedRPP} onOpenChange={() => setSelectedRPP(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-3xl border-none shadow-2xl">
                        <div className="flex flex-col h-[90vh]">
                            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-slate-900">{selectedRPP?.topik}</DialogTitle>
                                    <DialogDescription className="text-slate-500 font-medium">
                                        {selectedRPP?.mapel} • Kelas {selectedRPP?.kelas}
                                    </DialogDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.print()}
                                    className="rounded-xl border-slate-200 text-slate-600"
                                >
                                    <Printer className="w-4 h-4 mr-2" /> Cetak
                                </Button>
                            </div>
                            <div className="flex-1 overflow-auto p-8 bg-white">
                                <div className="max-w-[800px] mx-auto prose prose-sm md:prose-base prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-800 prose-strong:text-slate-950 prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedRPP?.content_markdown}</ReactMarkdown>
                                </div>
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
