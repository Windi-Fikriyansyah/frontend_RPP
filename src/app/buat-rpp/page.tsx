"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, ChevronsUpDown, Copy, Loader2, Printer, Save, FileText, Download, Presentation, FileQuestion, Eye, EyeOff } from "lucide-react"; // Icons for Save/Export
import LoadingScreen from "@/components/LoadingScreen";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { toast } from "sonner"; // Toast
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Markdown Render
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type User = {
    id: number;
    email: string;
    full_name: string;
    subscription_plan?: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // RPP State
    const [generating, setGenerating] = useState(false);
    const [generatingPPT, setGeneratingPPT] = useState(false);
    const [generatingQuiz, setGeneratingQuiz] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    // PPT State
    const [showPPTModal, setShowPPTModal] = useState(false);

    const [pptTemplate, setPptTemplate] = useState("Ceria");

    // UI State
    const [activeTab, setActiveTab] = useState<"form" | "result">("form");

    const [quizResult, setQuizResult] = useState<any | null>(null);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [quizConfig, setQuizConfig] = useState({
        jumlah_soal: 5,
        tingkat_kesulitan: "Sedang"
    });
    const [formData, setFormData] = useState({
        // Identitas
        nama_guru: "",
        nama_sekolah: "",
        jenjang: "SD",
        kelas: "4",
        mapel: "Matematika",
        fase: "B",
        elemen: "", // Default empty
        alokasi_waktu: "2 x 35 menit",

        // Parameter
        topik: "",
        tujuan_pembelajaran: "",
        model_pembelajaran: "Problem Based Learning",
        profil_pelajar_pancasila_list: ["Mandiri", "Bernalar Kritis"],
        metode_pembelajaran: ["Diskusi", "Tanya Jawab"], // NEW state

        // Diferensiasi
        kemampuan_siswa: "Rata-rata",
        sarana_prasarana: "Terbatas",

        // Hidden/Auto
        media: "PPT, LKPD", // Default fallback or unused
        penilaian: "Formatif, Sumatif"
    });

    // Curriculum State
    const [subjects, setSubjects] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
    const [openMapel, setOpenMapel] = useState(false); // Combobox state

    // 1. Check Auth & Load Subjects
    useEffect(() => {
        // Auth
        api.get("/auth/me")
            .then((res) => {
                setUser(res.data);
                setFormData(prev => ({ ...prev, nama_guru: res.data.full_name || "" }));
                setLoadingAuth(false);
            })
            .catch(() => router.push("/login"));

        // Load Subjects
        fetchSubjects();
    }, [router]);

    const fetchSubjects = async () => {
        try {
            const res = await api.get("/api/curriculum/subjects");
            // If empty, try to seed automatically for UX
            if (res.data.length === 0) {
                await api.post("/api/curriculum/seed");
                const res2 = await api.get("/api/curriculum/subjects");
                setSubjects(res2.data);
            } else {
                setSubjects(res.data);
            }
        } catch (e) {
            console.error("Failed loading subjects", e);
        }
    };

    // Load Goals when Subject or Phase changes
    useEffect(() => {
        if (selectedSubjectId && formData.fase) {
            api.get("/api/curriculum/goals", {
                params: { subject_id: selectedSubjectId, phase: formData.fase }
            }).then(res => setGoals(res.data))
                .catch(e => console.error(e));
        } else {
            setGoals([]);
        }
    }, [selectedSubjectId, formData.fase]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleKelasChange = (value: string) => {
        let fase = "A";
        const k = parseInt(value);
        if (k >= 1 && k <= 2) fase = "A";
        else if (k >= 3 && k <= 4) fase = "B";
        else if (k >= 5 && k <= 6) fase = "C";
        else if (k >= 7 && k <= 9) fase = "D";
        else if (k === 10) fase = "E";
        else if (k >= 11 && k <= 12) fase = "F";

        setFormData(prev => ({ ...prev, kelas: value, fase: fase }));
    };

    const handleSelectChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    }

    const handleSubjectChange = (subjectId: string) => {
        setSelectedSubjectId(subjectId);
        const subj = subjects.find(s => s.id.toString() === subjectId);
        if (subj) {
            setFormData(prev => ({ ...prev, mapel: subj.name }));
        }
    };

    const handleElementChange = (goalId: string) => {
        const goal = goals.find(g => g.id.toString() === goalId);
        if (goal) {
            setFormData(prev => ({
                ...prev,
                elemen: goal.element,
                // Optional: Auto-fill TP with CP snippet if simple, or keep magic logic
                // For now, prompt uses Elemen to finding CP.
            }));
        }
    };


    const handleLogout = async () => {
        await api.post("/auth/logout");
        router.push("/login");
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);

        const payload = {
            ...formData,
            // Convert list to backend expected list of strings
            profil_pelajar_pancasila: formData.profil_pelajar_pancasila_list,
            media: formData.media.split(",").map(s => s.trim()),
            penilaian: formData.penilaian.split(",").map(s => s.trim()),
            elemen: formData.elemen, // Add elemen to payload
        };

        try {
            const res = await api.post("/api/rpp/generate", payload);
            setResult(res.data.data.rpp_markdown);
            setActiveTab("result"); // Auto switch to result tab
        } catch (err: any) {
            if (err.response?.status === 403) {
                toast.error("Kuota Habis", {
                    description: err.response.data.detail || "Kuota generate gratis Anda telah habis. Silakan upgrade paket.",
                    duration: 5000,
                    action: {
                        label: "Upgrade",
                        onClick: () => router.push("/harga")
                    }
                });
            } else {
                toast.error("Gagal generate RPP. Pastikan backend aktif.");
            }
        } finally {
            setGenerating(false);
        }
    };

    // --- BUTTON HANDLERS ---

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            toast.success("Berhasil menyalin RPP ke Clipboard!", {
                description: "Siap dipaste ke Word atau Docs.",
                duration: 3000,
            });
        }
    };

    const handleSave = async () => {
        if (!result) return;
        try {
            await api.post("/api/rpp/save", {
                mapel: formData.mapel,
                kelas: formData.kelas,
                topik: formData.topik,
                content_markdown: result,
                input_data: formData // Send all inputs
            });
            toast.success("Data RPP Berhasil Disimpan!", {
                description: "Data Berhasil Disimpan.",
            });
        } catch (e) {
            toast.error("Gagal menyimpan RPP.");
        }
    };

    const handleExportWord = async () => {
        if (!result) return;
        try {
            const response = await api.post("/api/rpp/export-word", {
                content_markdown: result,
                mapel: formData.mapel,
                topik: formData.topik,
                kelas: formData.kelas || "Semua"
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `RPP_${formData.topik}.docx`.replace(/\s+/g, '_'));
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("File Word berhasil diunduh");
        } catch (e) {
            toast.error("Gagal mendownload file Word");
        }
    };

    // PDF is handled by window.print for now (cleanest native solution without massive libs)
    const handleExportPDF = async () => {
        if (!result) return;
        try {
            const response = await api.post("/api/rpp/export-pdf", {
                content_markdown: result,
                mapel: formData.mapel,
                topik: formData.topik,
                kelas: formData.kelas || "Semua"
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `RPP_${formData.topik}.pdf`.replace(/\s+/g, '_'));
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("File PDF berhasil diunduh");
        } catch (e) {
            toast.error("Gagal mendownload file PDF");
        }
    };

    const handleGeneratePPT = () => {
        if (!result) return;

        if (user?.subscription_plan !== "pro" && user?.subscription_plan !== "school") {
            toast.error("Fitur Premium", {
                description: "Upgrade ke paket Pro untuk membuat slide presentasi otomatis!",
                action: {
                    label: "Upgrade",
                    onClick: () => router.push("/harga")
                }
            });
            return;
        }
        setShowPPTModal(true);
    };

    const executeGeneratePPT = async () => {
        if (!result) return;

        setShowPPTModal(false);
        setGeneratingPPT(true);
        try {
            const response = await api.post("/api/rpp/generate-ppt", {
                rpp_content: result,
                mapel: formData.mapel,
                topik: formData.topik,
                template: pptTemplate
            }, {
                responseType: 'blob'
            });

            // If response is a blob but actually contains a JSON error (can happen with FastAPI)
            if (response.data.type === "application/json") {
                const reader = new FileReader();
                reader.onload = () => {
                    const errData = JSON.parse(reader.result as string);
                    toast.error("Gagal generate PPT", { description: errData.detail || "Terjadi kesalahan server." });
                };
                reader.readAsText(response.data);
                setGeneratingPPT(false);
                return;
            }

            // Create a link to download the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = `PPT_${formData.mapel}_${formData.topik}.pptx`.replace(/\s+/g, '_');
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("PPT Berhasil Digenerate!");
        } catch (e: any) {
            console.error("PPT Error:", e);
            if (e.response?.status === 403) {
                toast.error("Fitur Pro", {
                    description: "Silakan upgrade ke paket Pro untuk menggunakan fitur ini."
                });
            } else {
                toast.error("Gagal generate PPT. Silakan coba lagi.");
            }
        } finally {
            setGeneratingPPT(false);
        }
    };

    const handleGenerateQuiz = async () => {
        if (!result) return;
        setGeneratingQuiz(true);
        try {
            const payload = {
                rpp_content: result,
                mapel: formData.mapel,
                topik: formData.topik,
                jumlah_soal: quizConfig.jumlah_soal,
                tingkat_kesulitan: quizConfig.tingkat_kesulitan
            };

            const res = await api.post("/api/rpp/generate-quiz", payload);
            const quizData = res.data.data;
            setQuizResult(quizData);
            setShowQuizModal(false);
            toast.success("Soal Berhasil Dibuat dan Tersimpan!");

            // Automatic Download (Word Only)
            setTimeout(() => {
                handleExportQuizWord(quizData);
            }, 500);

        } catch (e: any) {
            console.error("Quiz Error:", e);
            toast.error("Gagal generate soal. Silakan coba lagi.");
        } finally {
            setGeneratingQuiz(false);
        }
    };

    const handleExportQuizWord = async (data: any) => {
        try {
            const response = await api.post("/api/rpp/export-quiz-word", {
                quiz_data: data,
                mapel: formData.mapel,
                topik: formData.topik
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Quiz_${formData.topik}.docx`.replace(/\s+/g, '_'));
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error("Word Export Error:", e);
        }
    };

    if (loadingAuth) return <LoadingScreen message="Menyiapkan dashboard..." />;

    return (
        <div className="min-h-screen bg-gray-50 pb-10 print:bg-white print:pb-0">
            {/* Navbar - Reuse Component, Hide on Print */}
            <div className="print:hidden">
                <Navbar />
            </div>

            {/* Spacer for fixed navbar */}
            <div className="h-20 print:hidden"></div>

            <main className="container mx-auto px-4 py-8 max-w-6xl print:p-0 print:max-w-none">

                {/* Mobile Tabs Switcher */}
                <div className="lg:hidden mb-6">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "result")}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="form">📝 Input Form</TabsTrigger>
                            <TabsTrigger value="result" disabled={!result && !generating}>📄 Hasil RPP</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">

                    {/* INPUT FORM - Hide on Print */}
                    <div className={cn("space-y-6 print:hidden h-full", activeTab === "form" ? "block" : "hidden lg:block")}>
                        <Card className="h-auto lg:h-full overflow-y-auto relative">
                            <CardHeader>
                                <div className="flex flex-col gap-2 items-start mb-2">
                                    {user?.subscription_plan && (
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                                            user.subscription_plan === "pro" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" :
                                                user.subscription_plan === "school" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" :
                                                    "bg-gray-100 text-gray-500 border border-gray-200"
                                        )}>
                                            {user.subscription_plan === "pro" ? "✨ PRO PLAN" :
                                                user.subscription_plan === "school" ? "🏫 SCHOOL PLAN" :
                                                    "FREE PLAN"}
                                        </div>
                                    )}
                                    <CardTitle>Generator RPP Kurikulum Merdeka</CardTitle>
                                </div>
                                <CardDescription>Lengkapi data berikut untuk membuat modul ajar yang sesuai.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleGenerate} className="space-y-8">

                                    {/* 1. BAGIAN IDENTITAS (Header Dokumen) */}
                                    <div className="space-y-4 rounded-lg bg-gray-50 p-4 border border-gray-200">
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
                                            Bagian Identitas (Header)
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="nama_guru">Nama Guru</Label>
                                                <Input id="nama_guru" value={formData.nama_guru} onChange={handleChange} placeholder="Nama Lengkap & Gelar" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="nama_sekolah">Nama Sekolah</Label>
                                                <Input id="nama_sekolah" value={formData.nama_sekolah} onChange={handleChange} placeholder="Nama Instansi" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2 flex flex-col">
                                                <Label>Mata Pelajaran (Cari/Ketik)</Label>
                                                <Popover open={openMapel} onOpenChange={setOpenMapel}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={openMapel}
                                                            className="justify-between bg-white font-normal"
                                                        >
                                                            {formData.mapel
                                                                ? formData.mapel
                                                                : subjects.length > 0 ? "Pilih Mapel..." : "Loading..."}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[300px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Cari mapel..." />
                                                            <CommandList>
                                                                <CommandEmpty>Mapel tidak ditemukan.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {subjects.map((sub) => (
                                                                        <CommandItem
                                                                            key={sub.id}
                                                                            value={sub.name} // Search by Name
                                                                            onSelect={(currentValue) => {
                                                                                // currentValue is usually lowercase from cmdk
                                                                                // We want to set the actual Name or ID. 
                                                                                // Let's find the subject object.
                                                                                const selected = subjects.find(s => s.name.toLowerCase() === currentValue.toLowerCase() || s.name === currentValue);
                                                                                if (selected) {
                                                                                    handleSubjectChange(selected.id.toString());
                                                                                    setOpenMapel(false);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    formData.mapel === sub.name ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {sub.name} ({sub.category})
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-2">
                                                    <Label>Kelas</Label>
                                                    <Select onValueChange={handleKelasChange} value={formData.kelas}>
                                                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                                        <SelectContent className="max-h-[200px]">
                                                            {[...Array(12)].map((_, i) => (
                                                                <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Fase</Label>
                                                    <Input value={formData.fase} readOnly className="bg-gray-100 text-center font-semibold" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="alokasi_waktu">Alokasi Waktu</Label>
                                            <Input id="alokasi_waktu" value={formData.alokasi_waktu} onChange={handleChange} placeholder="Contoh: 2 x 35 Menit" />
                                        </div>
                                    </div>

                                    {/* 2. BAGIAN INTI KURIKULUM (Otak AI) */}
                                    <div className="space-y-4 rounded-lg bg-emerald-50 p-4 border border-emerald-100">
                                        <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold">2</div>
                                            Bagian Inti Kurikulum (Otak AI)
                                        </h3>

                                        <div className="space-y-2">
                                            <Label htmlFor="elemen">Elemen Materi (Sesuai Fase {formData.fase})</Label>
                                            <Select onValueChange={handleElementChange} disabled={goals.length === 0}>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder={goals.length === 0 ? "Pilih Mapel & Kelas Dulu" : "Pilih Elemen CP"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {goals.map((g) => (
                                                        <SelectItem key={g.id} value={g.id.toString()}>
                                                            {g.element}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="topik">Topik / Materi Spesifik</Label>
                                            <Input id="topik" placeholder="Contoh: Penjumlahan Pecahan Senilai" value={formData.topik} onChange={handleChange} required className="bg-white" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tujuan_pembelajaran">Tujuan Pembelajaran (TP)</Label>
                                            <Textarea
                                                id="tujuan_pembelajaran"
                                                placeholder="Bisa dikosongkan agar AI membuatkan TP otomatis berdasarkan CP pemerintah..."
                                                value={formData.tujuan_pembelajaran}
                                                onChange={handleChange}
                                                className="bg-white min-h-[80px]"
                                            />
                                        </div>
                                    </div>

                                    {/* 3. BAGIAN STRATEGI PEMBELAJARAN */}
                                    <div className="space-y-4 rounded-lg bg-orange-50 p-4 border border-orange-100">
                                        <h3 className="font-semibold text-orange-900 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold">3</div>
                                            Strategi Pembelajaran (Kustomisasi)
                                        </h3>

                                        <div className="space-y-2">
                                            <Label>Model Pembelajaran</Label>
                                            <Select onValueChange={(v) => handleSelectChange("model_pembelajaran", v)} value={formData.model_pembelajaran}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="Pilih Model" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Problem Based Learning">Problem Based Learning (PBL)</SelectItem>
                                                    <SelectItem value="Project Based Learning">Project Based Learning (PjBL)</SelectItem>
                                                    <SelectItem value="Discovery Learning">Discovery Learning</SelectItem>
                                                    <SelectItem value="Inquiry Learning">Inquiry Learning</SelectItem>
                                                    <SelectItem value="Ceramah Eksploratif">Ceramah Eksploratif</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="mb-2 block">Profil Pelajar Pancasila (P3)</Label>
                                            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded border">
                                                {["Beriman & Bertakwa", "Berkebinekaan Global", "Gotong Royong", "Mandiri", "Bernalar Kritis", "Kreatif"].map((p3) => (
                                                    <div key={p3} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`p3-${p3}`}
                                                            checked={formData.profil_pelajar_pancasila_list.includes(p3)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setFormData(prev => ({ ...prev, profil_pelajar_pancasila_list: [...prev.profil_pelajar_pancasila_list, p3] }));
                                                                } else {
                                                                    setFormData(prev => ({ ...prev, profil_pelajar_pancasila_list: prev.profil_pelajar_pancasila_list.filter(x => x !== p3) }));
                                                                }
                                                            }}
                                                        />
                                                        <Label htmlFor={`p3-${p3}`} className="text-sm font-normal cursor-pointer">{p3}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="mb-2 block">Metode Pembelajaran</Label>
                                            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded border">
                                                {["Diskusi", "Tanya Jawab", "Penugasan", "Demonstrasi", "Presentasi", "Eksperimen"].map((m) => (
                                                    <div key={m} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`met-${m}`}
                                                            checked={formData.metode_pembelajaran.includes(m)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setFormData(prev => ({ ...prev, metode_pembelajaran: [...prev.metode_pembelajaran, m] }));
                                                                } else {
                                                                    setFormData(prev => ({ ...prev, metode_pembelajaran: prev.metode_pembelajaran.filter(x => x !== m) }));
                                                                }
                                                            }}
                                                        />
                                                        <Label htmlFor={`met-${m}`} className="text-sm font-normal cursor-pointer">{m}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. BAGIAN KONDISI KELAS (Fitur Spesial) */}
                                    <div className="space-y-4 rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                                        <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold">4</div>
                                            Kondisi Kelas (Diferensiasi)
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Kemampuan Siswa</Label>
                                                <Select onValueChange={(v) => handleSelectChange("kemampuan_siswa", v)} value={formData.kemampuan_siswa}>
                                                    <SelectTrigger className="bg-white"><SelectValue placeholder="Pilih Kondisi" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Rata-rata">Rata-rata (Reguler)</SelectItem>
                                                        <SelectItem value="Heterogen">Heterogen (Campuran)</SelectItem>
                                                        <SelectItem value="Perlu Bimbingan">Perlu Bimbingan (Slow)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Sarana & Prasarana</Label>
                                                <Select onValueChange={(v) => handleSelectChange("sarana_prasarana", v)} value={formData.sarana_prasarana}>
                                                    <SelectTrigger className="bg-white"><SelectValue placeholder="Pilih Sarana" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Digital Lengkap">Digital Lengkap (Proyektor & WiFi)</SelectItem>
                                                        <SelectItem value="Terbatas">Terbatas (Hanya Buku Paket)</SelectItem>
                                                        <SelectItem value="Luar Ruangan">Luar Ruangan (Outdoor)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="media">Media Pembelajaran</Label>
                                            <Input id="media" placeholder="Contoh: Laptop, Proyektor, Kartu Angka" value={formData.media} onChange={handleChange} className="bg-white" />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-14 text-lg shadow-xl uppercase tracking-wide" disabled={generating}>
                                        {generating ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generate RPP Sekarang</>
                                        ) : (
                                            "🚀 Generate RPP Sekarang"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RESULT VIEW */}
                    <div className={cn("space-y-6", activeTab === "result" ? "block" : "hidden lg:block")}>
                        {/* Print Control Wrapper */}
                        <Card className="h-full flex flex-col min-h-[600px] print:border-none print:shadow-none print:h-auto">
                            <CardHeader className="bg-gray-50 border-b print:hidden">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                    <div>
                                        <CardTitle>Hasil Generator RPP</CardTitle>
                                        <CardDescription>
                                            {generating ? "AI sedang menyusun modul ajar Anda..." : result ? "Hasil sukses digenerate dari AI." : "Silakan isi form disamping dan klik Generate."}
                                        </CardDescription>
                                    </div>
                                    {!generating && result && (
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <Button
                                                size="sm"
                                                disabled={generatingPPT}
                                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                                                onClick={handleGeneratePPT}
                                            >
                                                {generatingPPT ? (
                                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Proses...</>
                                                ) : (
                                                    <><Presentation className="w-4 h-4 mr-2" /> Buat PPT</>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                                                onClick={() => {
                                                    if (user?.subscription_plan !== "pro" && user?.subscription_plan !== "school") {
                                                        toast.error("Fitur Premium", {
                                                            description: "Upgrade ke paket Pro untuk membuat soal otomatis!",
                                                            action: {
                                                                label: "Upgrade",
                                                                onClick: () => router.push("/harga")
                                                            }
                                                        });
                                                        return;
                                                    }
                                                    setShowQuizModal(true);
                                                }}
                                            >
                                                <FileQuestion className="w-4 h-4 mr-2" />
                                                Buat Soal
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 p-0">
                                {generating ? (
                                    <div className="p-8 h-[700px] bg-white space-y-4 animate-pulse">
                                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-8"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-100 rounded"></div>
                                            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                            <div className="h-4 bg-gray-100 rounded"></div>
                                        </div>
                                        <div className="h-24 bg-gray-50 rounded mt-8"></div>
                                        <div className="space-y-3 mt-8">
                                            <div className="h-4 bg-gray-100 rounded"></div>
                                            <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center h-full absolute inset-0 bg-white/50">
                                            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
                                            <p className="text-sm font-medium text-blue-600">AI sedang meracik RPP...</p>
                                        </div>
                                    </div>
                                ) : result ? (
                                    <div id="rpp-preview-content" className="p-10 h-auto min-h-[500px] lg:h-[800px] overflow-auto bg-white border shadow-sm print:h-auto print:overflow-visible print:p-0 print:border-none print:shadow-none mx-auto w-full max-w-[800px]">
                                        {/* DOCUMENT PAPER EFFECT */}
                                        <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-800 prose-strong:text-slate-950 prose-ul:list-disc prose-ol:list-decimal prose-table:border-collapse prose-table:border prose-table:border-slate-300 prose-th:border prose-th:border-slate-300 prose-th:bg-slate-50 prose-th:p-3 prose-td:border prose-td:border-slate-300 prose-td:p-3 prose-pre:bg-slate-50 prose-pre:text-slate-900 prose-pre:border prose-pre:border-slate-200 prose-pre:p-4 prose-hr:border-slate-300">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 print:hidden">
                                        <div className="text-6xl mb-4">📄</div>
                                        <p>Preview RPP akan muncul di sini.</p>
                                    </div>
                                )}
                            </CardContent>

                            {result && (
                                <div className="p-3 border-t bg-gray-50 flex flex-wrap justify-end gap-2 print:hidden">
                                    <Button variant="outline" onClick={handleSave} className="border-green-600 text-green-700 hover:bg-green-50">
                                        <Save className="w-4 h-4 mr-2" />
                                        Simpan
                                    </Button>
                                    {/* <Button variant="outline" onClick={handleCopy}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Teks
                                    </Button> */}
                                    <Button variant="outline" onClick={handleExportWord}>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Export Word
                                    </Button>
                                    <Button onClick={handleExportPDF}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Unduh PDF
                                    </Button>
                                </div>
                            )}
                        </Card>

                        {/* QUIZ RESULT VIEW REMOVED PER USER REQUEST */}
                    </div>
                </div>
            </main>

            {/* PPT TEMPLATE MODAL */}
            <Dialog open={showPPTModal} onOpenChange={setShowPPTModal}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden gap-0 sm:rounded-2xl max-h-[95vh] flex flex-col bottom-0 sm:bottom-auto translate-y-0 sm:translate-y-[-50%] top-auto sm:top-[50%] rounded-t-3xl sm:rounded-t-2xl">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl md:text-2xl">Pilih Template Presentasi</DialogTitle>
                        <DialogDescription className="text-sm md:text-base">
                            Pilih gaya desain slide yang paling cocok untuk materi ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
                            {[
                                { id: "Ceria", name: "Template 1", desc: "Gaya Ceria & Seru", color: "bg-yellow-100", img: "/templates/template1.png" },
                                { id: "Formal", name: "Template 2", desc: "Gaya Formal & Rapi", color: "bg-blue-100", img: "/templates/template2.png" },
                                { id: "Alam", name: "Template 3", desc: "Gaya Alam & Segar", color: "bg-emerald-100", img: "/templates/template3.png" },
                            ].map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => setPptTemplate(template.id)}
                                    className={cn(
                                        "cursor-pointer group rounded-xl border-2 transition-all relative overflow-hidden flex flex-col",
                                        pptTemplate === template.id ? "border-blue-600 shadow-lg ring-2 ring-blue-600 ring-offset-2" : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                                    )}
                                >
                                    {/* Thumbnail Image Area */}
                                    <div className={cn("aspect-[16/9] w-full relative flex items-center justify-center overflow-hidden", template.color)}>
                                        <img
                                            src={template.img}
                                            alt={template.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-3 bg-white flex-1">
                                        <h4 className="font-bold text-sm text-gray-900">{template.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.desc}</p>
                                    </div>

                                    {/* Selection Checkmark */}
                                    {pptTemplate === template.id && (
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-sm">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-gray-50/50 border-t flex-row gap-3 sm:gap-2">
                        <Button variant="outline" onClick={() => setShowPPTModal(false)} className="flex-1 sm:flex-none">Batal</Button>
                        <Button
                            onClick={executeGeneratePPT}
                            className="flex-[2] sm:flex-none bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg"
                        >
                            <Presentation className="w-4 h-4 mr-2" />
                            Buat Presentasi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* QUIZ CONFIG MODAL */}
            <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 sm:rounded-2xl bottom-0 sm:bottom-auto translate-y-0 sm:translate-y-[-50%] top-auto sm:top-[50%] rounded-t-3xl sm:rounded-t-2xl">
                    <DialogHeader className="p-6 pb-2 text-left">
                        <DialogTitle className="text-xl">Konfigurasi Pembuatan Soal</DialogTitle>
                        <DialogDescription>
                            AI akan membuatkan soal pilihan ganda berdasarkan isi RPP yang sudah dibuat.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="px-6 py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="jumlah_soal">Jumlah Soal</Label>
                            <Select
                                value={quizConfig.jumlah_soal.toString()}
                                onValueChange={(v) => setQuizConfig({ ...quizConfig, jumlah_soal: parseInt(v) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jumlah soal" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 15, 20].map((n) => (
                                        <SelectItem key={n} value={n.toString()}>{n} Soal</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tingkat_kesulitan">Tingkat Kesulitan</Label>
                            <Select
                                value={quizConfig.tingkat_kesulitan}
                                onValueChange={(v) => setQuizConfig({ ...quizConfig, tingkat_kesulitan: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tingkat kesulitan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mudah">Mudah (LOTS)</SelectItem>
                                    <SelectItem value="Sedang">Sedang (MOTS)</SelectItem>
                                    <SelectItem value="Sulit">Sulit (HOTS)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-gray-50/50 border-t flex-row gap-3 sm:gap-2">
                        <Button variant="outline" onClick={() => setShowQuizModal(false)} className="flex-1 sm:flex-none">Batal</Button>
                        <Button
                            onClick={handleGenerateQuiz}
                            disabled={generatingQuiz}
                            className="flex-[2] sm:flex-none bg-purple-600 hover:bg-purple-700 font-bold"
                        >
                            {generatingQuiz ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sedang Membuat...</> : "Mulai Buat Soal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
