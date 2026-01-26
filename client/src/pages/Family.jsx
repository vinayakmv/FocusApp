import { useState, useEffect } from 'react';
import familyService from '../services/familyService';
import { useAuth } from '../context/AuthContext';

const Family = () => {
    const { user } = useAuth();
    const [children, setChildren] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteCode, setInviteCode] = useState(''); // For child accepting
    const [generatedCode, setGeneratedCode] = useState(null); // For parent display
    const [msg, setMsg] = useState('');

    // Assign Target Form
    const [targetForm, setTargetForm] = useState({ childId: '', name: '', goal: 1, expiryDate: '' });

    useEffect(() => {
        if (user?.token && user?.ageGroup === 'ADULT') {
            fetchChildren();
        }
    }, [user]);

    const fetchChildren = async () => {
        try {
            const data = await familyService.getChildren(user.token);
            setChildren(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            const res = await familyService.inviteChild(inviteEmail, user.token);
            setGeneratedCode(res.inviteCode);
            setMsg(`Invite generated for ${res.childEmail}`);
        } catch (error) {
            setMsg('Failed to invite');
        }
    };

    const handleAccept = async () => {
        try {
            await familyService.acceptInvite(inviteCode, user.token);
            setMsg('Linked successfully! You can now receive tasks.');
        } catch (error) {
            setMsg('Invalid code');
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await familyService.assignTarget(targetForm, user.token);
            setMsg('Target assigned successfully');
            setTargetForm({ ...targetForm, name: '', goal: 1 });
        } catch (error) {
            setMsg('Failed to assign target');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">Family & Relationships</h1>

            {msg && <div className="glass-panel p-4 text-center text-pink-300 border-l-4 border-pink-500">{msg}</div>}

            {/* PARENT VIEW */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Invite Child</h2>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <input
                            type="email"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            placeholder="Child's Email"
                            className="w-full p-3 bg-black/40 rounded-xl border border-white/10 text-white"
                        />
                        <button className="w-full py-3 bg-pink-600 rounded-xl font-bold hover:bg-pink-500 transition-all">Generate Code</button>
                    </form>
                    {generatedCode && (
                        <div className="mt-4 p-4 bg-white/10 rounded-xl text-center">
                            <p className="text-sm text-gray-400">Share this code:</p>
                            <p className="text-3xl font-mono font-bold text-white tracking-widest">{generatedCode}</p>
                        </div>
                    )}
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Join Family</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={e => setInviteCode(e.target.value)}
                            placeholder="Enter 6-digit Code"
                            className="w-full p-3 bg-black/40 rounded-xl border border-white/10 text-white font-mono text-center tracking-widest"
                            maxLength={6}
                        />
                        <button onClick={handleAccept} className="w-full py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all">Accept Invite</button>
                    </div>
                </div>
            </div>

            {/* MY CHILDREN LIST */}
            {children.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-6">My Children</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {children.map(child => (
                            <div key={child._id} className="bg-black/40 p-4 rounded-xl border border-white/5">
                                <h3 className="font-bold text-lg">{child.name}</h3>
                                <p className="text-sm text-gray-400">{child.email}</p>
                                <div className="mt-4 flex gap-2 text-sm">
                                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">₹{child.walletBalance}</span>
                                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">{child.tokenBalance} T</span>
                                </div>

                                <button
                                    onClick={() => setTargetForm({ ...targetForm, childId: child._id })}
                                    className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-sm"
                                >
                                    Assign Task
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ASSIGN TASK MODAL/SECTION */}
            {targetForm.childId && (
                <div className="glass-panel p-6 rounded-2xl border-t border-blue-500/50">
                    <h2 className="text-xl font-bold text-white mb-4">Assign Target</h2>
                    <form onSubmit={handleAssign} className="space-y-4">
                        <input
                            value={targetForm.name}
                            onChange={e => setTargetForm({ ...targetForm, name: e.target.value })}
                            placeholder="Task Name"
                            className="w-full p-3 bg-black/40 rounded-xl border border-white/10 text-white"
                        />
                        <div className="flex gap-4">
                            <input
                                type="number"
                                value={targetForm.goal}
                                onChange={e => setTargetForm({ ...targetForm, goal: e.target.value })}
                                placeholder="Hours"
                                className="flex-1 p-3 bg-black/40 rounded-xl border border-white/10 text-white"
                            />
                            <input
                                type="datetime-local"
                                value={targetForm.expiryDate}
                                onChange={e => setTargetForm({ ...targetForm, expiryDate: e.target.value })}
                                className="flex-1 p-3 bg-black/40 rounded-xl border border-white/10 text-white"
                            />
                        </div>
                        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold">Assign Now</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Family;
