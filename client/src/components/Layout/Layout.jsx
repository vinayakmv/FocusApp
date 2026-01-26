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
        <div className="flex flex-col h-screen overflow-hidden text-[var(--text-primary)] font-sans selection:bg-yellow-500 selection:text-black relative transition-colors duration-500">

            {/* Top Bar */}
            <header className="absolute top-0 w-full glass-panel z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 backdrop-blur-md bg-transparent">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center font-bold text-xl text-black shadow-lg shadow-black/20">
                        X
                    </div>
                    <div>
                        <Link to="/dashboard" className="text-xl font-bold tracking-tight hover:text-[var(--accent-primary)] transition-colors">Discipline<span className="text-[var(--accent-secondary)]">X</span></Link>
                        <p className="text-[10px] opacity-70 tracking-widest font-medium uppercase leading-none">Master Yourself</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Settings Link */}
                    <Link to="/settings" className="opacity-70 hover:opacity-100 transition-colors p-2 hover:bg-white/5 rounded-full">
                        ⚙️
                    </Link>
                    <button onClick={logout} className="text-xs font-bold opacity-70 hover:opacity-100 transition-all px-4 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 uppercase tracking-wide">
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content - Scrollable Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar pt-24 pb-28 px-4 sm:px-6 w-full max-w-4xl mx-auto">
                <div className="animate-scale-in">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav - Themed Dock */}
            <nav className="fixed bottom-6 left-6 right-6 h-20 glass-panel rounded-2xl flex justify-around items-center z-50 transition-colors duration-500 bg-transparent">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 group relative ${isActive ? 'text-[var(--accent-secondary)]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {/* Active Indicator Line */}
                            {isActive && <div className="absolute top-0 w-8 h-1 bg-[var(--accent-secondary)] rounded-b-lg shadow-[0_0_10px_currentColor]"></div>}

                            <span className={`text-2xl mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>{item.icon}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
};
export default Layout;
