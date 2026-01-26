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
        <div className="flex flex-col min-h-screen text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Top Bar - Glass */}
            <header className="fixed top-0 w-full glass-panel z-50 px-6 py-4 flex justify-between items-center bg-gray-900/50 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-lg">F</div>
                    <Link to="/dashboard" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">FocusApp</Link>
                </div>
                <button onClick={logout} className="text-xs font-medium text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-full hover:bg-white/5">
                    Sign Out
                </button>
            </header>

            {/* Main Content - Spaced for fixed header/footer */}
            <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 max-w-4xl mx-auto w-full">
                <div className="animate-fade-in">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav - Floating Glass */}
            <nav className="fixed bottom-6 left-4 right-4 h-16 glass-panel rounded-2xl flex justify-around items-center shadow-2xl shadow-blue-900/20 z-50 border border-white/10">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-blue-400 -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <span className={`text-xl mb-1 filter ${isActive ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : ''}`}>{item.icon}</span>
                            {isActive && <span className="text-[10px] font-bold tracking-wider">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
};
export default Layout;
