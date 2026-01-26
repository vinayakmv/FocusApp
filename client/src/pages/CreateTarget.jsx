import { useState } from 'react';
import targetService from '../services/targetService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

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

                    <div className="p-8 bg-black/40 rounded-3xl border-2 border-yellow-500/30 relative group hover:border-yellow-500/50 transition-all duration-500">
                        <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <h3 className="font-bold mb-6 text-yellow-400 flex items-center gap-3 text-lg">
                            <span className="text-2xl filter drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">⚠️</span>
                            <span className="tracking-widest uppercase">Staking Commitment</span>
                        </h3>

                        <div className="mb-8">
                            <label className="block text-xs uppercase tracking-wider text-yellow-500/70 mb-2 font-bold">Stake Amount</label>
                            <input
                                name="stakeAmount"
                                type="number"
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full p-5 bg-black/60 rounded-2xl border border-yellow-500/30 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(234,179,8,0.2)] outline-none text-white transition-all font-mono text-3xl font-bold text-center tracking-tight"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CustomSelect
                                label="Currency"
                                name="stakeType"
                                value={form.stakeType}
                                onChange={handleChange}
                                colorClass="white"
                                options={[
                                    { value: 'CASH', label: 'Cash (₹)' },
                                    { value: 'TOKEN', label: 'Tokens' }
                                ]}
                            />

                            <CustomSelect
                                label="On Success 🚀"
                                name="successMode"
                                value={form.successMode}
                                onChange={handleChange}
                                colorClass="green"
                                options={[
                                    { value: 'REFUND', label: 'Refund Stake' },
                                    { value: 'VOUCHER', label: 'Get Voucher 🎟️' }
                                ]}
                            />

                            <CustomSelect
                                label="On Failure 💀"
                                name="failureMode"
                                value={form.failureMode}
                                onChange={handleChange}
                                colorClass="red"
                                options={[
                                    { value: 'PENALTY', label: 'Pay Penalty' },
                                    { value: 'DONATE', label: 'Donate Charity' },
                                    { value: 'BURN', label: 'Burn Revenue' }
                                ]}
                            />
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
