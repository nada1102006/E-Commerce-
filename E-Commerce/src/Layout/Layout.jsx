import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';


export default function Layout() {
    const { isDarkMode, setIsDarkMode } = useTheme();

    return (
        <div className={`flex min-h-screen flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <header className={`sticky top-0 z-50 border-b px-6 py-4 backdrop-blur-sm ${isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white/95'}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <Link to="/" className="text-lg font-bold text-primary-500">
                        Koda Store
                    </Link>

       

                    <div className="flex items-center gap-3">
                        

                        <button
                            type="button"
                            onClick={() => setIsDarkMode((prev) => !prev)}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}
                        >
                            {isDarkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
                            <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className={`border-t px-6 py-6 text-center text-sm ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`}>
                © 2026 Koda Store
            </footer>
        </div>
    );
}
