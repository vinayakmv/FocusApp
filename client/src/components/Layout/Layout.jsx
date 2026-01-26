import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: '🏠' },
        { path: '/create-target', label: 'Focus', icon: '🎯' },
        { path: '/wallet', label: 'Wallet', icon: '💳' },
        { path: '/rewards', label: 'Market', icon: '🛍️' },
        { path: '/family', label: 'Family', icon: '👨‍👩‍👧' },
        { path: '/reports', label: 'Stats', icon: '📊' },
    ];

    return (
        <div className="flex flex-col min-h-screen text-white font-sans selection:bg-violet-500/50 selection:text-white relative">

            {/* Ambient Background Animation */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-700/20 rounded-full blur-[100px] animate-blob mix-blend-screen"></div>
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-cyan-700/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-700/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
            </div>

            {/* Top Bar - Premium Glass */}
            <header className="fixed top-0 w-full glass-panel z-50 px-6 py-4 flex justify-between items-center bg-transparent backdrop-blur-xl border-b border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-pulse-slow">F</div>
                    <Link to="/dashboard" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-white to-cyan-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">FocusApp</Link>
                </div>
                <button onClick={logout} className="text-xs font-semibold text-gray-400 hover:text-white transition-all px-4 py-1.5 rounded-full hover:bg-white/10 hover:shadow-glow border border-transparent hover:border-white/10">
                    Sign Out
                </button>
            </header>

            {/* Main Content - Spaced for fixed header/footer */}
            <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 max-w-4xl mx-auto w-full">
                <div className="animate-fade-in">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav - Premium Floating Dock */}
            <nav className="fixed bottom-6 left-6 right-6 h-20 glass-panel rounded-3xl flex justify-around items-center shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50 border border-white/10 backdrop-blur-2xl">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 group ${isActive ? 'text-white -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <span className={`text-2xl mb-1 filter transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_12px_rgba(167,139,250,0.8)] scale-110' : 'group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`}>{item.icon}</span>
                            {isActive && <div className="h-1 w-1 bg-violet-400 rounded-full mt-1 animate-pulse" />}
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
};
export default Layout;
