import { useState, useEffect } from 'react';
import partnershipService from '../services/partnershipService';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [myVouchers, setMyVouchers] = useState([]);
    const { user } = useAuth();
    const { refreshWallet } = useWallet();
    const [msg, setMsg] = useState('');
    const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'my'

    useEffect(() => {
        if (user?.token) {
            fetchData();
        }
    }, [user, activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'browse') {
                const data = await partnershipService.getRewards(user.token);
                setRewards(data);
            } else {
                const data = await partnershipService.getMyRedeemed(user.token);
                setMyVouchers(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const redeem = async (rewardId) => {
        try {
            const res = await partnershipService.redeemReward(rewardId, user.token);
            setMsg(`Redeemed! Code: ${res.voucherCode}`);
            refreshWallet();
            // Switch to my vouchers view to see it
            setTimeout(() => setActiveTab('my'), 1500);
        } catch (error) {
            setMsg('Failed to redeem (Insufficient tokens?)');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Rewards Market</h1>
                <div className="flex bg-black/40 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'browse' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Browse
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        My Vouchers
                    </button>
                </div>
            </div>

            {msg && <div className="bg-purple-500/10 border border-purple-500/20 text-purple-200 p-4 rounded-xl text-center backdrop-blur-md animate-pulse">{msg}</div>}

            {activeTab === 'browse' ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {rewards.map(reward => (
                        <div key={reward._id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-t border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-white mb-1">{reward.partnerName}</h3>
                                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{reward.value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl shadow-lg">
                                    🎁
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{reward.description}</p>

                            <button
                                onClick={() => redeem(reward._id)}
                                className="w-full py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all border border-white/10 group-hover:border-purple-500/50"
                            >
                                Redeem for <span className="text-yellow-400">{reward.costInTokens} T</span>
                            </button>
                        </div>
                    ))}
                    {rewards.length === 0 && (
                        <div className="col-span-2 text-center py-20 glass-panel rounded-2xl">
                            <p className="text-gray-500">More rewards coming soon.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {myVouchers.map(item => (
                        <div key={item._id} className="glass-panel p-6 rounded-2xl border border-green-500/20 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 bg-green-500 text-black text-xs font-bold px-8 py-1 rotate-45">ACTIVE</div>
                            <h3 className="font-bold text-lg text-white mb-1">{item.rewardId.partnerName}</h3>
                            <p className="text-2xl font-bold text-green-400 mb-4">{item.rewardId.value}</p>

                            <div className="bg-black/50 p-4 rounded-xl border border-white/10 text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Voucher Code</p>
                                <p className="text-xl font-mono font-bold text-white tracking-wider select-all">{item.voucherCode}</p>
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-4">Expires: {new Date(item.validUntil).toLocaleDateString()}</p>
                        </div>
                    ))}
                    {myVouchers.length === 0 && (
                        <div className="col-span-2 text-center py-20 glass-panel rounded-2xl">
                            <p className="text-gray-500">You haven't redeemed any vouchers yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Rewards
