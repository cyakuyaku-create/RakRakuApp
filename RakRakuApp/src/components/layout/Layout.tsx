import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">GadgetMatch</span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        ホーム
                    </Link>
                    <Button variant="outline" size="sm" asChild>
                        {/* Note: asChild functionality requires Radix Slot or custom impl, keeping simple for now */}
                        <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
                    </Button>
                </nav>
            </div>
        </header>
    );
};

export const Footer: React.FC = () => {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container mx-auto py-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} GadgetMatch. Built with Google Antigravity.</p>
            </div>
        </footer>
    );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};
