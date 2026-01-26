import { useState, useEffect } from 'react';
import targetService from '../services/targetService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [targets, setTargets] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ show: false, targetId: null, status: '', stake: 0 });
    const { user } = useAuth();

    useEffect(() => {
        const fetchTargets = async () => {
            if (user?.token) {
                try {
                    const data = await targetService.getTargets(user.token);
                    setTargets(data);
                } catch (error) {
                    console.error("Failed to fetch targets");
                }
            }
        };
        fetchTargets();
    }, [user]);

    const handleDeleteClick = (targetId, status, stake) => {
        setDeleteModal({ show: true, targetId, status, stake });
    };

    const confirmDelete = async () => {
        if (!deleteModal.targetId) return;

        try {
            await targetService.deleteTarget(deleteModal.targetId, user.token);
            setTargets(targets.filter(t => t._id !== deleteModal.targetId));
            setDeleteModal({ show: false, targetId: null, status: '', stake: 0 });
        } catch (error) {
            alert("Failed to delete target: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Your Targets</h1>
                <Link to="/create-target" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                    + New Target
                </Link>
            </div>

            {targets.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-2xl">
                    <p className="text-gray-400 text-lg mb-4">No active targets found.</p>
                    <Link to="/create-target" className="text-blue-400 hover:text-blue-300 font-medium">Create your first target &rarr;</Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {targets.map(target => (
                        <div key={target._id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                            {/* Delete Button (Moved to Header) */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{target.name}</h3>
                                    <p className="text-sm text-gray-400">Goal: <span className="text-white">{target.goal} hrs</span></p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${target.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                        {target.status}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteClick(target._id, target.status, target.stakeAmount)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                                        title="Delete Target"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6 bg-gray-900/50 rounded-lg p-3 border border-white/5">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="text-blue-400 font-mono">{(target.progress / 60).toFixed(1)} hrs</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min(100, (target.progress / (target.goal * 60)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    Stake: <span className="text-gray-300 font-mono">₹{target.stakeAmount}</span>
                                </div>
                                {target.status === 'ACTIVE' && (
                                    <Link to={`/session/${target._id}`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95">
                                        Start Session ▶
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Delete Modal with Premium UI */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop with Blur and Fade */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
                        onClick={() => setDeleteModal({ ...deleteModal, show: false })}
                    ></div>

                    {/* Modal Card */}
                    <div className="relative w-full max-w-md bg-[#0a0a0a] border border-red-500/30 rounded-3xl shadow-[0_0_100px_rgba(220,38,38,0.3)] overflow-hidden animate-scale-in">
                        {/* Decorative Gradient Blob */}
                        <div className="absolute top-[-50%] left-[50%] -translate-x-1/2 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="p-8 relative z-10 text-center">
                            {/* Animated Warning Icon */}
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-red-500/40 animate-pulse-slow">
                                <span className="text-4xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">⚠️</span>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Wait, are you sure?</h3>

                            {deleteModal.status === 'ACTIVE' && deleteModal.stake > 0 ? (
                                <div className="mt-6 mb-8 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-500"></div>
                                    <div className="relative bg-red-950/30 border border-red-500/30 p-6 rounded-xl backdrop-blur-sm">
                                        <p className="text-red-400 font-bold text-xl mb-2 flex items-center justify-center gap-2">
                                            <span>💸</span> You will <span className="underline decoration-red-500 underline-offset-4">LOSE</span> ₹{deleteModal.stake}
                                        </p>
                                        <p className="text-red-200/60 text-sm leading-relaxed">
                                            Deleting an <span className="font-mono text-red-300 font-bold">ACTIVE</span> target is considered giving up. Your stake will be forfeited to the penalty pool.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 mt-2 mb-8 text-lg">
                                    This action cannot be undone. The target data will be permanently deleted.
                                </p>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteModal({ ...deleteModal, show: false })}
                                    className="flex-1 py-4 rounded-xl font-bold text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    <span>{deleteModal.status === 'ACTIVE' && deleteModal.stake > 0 ? 'Forfeit & Delete' : 'Delete Now'}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">🗑️</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
