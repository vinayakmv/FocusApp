import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionService from '../services/sessionService';
import { useAuth } from '../context/AuthContext';

const FocusSession = () => {
    const { id } = useParams(); // targetId
    const { user } = useAuth();
    const navigate = useNavigate();

    // Session State
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('STOPWATCH'); // STOPWATCH, POMODORO, COUNTDOWN
    const [seconds, setSeconds] = useState(0);
    const [initialTime, setInitialTime] = useState(0); // For progress calculation
    const [sessionId, setSessionId] = useState(null);
    const [msg, setMsg] = useState('');

    // Anti-Cheat State
    const [distractedSeconds, setDistractedSeconds] = useState(0);
    const [showDistractionModal, setShowDistractionModal] = useState(false);

    // Metrics State
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [effortRating, setEffortRating] = useState('NORMAL');

    const distractionTimerRef = useRef(null);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prev => {
                    if (mode === 'STOPWATCH') {
                        return prev + 1;
                    } else {
                        // Countdown Logic
                        if (prev <= 0) {
                            // Timer Finished
                            clearInterval(interval);
                            setIsActive(false);
                            setMsg('Session Complete!');
                            setShowRatingModal(true); // Auto-finish
                            return 0;
                        }
                        return prev - 1;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, mode]);

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
    };

    const toggleTimer = async () => {
        if (!isActive) {
            // Start Session
            try {
                // Initialize Time based on mode IF starting fresh
                if (seconds === 0 && mode !== 'STOPWATCH') {
                    // Only set default if valid time isn't set (handled by logic below)
                    // Actually, for Pomodoro/Countdown, we set time BEFORE starting usually.
                    // But here we set it on "Start" if it's 0.
                    if (mode === 'POMODORO') setSeconds(25 * 60);
                    if (mode === 'COUNTDOWN') setSeconds(10 * 60);
                }

                const data = await sessionService.startSession(id, user.token);
                setSessionId(data._id);
                setIsActive(true);
                setMsg('Focus Mode On');
                setTimeout(() => setMsg(''), 3000);
                setDistractedSeconds(0);

                // Set initial time for progress calculations
                if (mode === 'STOPWATCH') setInitialTime(0);
                else setInitialTime(seconds > 0 ? seconds : (mode === 'POMODORO' ? 1500 : 600));

            } catch (error) {
                setMsg('Failed to start session');
            }
        } else {
            // Stop Session -> Ask for Rating
            setIsActive(false);
            setShowRatingModal(true);
        }
    };

    const handleModeChange = (newMode) => {
        if (isActive) return; // Lock change while active
        setMode(newMode);
        if (newMode === 'STOPWATCH') setSeconds(0);
        if (newMode === 'POMODORO') setSeconds(25 * 60);
        if (newMode === 'COUNTDOWN') setSeconds(10 * 60); // Default 10m
    };

    const submitSession = async () => {
        if (sessionId) {
            try {
                // Duration in minutes
                // For Stopwatch: seconds / 60
                // For Countdown: (initialTime - seconds) / 60
                let duration = 0;
                if (mode === 'STOPWATCH') {
                    duration = Math.floor(seconds / 60);
                } else {
                    duration = Math.floor((initialTime - seconds) / 60);
                }

                // Valid duration check
                if (duration < 1) duration = 1; // Min 1 minute credit

                await sessionService.endSession({ sessionId, duration, effortRating }, user.token);
                navigate('/dashboard');
            } catch (error) {
                setMsg('Failed to save session');
                setTimeout(() => setMsg(''), 3000);
            }
        }
    };

    const handleDistractionReason = (reason) => {
        setShowDistractionModal(false);
        setDistractedSeconds(0);
    };

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden text-[var(--text-primary)]">
            {/* Ambient Background */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[100px] rounded-full pointer-events-none transition-colors duration-1000 ${isActive ? 'bg-[var(--accent-primary)]/20' : 'bg-gray-600/10'}`}></div>

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
                    <div className="glass-panel p-8 rounded-2xl max-w-sm w-full text-center border-[var(--accent-primary)] border-2">
                        <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
                        <p className="mb-6 text-gray-400">How would you rate your focus?</p>
                        <div className="space-y-3">
                            {['EASY', 'NORMAL', 'HARD', 'DISTRACTED'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => { setEffortRating(r); setTimeout(submitSession, 500); }}
                                    className="w-full p-4 bg-white/5 hover:bg-[var(--accent-primary)]/20 border border-white/10 hover:border-[var(--accent-primary)] rounded-xl font-bold transition-all flex justify-between items-center group"
                                >
                                    <span>{r}</span>
                                    <span className="opacity-0 group-hover:opacity-100">➡️</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Mode Switcher */}
            <div className="z-10 mb-6 flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
                {['STOPWATCH', 'POMODORO', 'COUNTDOWN'].map((m) => (
                    <button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        disabled={isActive}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === m
                            ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {m === 'STOPWATCH' ? 'Stopwatch' : m === 'POMODORO' ? 'Pomodoro' : 'Countdown'}
                    </button>
                ))}
            </div>

            {/* Timer Circle */}
            <div className={`glass-panel p-6 rounded-full w-[40vh] h-[40vh] max-w-[300px] max-h-[300px] flex flex-col items-center justify-center border-4 relative z-10 shadow-[0_0_50px_rgba(var(--accent-primary-rgb),0.2)] transition-all duration-500 ${isActive ? 'border-[var(--accent-primary)] scale-105' : 'border-[var(--glass-border)]'}`}>
                <div className="text-center">
                    <div className="text-6xl sm:text-7xl font-mono font-black tracking-tighter text-[var(--text-primary)] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {formatTime(seconds)}
                    </div>
                    <p className="text-[var(--accent-secondary)] mt-2 font-medium tracking-widest uppercase text-xs opacity-80">
                        {mode === 'POMODORO' ? '25 Min Focus' : mode === 'COUNTDOWN' ? 'Target Time' : 'Deep Work'}
                    </p>
                </div>

                {/* Time Adjustment Controls (Only for Countdown & Inactive) */}
                {!isActive && mode === 'COUNTDOWN' && (
                    <div className="absolute bottom-8 flex gap-4 animate-fade-in">
                        <button
                            onClick={() => setSeconds(s => Math.max(60, s - 60))}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg font-bold transition-all"
                            title="Decrease 1m"
                        >-</button>
                        <button
                            onClick={() => setSeconds(s => s + 60)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg font-bold transition-all"
                            title="Increase 1m"
                        >+</button>
                    </div>
                )}
            </div>

            {/* Status Message */}
            {msg && <div className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white/80 text-sm font-medium backdrop-blur-md animate-fade-in z-10">{msg}</div>}

            {/* Controls */}
            <div className="mt-6 z-10">
                {!sessionId ? (
                    <button
                        onClick={toggleTimer}
                        className="px-8 py-3 bg-[var(--accent-primary)] rounded-xl text-lg font-bold shadow-lg text-[var(--bg-primary)] hover:brightness-110 transition-all hover:-translate-y-1"
                    >
                        ▶ Start {mode === 'STOPWATCH' ? 'Focus' : mode === 'POMODORO' ? 'Pomo' : 'Timer'}
                    </button>
                ) : (
                    !showRatingModal && (
                        <button
                            onClick={toggleTimer}
                            className="group relative px-8 py-3 rounded-xl text-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl bg-red-500 hover:bg-red-400 text-white"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                ⏹ End Session
                            </span>
                        </button>
                    )
                )}
            </div>

            <p className="mt-6 text-gray-500 text-[10px] text-center max-w-md z-10 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                ⚠️ Leaving this app for >30s fails the session.
            </p>
        </div>
    )
}

export default FocusSession;
