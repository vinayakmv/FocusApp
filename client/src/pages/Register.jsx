import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ageGroup, setAgeGroup] = useState('ADULT');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ name, email, password, ageGroup });
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1B2A] text-white p-4">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2">Join Discipline<span className="text-yellow-400">X</span></h1>
                <p className="text-gray-400 tracking-widest uppercase text-xs">Begin Your Transformation</p>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500"
                />
                <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500 text-white"
                >
                    <option value="ADULT">Adult (18+)</option>
                    <option value="TEEN">Teen (13-17)</option>
                    <option value="CHILD">Child (Under 13)</option>
                </select>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="p-3 rounded bg-blue-600 font-bold hover:bg-blue-700 transition">
                    Register
                </button>
            </form>
            <p className="mt-4 text-neutral-400">
                Already have an account? <Link to="/login" className="text-blue-400">Login</Link>
            </p>
        </div>
    )
}

export default Register
