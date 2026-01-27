import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import familyService from '../services/familyService';

const Family = () => {
    const { user } = useAuth();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('PARENT'); // PARENT or CHILD

    // Invite State
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteCodeResult, setInviteCodeResult] = useState('');
    const [inviteMsg, setInviteMsg] = useState(''); // New State
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [childToDelete, setChildToDelete] = useState(null); // { id, name }

    const confirmDeleteChild = async () => {
        if (!childToDelete) return;
        try {
            await familyService.removeChild(childToDelete.id, user.token);
            setChildren(prev => prev.filter(c => c._id !== childToDelete.id));
            setChildToDelete(null);
        } catch (error) {
            alert('Failed to remove child: ' + (error.response?.data?.message || error.message));
        }
    };

    // Accept Invite State
    const [acceptCode, setAcceptCode] = useState('');
    const [acceptMsg, setAcceptMsg] = useState('');

    useEffect(() => {
        if (user && viewMode === 'PARENT') {
            fetchChildren();
        }
    }, [user, viewMode]);

    const fetchChildren = async () => {
        try {
            const data = await familyService.getChildren(user.token);
            setChildren(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviteMsg(''); // Clear prev msg
        try {
            const data = await familyService.inviteChild(inviteEmail, user.token);
            setInviteCodeResult(data.inviteCode);
            setInviteEmail('');
        } catch (error) {
            // Display specific backend error
            setInviteMsg(error.response?.data?.message || error.message || 'Failed to generate code');
        }
    };

    const handleAcceptInvite = async (e) => {
        e.preventDefault();
        setAcceptMsg('');
        try {
            await familyService.acceptInvite(acceptCode, user.token);
            setAcceptMsg('Successfully linked to parent!');
            setAcceptCode('');
        } catch (error) {
            setAcceptMsg(error.response?.data?.message || 'Invalid code');
        }
    };

    return (
        <div className="text-[var(--text-primary)] animate-fade-in p-4 pb-24">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                        Family Hub
                    </h1>
                    <p className="text-gray-400 text-sm">Manage your digital household.</p>
                </div>

                {/* Role Toggles */}
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setViewMode('PARENT')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'PARENT' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Parent
                    </button>
                    <button
                        onClick={() => setViewMode('CHILD')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'CHILD' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Child
                    </button>
                </div>
            </div>

            {/* PARENT VIEW */}
            {viewMode === 'PARENT' && (
                <div className="space-y-8">
                    {/* Action Bar */}
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 glass-panel">
                        <div>
                            <h2 className="text-xl font-bold">Your Children</h2>
                            <p className="text-sm text-gray-400">Monitor focus & assign targets.</p>
                        </div>
                        <button
                            onClick={() => { setShowInviteModal(true); setInviteMsg(''); setInviteCodeResult(''); }}
                            className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
                        >
                            <span>+</span> Invite Child
                        </button>
                    </div>

                    {/* Children Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            <p className="text-gray-500">Loading family...</p>
                        ) : children.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                                <p className="text-lg">No children linked yet.</p>
                                <p className="text-sm">Click "Invite Child" to get started.</p>
                            </div>
                        ) : (
                            children.map(child => (
                                <div key={child._id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[var(--accent-primary)]/50 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[var(--accent-primary)]/20"></div>

                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xl">
                                            {child.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{child.name}</h3>
                                            <p className="text-xs text-gray-400">{child.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                                        <div className="bg-black/20 p-3 rounded-lg">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest">Balance</p>
                                            <p className="text-xl font-mono font-bold text-yellow-400">{child.tokenBalance} <span className="text-xs">FOC</span></p>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-lg">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest">Focus</p>
                                            <p className="text-xl font-mono font-bold text-blue-400">-- <span className="text-xs">hrs</span></p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setChildToDelete({ id: child._id, name: child.name }); }}
                                        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                                        title="Remove Child"
                                    >
                                        🗑️
                                    </button>

                                    <button className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all text-sm relative z-10">
                                        Assign Target 🎯
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* CHILD VIEW */}
            {viewMode === 'CHILD' && (
                <div className="max-w-md mx-auto mt-12 bg-white/5 p-8 rounded-2xl border border-white/10 glass-panel text-center">
                    <h2 className="text-2xl font-bold mb-2">Join a Family</h2>
                    <p className="text-gray-400 mb-8 text-sm">Enter the 6-digit code shared by your parent to link your account.</p>

                    <form onSubmit={handleAcceptInvite} className="space-y-4">
                        <input
                            type="text"
                            value={acceptCode}
                            onChange={(e) => setAcceptCode(e.target.value)}
                            className="w-full p-4 text-center text-2xl tracking-[0.5em] font-mono font-bold bg-black/30 border border-white/10 rounded-xl focus:border-[var(--accent-primary)] focus:outline-none transition-all uppercase placeholder-gray-700"
                            placeholder="000000"
                            maxLength={6}
                        />

                        {acceptMsg && (
                            <div className={`p-3 rounded-lg text-sm font-bold ${acceptMsg.includes('Success') || acceptMsg.includes('linked') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {acceptMsg}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!acceptCode}
                            className="w-full py-4 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold rounded-xl hover:brightness-110 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Link Parent
                        </button>
                    </form>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0f172a] border border-white/10 p-8 rounded-2xl max-w-sm w-full relative">
                        <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                        {!inviteCodeResult ? (
                            <>
                                <h2 className="text-2xl font-bold mb-2">Invite Child</h2>
                                <p className="text-gray-400 mb-6 text-sm">Enter their email to generate a secure invite code.</p>
                                <form onSubmit={handleInvite}>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full p-4 mb-4 bg-black/30 border border-white/10 rounded-xl focus:border-[var(--accent-primary)] focus:outline-none"
                                        placeholder="child@example.com"
                                        required
                                    />

                                    {inviteMsg && (
                                        <div className="mb-4 p-3 rounded-lg text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                                            {inviteMsg}
                                        </div>
                                    )}

                                    <button type="submit" className="w-full py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold rounded-xl hover:brightness-110">
                                        Generate Code
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400 text-3xl">✓</div>
                                <h2 className="text-xl font-bold mb-2">Invite Created!</h2>
                                <p className="text-gray-400 mb-6 text-sm">Share this code with your child:</p>

                                <div className="p-4 bg-black/30 rounded-xl border border-white/10 font-mono text-3xl font-bold tracking-[0.2em] mb-6 select-all cursor-pointer hover:bg-black/40 transition-colors" onClick={() => navigator.clipboard.writeText(inviteCodeResult)}>
                                    {inviteCodeResult}
                                </div>

                                <button onClick={() => { setInviteCodeResult(''); setShowInviteModal(false); }} className="w-full py-3 bg-white/10 hover:bg-white/20 font-bold rounded-xl">
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Family;
