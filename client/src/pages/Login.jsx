import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
            setLoading(false);
        }
    };

    // Motivational Quotes Rotation
    const [quoteIndex, setQuoteIndex] = useState(0);
    const quotes = [
        { text: "Discipline is doing what needs to be done, even if you don't want to do it.", author: "Unknown" },
        { text: "We must all suffer from one of two pains: the pain of discipline or the pain of regret.", author: "Jim Rohn" },
        { text: "Focus is the new IQ.", author: "Cal Newport" },
        { text: "The only easy day was yesterday.", author: "Navy SEALs" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#030014] text-white overflow-hidden font-sans relative">

            {/* LEFT/TOP: Motivational Side */}
            <div className="w-full lg:w-1/2 h-[45vh] lg:h-auto absolute lg:relative top-0 left-0 lg:inset-auto flex items-center justify-center p-8 lg:p-12 overflow-hidden z-0">
                {/* Abstract Background Art */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-[#050b14] z-0"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0"></div>
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

                {/* Content */}
                <div className="relative z-10 max-w-lg text-left lg:text-left w-full">
                    <div className="mb-0 lg:mb-12">
                        <div className="hidden lg:flex w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                            <span className="text-4xl font-bold">X</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-2 lg:mb-4">
                            Master Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Potential.</span>
                        </h1>
                        <p className="text-sm lg:text-xl text-gray-300 lg:text-gray-400 max-w-xs">Join the elite community of focused achievers.</p>
                    </div>

                    <div className="hidden lg:block glass-panel bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                        <p className="text-xl italic text-gray-200 mb-4 transition-all duration-500 min-h-[80px] flex items-center">
                            "{quotes[quoteIndex].text}"
                        </p>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">— {quotes[quoteIndex].author}</p>
                    </div>
                </div>
            </div>

            {/* RIGHT/BOTTOM: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10 mt-[35vh] lg:mt-0">

                <div className="w-full max-w-md relative animate-fade-in bg-[#030014]/90 lg:bg-transparent p-8 lg:p-0 rounded-3xl lg:rounded-none backdrop-blur-xl lg:backdrop-blur-none border border-white/10 lg:border-none shadow-2xl lg:shadow-none">
                    <div className="mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-gray-400 text-sm">Enter your credentials to access the dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-center gap-3">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            New here? <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
