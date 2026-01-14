"use client";

import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="RPPGenius Logo" className="h-16 md:h-28 w-auto transition-all" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link href="/buat-rpp" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Buat RPP
                </Link>
                <Link href="/buat-rpp/rpp-history" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Riwayat RPP
                </Link>
                <Link href="/buat-rpp/quiz-history" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Riwayat Soal
                </Link>
              </>
            )}
            <Link href="/fitur" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Fitur
            </Link>
            <Link href="/cara-kerja" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Cara Kerja
            </Link>
            <Link href="/harga" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Harga
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm font-medium hidden sm:inline-block">Hi, {user.full_name || user.email.split('@')[0]}</span>
                <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button variant="hero" size="default">
                    Mulai Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in-up">
            <div className="flex flex-col gap-4">
              {user && (
                <>
                  <Link href="/buat-rpp" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 px-4 hover:bg-muted rounded-lg">
                    Buat RPP
                  </Link>
                  <Link href="/buat-rpp/rpp-history" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 px-4 hover:bg-muted rounded-lg">
                    Riwayat RPP
                  </Link>
                  <Link href="/buat-rpp/quiz-history" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 px-4 hover:bg-muted rounded-lg">
                    Riwayat Soal
                  </Link>
                </>
              )}
              <Link href="/fitur" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 px-4 hover:bg-muted rounded-lg">
                Fitur
              </Link>
              <Link href="/cara-kerja" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 px-4 hover:bg-muted rounded-lg">
                Cara Kerja
              </Link>
              <Link href="/harga" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 px-4 hover:bg-muted rounded-lg">
                Harga
              </Link>
              <div className="flex flex-col gap-2 pt-4 px-4">
                {user ? (
                  <>
                    <div className="text-sm font-medium py-2 px-4 text-foreground border-b border-border/50 mb-2">
                      Hi, {user.full_name || user.email.split('@')[0]}
                    </div>
                    <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { logout(); setIsMenuOpen(false); }}>
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Masuk</Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" className="w-full">Mulai Gratis</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
