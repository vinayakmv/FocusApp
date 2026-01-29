import { useState, useEffect } from 'react';
import reportService from '../services/reportService';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.token) {
            const fetchReports = async () => {
                try {
                    const res = await reportService.getUserReports(user.token);
                    setData(res);
                } catch (error) {
                    console.error("Failed to load reports");
                } finally {
                    setLoading(false);
                }
            };
            fetchReports();
        }
    }, [user]);

    if (loading) return <div className="text-center p-10 text-gray-500 animate-pulse">Analysing Productivity...</div>;
    if (!data) return <div className="text-center p-10 text-gray-500">No data available</div>;

    const maxMinutes = Math.max(...data.weeklyFocus, 1); // Avoid div by zero

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                Productivity Analytics
            </h1>

            {/* Weekly Focus Bar Chart */}
            <div className="glass-panel p-6 rounded-3xl border-t border-blue-500/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>📊</span> Weekly Focus (Minutes)
                </h2>
                <div className="flex items-end justify-between h-48 gap-2">
                    {data.weeklyFocus.map((mins, dayIndex) => {
                        const heightPercent = (mins / maxMinutes) * 100;
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        return (
                            <div key={dayIndex} className="flex flex-col items-center w-full group">
                                <div className="relative w-full flex items-end justify-center h-full">
                                    <div
                                        style={{ height: `${heightPercent}%` }}
                                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-1000 ${mins > 0 ? 'bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300' : 'bg-white/5 h-1'}`}
                                    ></div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap border border-white/10 pointer-events-none z-10">
                                        {mins} mins
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2 font-medium">{days[dayIndex]}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Target Success Stats */}
                <div className="glass-panel p-6 rounded-3xl border-t border-purple-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 bg-purple-600/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    <h2 className="text-xl font-bold text-white mb-6">Target Outcome</h2>
                    <div className="flex items-center justify-center gap-8">
                        {/* CSS Donut Chart */}
                        <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-gray-800"
                            style={{
                                background: `conic-gradient(
                                     #22c55e 0% ${(data.targets.completed / data.targets.total) * 100 || 0}%, 
                                     #ef4444 0% ${((data.targets.completed + data.targets.failed) / data.targets.total) * 100 || 0}%,
                                     #3b82f6 0% 100%
                                 )`
                            }}
                        >
                            <div className="w-24 h-24 bg-gray-900 rounded-full flex flex-col items-center justify-center z-10 relative">
                                <span className="text-2xl font-bold text-white">{data.targets.total}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-gray-300">Completed ({data.targets.completed})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-gray-300">Failed ({data.targets.failed})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-gray-300">Active ({data.targets.active})</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Effort Ratings */}
                <div className="glass-panel p-6 rounded-3xl border-t border-yellow-500/20">
                    <h2 className="text-xl font-bold text-white mb-6">Effort Distribution</h2>
                    <div className="space-y-4">
                        {data.effort.length === 0 && <p className="text-gray-500 text-sm">No session data yet.</p>}
                        {['EASY', 'NORMAL', 'HARD', 'DISTRACTED'].map(type => {
                            const stat = data.effort.find(e => e._id === type) || { count: 0 };
                            const totalSessions = data.effort.reduce((acc, curr) => acc + curr.count, 0) || 1;
                            const percent = (stat.count / totalSessions) * 100;

                            const colors = {
                                'EASY': 'bg-green-500',
                                'NORMAL': 'bg-blue-500',
                                'HARD': 'bg-orange-500',
                                'DISTRACTED': 'bg-red-500'
                            };

                            return (
                                <div key={type}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300 font-medium">{type}</span>
                                        <span className="text-gray-400">{stat.count} sessions</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                        <div
                                            style={{ width: `${percent}%` }}
                                            className={`h-full rounded-full ${colors[type]} transition-all duration-1000`}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Session History List */}
            <div className="glass-panel p-6 rounded-3xl border-t border-blue-500/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>🕒</span> Recent Focus Sessions
                </h2>
                <div className="space-y-4">
                    {(!data.recentSessions || data.recentSessions.length === 0) ? (
                        <p className="text-gray-500 text-sm italic">No recent sessions found.</p>
                    ) : (
                        data.recentSessions.map((session, index) => (
                            <div key={session._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-10 rounded-full ${session.effortRating === 'HARD' ? 'bg-orange-500' :
                                            session.effortRating === 'EASY' ? 'bg-green-500' :
                                                session.effortRating === 'DISTRACTED' ? 'bg-red-500' : 'bg-blue-500'
                                        }`}></div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {session.targetId?.name || "Target Deleted"}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                            {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-black text-white">{session.duration} min</span>
                                    <span className="text-[10px] text-gray-400 font-bold px-2 py-0.5 rounded border border-white/10 uppercase tracking-tighter">{session.effortRating}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
