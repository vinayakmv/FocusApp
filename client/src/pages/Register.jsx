import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ageGroup, setAgeGroup] = useState('ADULT');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register({ name, email, password, ageGroup });
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Try a different email.');
            setLoading(false);
        }
    };

    // Motivational Quotes Rotation
    const [quoteIndex, setQuoteIndex] = useState(0);
    const quotes = [
        { text: "The future belongs to those who discipline themselves today.", author: "Unknown" },
        { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full flex bg-[#030014] text-white overflow-hidden font-sans">
            {/* LEFT: Motivational Side (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12">
                {/* Abstract Background Art - Green Variant for Growth */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-black to-[#050b14] z-0"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0"></div>
                <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>

                {/* Content */}
                <div className="relative z-10 max-w-lg text-left">
                    <div className="mb-12">
                        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(5,150,105,0.4)]">
                            <span className="text-4xl font-bold">X</span>
                        </div>
                        <h1 className="text-6xl font-bold leading-tight mb-4">
                            Start Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Evolution.</span>
                        </h1>
                        <p className="text-xl text-gray-400">Create your identity. Define your path.</p>
                    </div>

                    <div className="glass-panel bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                        <p className="text-xl italic text-gray-200 mb-4 transition-all duration-500 min-h-[80px] flex items-center">
                            "{quotes[quoteIndex].text}"
                        </p>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">— {quotes[quoteIndex].author}</p>
                    </div>
                </div>
            </div>

            {/* RIGHT: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                {/* Mobile Background Elements */}
                <div className="absolute lg:hidden inset-0 bg-gradient-to-b from-[#0D1B2A] to-black z-0"></div>

                <div className="w-full max-w-md relative z-10 animate-fade-in">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-gray-400">Join thousands of disciplined achievers.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-center gap-3">
                                ⚠️ {error}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Age Group</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['CHILD', 'TEEN', 'ADULT'].map((group) => (
                                    <button
                                        type="button"
                                        key={group}
                                        onClick={() => setAgeGroup(group)}
                                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${ageGroup === group
                                                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {group === 'CHILD' ? '<13' : group === 'TEEN' ? '13-17' : '18+'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Password</label>
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Start Journey 🚀'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            Already a member? <Link to="/login" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
