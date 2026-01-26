import { useState, useEffect } from 'react';
import targetService from '../services/targetService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [targets, setTargets] = useState([]);
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
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-6xl">🎯</span>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{target.name}</h3>
                                    <p className="text-sm text-gray-400">Goal: <span className="text-white">{target.goal} hrs</span></p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${target.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                    {target.status}
                                </span>
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
        </div>
    )
}

export default Dashboard
