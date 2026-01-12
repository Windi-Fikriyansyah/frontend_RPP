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
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              RPP<span className="text-gradient-primary">Genius</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/dashboard/rpp-history" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Riwayat RPP
                </Link>
                <Link href="/dashboard/quiz-history" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
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
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/rpp-history" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                    Riwayat RPP
                  </Link>
                  <Link href="/dashboard/quiz-history" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                    Riwayat Soal
                  </Link>
                </>
              )}
              <Link href="/fitur" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                Fitur
              </Link>
              <Link href="/cara-kerja" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                Cara Kerja
              </Link>
              <Link href="/harga" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                Harga
              </Link>
              <a href="#testimoni" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                Testimoni
              </a>
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/login">
                  <Button variant="ghost" className="w-full">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button variant="hero" className="w-full">Mulai Gratis</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
