import { useState, useEffect } from 'react';
import targetService from '../services/targetService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, targetId: null, status: '', stake: 0 });
    const { user } = useAuth();

    useEffect(() => {
        const fetchTargets = async () => {
            if (user?.token) {
                try {
                    const data = await targetService.getTargets(user.token);
                    // Ensure data is array before setting
                    setTargets(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Failed to fetch targets", error);
                    setTargets([]); // Fallback to empty array
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchTargets();
    }, [user]);

    const handleMarkComplete = async (todoId) => {
        try {
            await targetService.markComplete(todoId, user.token);
            // Refresh locally
            setTargets(prev => prev.map(t =>
                t._id === todoId ? { ...t, status: 'PENDING_APPROVAL' } : t
            ));
        } catch (error) {
            alert("Failed to mark complete: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteClick = (targetId, status, stake) => {
        setDeleteModal({ show: true, targetId, status, stake });
    };

    const confirmDelete = async () => {
        if (!deleteModal.targetId) return;

        try {
            // Updated to use applyPenalty correctly
            await targetService.deleteTarget(deleteModal.targetId, user.token);
            setTargets(targets.filter(t => t._id !== deleteModal.targetId));
            setDeleteModal({ show: false, targetId: null, status: '', stake: 0 });
        } catch (error) {
            alert("Failed to delete target: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Your Targets</h1>
                    <p className="text-gray-400 text-sm">Manage your focus goals</p>
                </div>
                <Link to="/create-target" className="btn-primary px-4 py-2 rounded-lg font-bold shadow-lg shadow-yellow-500/20">
                    + New Target
                </Link>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-2">
                                    <div className="h-6 w-32 bg-white/10 rounded-lg"></div>
                                    <div className="h-4 w-20 bg-white/5 rounded-lg"></div>
                                </div>
                                <div className="h-6 w-16 bg-white/10 rounded-lg"></div>
                            </div>
                            <div className="mb-6 h-12 bg-black/20 rounded-lg border border-white/5"></div>
                            <div className="flex justify-between items-center">
                                <div className="h-4 w-20 bg-white/5 rounded-lg"></div>
                                <div className="h-8 w-24 bg-white/10 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : targets.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-2xl border-dashed border-2 border-white/10">
                    <p className="text-gray-400 text-lg mb-4">No active targets found.</p>
                    <Link to="/create-target" className="text-yellow-400 hover:text-yellow-300 font-bold uppercase tracking-wider text-sm">Create your first target &rarr;</Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {targets.map(target => {
                        const isManual = isNaN(target.goal);

                        return (
                            <div key={target._id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                                {/* Decorative Background Gradient (Subtle) */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">{target.name}</h3>
                                        <p className="text-sm text-gray-400">
                                            Goal: <span className="text-white font-mono">{target.goal} {isManual ? '' : 'hrs'}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold 
                                        ${target.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                target.status === 'PENDING_APPROVAL' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                            {target.status.replace('_', ' ')}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteClick(target._id, target.status, target.stakeAmount)}
                                            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100"
                                            title="Delete Target"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Section - Only for Time Based */}
                                {!isManual && (
                                    <div className="mb-6 bg-black/20 rounded-lg p-3 border border-white/5 relative z-10">
                                        <div className="flex justify-between text-xs mb-1.5 uppercase tracking-wide font-medium">
                                            <span className="text-gray-500">Today: <span className="text-yellow-400">{(target.todayProgress / 60).toFixed(1)}h</span></span>
                                            <span className="text-blue-400">Total: {(target.progress / 60).toFixed(1)} hrs</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                                style={{ width: `${Math.min(100, (target.progress / (target.goal * 60)) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center relative z-10">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                        Stake: <span className="text-white font-mono text-sm ml-1">{target.stakeType === 'TOKEN' ? `${target.stakeAmount} FOC` : `₹${target.stakeAmount}`}</span>
                                    </div>

                                    {target.status === 'ACTIVE' && (
                                        <>
                                            {isManual ? (
                                                <button
                                                    onClick={() => handleMarkComplete(target._id)}
                                                    className="btn-primary px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 transition-transform"
                                                >
                                                    Mark Complete ✓
                                                </button>
                                            ) : (
                                                <Link to={`/session/${target._id}`} className="btn-secondary px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/40 hover:scale-105 transition-transform">
                                                    Start Session ▶
                                                </Link>
                                            )}
                                        </>
                                    )}

                                    {target.status === 'PENDING_APPROVAL' && (
                                        <span className="text-xs font-bold text-yellow-400 animate-pulse">Waiting for Parent...</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Custom Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
                        onClick={() => setDeleteModal({ ...deleteModal, show: false })}
                    ></div>

                    <div className="relative w-full max-w-md bg-[#0D1B2A] border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden animate-scale-in">
                        <div className="p-8 relative z-10 text-center">
                            <div className="w-16 h-16 bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30">
                                <span className="text-3xl">⚠️</span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Wait, are you sure?</h3>

                            {deleteModal.status === 'ACTIVE' && deleteModal.stake > 0 ? (
                                <div className="mt-4 mb-6 bg-red-950/30 border border-red-500/20 p-4 rounded-xl">
                                    <p className="text-red-400 font-bold text-lg mb-1">
                                        You will LOSE ₹{deleteModal.stake}
                                    </p>
                                    <p className="text-red-300/60 text-xs">
                                        Deleting an ACTIVE target forfeits the stake.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-400 mt-2 mb-6">
                                    This action cannot be undone.
                                </p>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteModal({ ...deleteModal, show: false })}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-400 bg-white/5 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40"
                                >
                                    Delete
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
