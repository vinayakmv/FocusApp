import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { theme, setTheme, themes } = useTheme();
    const { logout } = useAuth();

    return (
        <div className="p-4 space-y-8 animate-fade-in text-white/90">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Settings</h1>

            {/* Theme Selector */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Appearance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`glass-panel p-4 rounded-xl flex items-center gap-4 transition-all duration-300 group text-left relative overflow-hidden ${theme === t.id ? 'border-accent ring-1 ring-white/50 bg-white/10' : 'hover:bg-white/5'
                                }`}
                        >
                            {/* Theme Preview Gradient */}
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.colors} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                                {t.icon}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{t.name}</p>
                                {theme === t.id && <p className="text-xs text-green-400 font-mono">● Active</p>}
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Account Actions */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Account</h2>
                <div className="glass-panel p-6 rounded-xl space-y-4">
                    <p className="text-gray-400 text-sm">You are logged in.</p>
                    <button
                        onClick={logout}
                        className="w-full py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold"
                    >
                        Sign Out
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Settings;
