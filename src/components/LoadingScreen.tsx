"use client";

import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = "Memuat..." }: LoadingScreenProps) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] mt-16 animate-in fade-in duration-500">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">{message}</p>
            </div>
        </div>
    );
}
