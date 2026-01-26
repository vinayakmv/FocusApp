import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <h1 className="text-4xl font-bold mb-8">FocusApp</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="p-3 rounded bg-blue-600 font-bold hover:bg-blue-700 transition">
                    Login
                </button>
            </form>
            <p className="mt-4 text-neutral-400">
                Don't have an account? <Link to="/register" className="text-blue-400">Register</Link>
            </p>
        </div>
    )
}

export default Login
