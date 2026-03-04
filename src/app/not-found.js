import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-emerald text-[40px]">search_off</span>
            </div>
            <h1 className="font-display text-5xl text-surface-dark mb-2">404</h1>
            <p className="text-gray-500 text-sm mb-8 max-w-xs">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href="/"
                className="h-12 px-8 rounded-full bg-emerald text-white font-bold text-sm flex items-center gap-2 hover:bg-emerald-dark transition-colors active:scale-[0.98]"
            >
                <span className="material-symbols-outlined text-[18px]">home</span>
                Back to Home
            </Link>
        </div>
    );
}
