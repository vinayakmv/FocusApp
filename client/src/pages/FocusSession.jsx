import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionService from '../services/sessionService';
import { useAuth } from '../context/AuthContext';

const FocusSession = () => {
    const { id } = useParams(); // targetId
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [msg, setMsg] = useState('');

    // Anti-Cheat State
    const [distractedSeconds, setDistractedSeconds] = useState(0);
    const [showDistractionModal, setShowDistractionModal] = useState(false);

    // Metrics State
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [effortRating, setEffortRating] = useState('NORMAL');

    const timerRef = useRef(null);
    const distractionTimerRef = useRef(null);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    // Anti-Cheat: Visibility Listener
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (isActive) {
                if (document.hidden) {
                    // User left tab -> Start counting distraction
                    distractionTimerRef.current = setInterval(() => {
                        setDistractedSeconds(d => {
                            if (d > 30) {
                                // Too long -> Kill session
                                handleForceStop("Distracted for too long (>30s)");
                                return d;
                            }
                            return d + 1;
                        });
                    }, 1000);
                } else {
                    // User returned -> Stop counting
                    if (distractionTimerRef.current) clearInterval(distractionTimerRef.current);
                    if (distractedSeconds > 0 && distractedSeconds <= 30) {
                        // Show warning or modal asking why
                        setShowDistractionModal(true);
                    }
                }
            }
        };

        const handleBeforeUnload = (e) => {
            if (isActive) {
                e.preventDefault();
                e.returnValue = ''; // Trigger browser confirmation
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (distractionTimerRef.current) clearInterval(distractionTimerRef.current);
        };
    }, [isActive, distractedSeconds]);

    const handleForceStop = async (reason) => {
        setIsActive(false);
        clearInterval(distractionTimerRef.current);
        setMsg(`Session Failed: ${reason}`);
        // Logic to mark session as invalid in backend could go here
    };

    const toggleTimer = async () => {
        if (!isActive) {
            // Start Session
            try {
                const data = await sessionService.startSession(id, user.token);
                setSessionId(data._id);
                setIsActive(true);
                setMsg('Focus Mode On');
                setDistractedSeconds(0);
                // Timer starts automatically via useEffect
            } catch (error) {
                setMsg('Failed to start session');
            }
        } else {
            // Stop Session -> Ask for Rating
            setIsActive(false);
            setShowRatingModal(true);
        }
    };

    const submitSession = async () => {
        if (sessionId) {
            try {
                // Duration in minutes
                const duration = Math.floor(seconds / 60);
                await sessionService.endSession({ sessionId, duration, effortRating }, user.token);
                navigate('/dashboard');
            } catch (error) {
                setMsg('Failed to save session');
            }
        }
    };

    const handleDistractionReason = (reason) => {
        setShowDistractionModal(false);
        setDistractedSeconds(0);
        // Ideally log this reason to backend 'updateSession' endpoint
    };

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] relative text-white">
            {/* Ambient Background */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[100px] rounded-full pointer-events-none transition-colors duration-1000 ${isActive ? 'bg-blue-600/20' : 'bg-gray-600/10'}`}></div>

            {/* Distraction Modal */}
            {showDistractionModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="glass-panel p-8 rounded-2xl max-w-sm w-full text-center border-red-500/30 border-2">
                        <h2 className="text-2xl font-bold mb-4 text-red-400">Distraction Detected!</h2>
                        <p className="mb-6 text-gray-300">You left the app for {distractedSeconds}s. Why?</p>
                        <div className="grid grid-cols-2 gap-4">
                            {['Bored', 'Tired', 'Urgent', 'Accident'].map(r => (
                                <button key={r} onClick={() => handleDistractionReason(r)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">{r}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="glass-panel p-8 rounded-2xl max-w-sm w-full text-center border-green-500/30 border-2">
                        <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
                        <p className="mb-6 text-gray-400">How would you rate your focus?</p>
                        <div className="space-y-3">
                            {['EASY', 'NORMAL', 'HARD', 'DISTRACTED'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => { setEffortRating(r); setTimeout(submitSession, 500); }}
                                    className="w-full p-4 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500 rounded-xl font-bold transition-all flex justify-between items-center group"
                                >
                                    <span>{r}</span>
                                    <span className="opacity-0 group-hover:opacity-100">➡️</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 z-10">
                {isActive ? 'Deep Focus' : 'Focus Session'}
            </h1>

            <div className={`glass-panel p-10 rounded-full w-[350px] h-[350px] flex items-center justify-center border-4 relative z-10 shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all duration-500 ${isActive ? 'border-blue-500/50 scale-105' : 'border-white/10'}`}>
                <div className="text-center">
                    <div className="text-8xl font-mono font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {formatTime(seconds)}
                    </div>
                    {isActive && (
                        <p className="text-blue-400 mt-2 font-medium tracking-widest uppercase text-sm animate-pulse">Session Active</p>
                    )}
                </div>
            </div>

            {msg && <div className="mt-8 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 font-bold backdrop-blur-md animate-bounce z-10">{msg}</div>}

            <div className="mt-12 z-10">
                {!sessionId ? (
                    <button
                        onClick={toggleTimer}
                        className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-1"
                    >
                        ▶ Start Session
                    </button>
                ) : (
                    !showRatingModal && (
                        <button
                            onClick={toggleTimer}
                            className="group relative px-10 py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-2xl bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                ⏹ End Session
                            </span>
                        </button>
                    )
                )}
            </div>

            <p className="mt-8 text-gray-500 text-xs text-center max-w-md z-10 bg-black/50 px-4 py-2 rounded-full border border-white/5">
                ⚠️ Leaving this app for more than 30s will fail the session.
            </p>
        </div>
    )
}

export default FocusSession;


