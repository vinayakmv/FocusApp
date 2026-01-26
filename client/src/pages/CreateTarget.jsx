import { useState } from 'react';
import targetService from '../services/targetService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateTarget = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        goal: 1, // hours
        stakeAmount: 0,
        stakeType: 'CASH', // or TOKEN
        successMode: 'REFUND',
        failureMode: 'PENALTY', // PENALTY, DONATE, BURN
        expiryDate: ''
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await targetService.createTarget({
                ...form,
                goal: Number(form.goal), // convert to number logic if needed (e.g. minutes)
                stakeAmount: Number(form.stakeAmount)
            }, user.token);
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to create target. Check balance or input.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="glass-panel p-8 rounded-3xl w-full max-w-2xl border-t border-white/10 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Create New Target
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Target Name</label>
                        <input
                            name="name"
                            onChange={handleChange}
                            className="w-full p-4 bg-black/40 rounded-xl border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-gray-600 transition-all font-medium"
                            placeholder="e.g. Master React in 30 Days"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Goal (Hrs)</label>
                            <input
                                name="goal"
                                type="number"
                                onChange={handleChange}
                                className="w-full p-4 bg-black/40 rounded-xl border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                            <input
                                name="expiryDate"
                                type="datetime-local"
                                onChange={handleChange}
                                className="w-full p-4 bg-black/40 rounded-xl border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-yellow-500/20 shadow-inner">
                        <h3 className="font-bold mb-4 text-yellow-400 flex items-center gap-2">
                            <span className="text-xl">⚠️</span> Staking Commitment
                        </h3>

                        <div className="mb-6">
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Stake Amount</label>
                            <input
                                name="stakeAmount"
                                type="number"
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full p-4 bg-black/50 rounded-xl border border-white/10 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-white transition-all font-mono text-lg"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Currency</label>
                                <select
                                    name="stakeType"
                                    onChange={handleChange}
                                    className="w-full p-3 bg-neutral-900 rounded-lg border border-white/10 text-white outline-none focus:border-yellow-500 appearance-none"
                                >
                                    <option value="CASH">Cash (₹)</option>
                                    <option value="TOKEN">Tokens</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">On Failure</label>
                                <select
                                    name="failureMode"
                                    onChange={handleChange}
                                    className="w-full p-3 bg-neutral-900 rounded-lg border border-white/10 text-white outline-none focus:border-red-500 appearance-none"
                                >
                                    <option value="PENALTY">Pay Penalty</option>
                                    <option value="DONATE">Donate</option>
                                    <option value="BURN">Burn</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Create Target 🚀
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateTarget
