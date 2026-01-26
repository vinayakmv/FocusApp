import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import walletService from '../services/walletService';
import tokenService from '../services/tokenService';

const Wallet = () => {
    const { balance, tokenBalance, refreshWallet } = useWallet();
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [msg, setMsg] = useState('');

    // Force Body Background to Black for this page only
    useEffect(() => {
        const originalBodyStyle = document.body.style.background;
        const originalHtmlStyle = document.documentElement.style.background;

        // Override the gradient background completely
        document.body.style.background = '#020617';
        document.documentElement.style.background = '#020617';

        return () => {
            document.body.style.background = originalBodyStyle;
            document.documentElement.style.background = originalHtmlStyle;
        };
    }, []);

    const handleAddMoney = async () => {
        if (!amount || amount <= 0) return;
        try {
            // 1. Create Order
            const order = await walletService.addMoney(amount, user.token);

            // 2. Open Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RwgMfvLHtHlumx', // Use env or fallback to user's key
                amount: order.amount,
                currency: order.currency,
                name: "Studification",
                description: "Add Funds to Wallet",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        await walletService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: amount
                        }, user.token);

                        setMsg('Money Added Successfully! 🎉');
                        setAmount('');
                        refreshWallet();
                    } catch (err) {
                        console.error(err);
                        setMsg('Verification Failed');
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email,
                },
                theme: {
                    color: "#22c55e"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                setMsg('Payment Failed: ' + response.error.description);
            });
            rzp1.open();

        } catch (error) {
            console.error(error);
            setMsg('Failed to initiate payment');
        }
    };

    const handleBuyTokens = async () => {
        if (!tokenAmount) return;
        try {
            await tokenService.buyTokens(tokenAmount, user.token);
            refreshWallet();
            setMsg(`Bought ${tokenAmount} Tokens`);
        } catch (error) {
            setMsg('Failed to buy tokens');
        }
    }

    return (
        <div className="space-y-8 relative min-h-screen w-full text-white p-4 sm:p-8" style={{ backgroundColor: '#020617' }}>
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[100px]"></div>
            </div>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Wallet</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Balance Card */}
                <div className="glass-panel p-8 rounded-2xl border-t border-green-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-green-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Balance</h2>
                    <p className="text-5xl font-bold text-white mb-2">₹{balance.toLocaleString()}</p>
                    <p className="text-xs text-green-400/80 mt-1">Available for Staking</p>
                </div>

                {/* Token Card */}
                <div className="glass-panel p-8 rounded-2xl border-t border-yellow-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-yellow-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Focus Tokens</h2>
                    <p className="text-5xl font-bold text-yellow-400 mb-2">{tokenBalance.toLocaleString()} <span className="text-2xl text-yellow-600">T</span></p>
                    <p className="text-xs text-yellow-400/80 mt-1">Earned from consistency</p>
                </div>
            </div>

            {msg && <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-center text-sm font-medium animate-pulse">{msg}</div>}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Add Money Section */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                        <span className="bg-green-500/20 text-green-400 p-1.5 rounded-lg text-sm">₹</span> Add Funds
                    </h3>
                    <div className="flex gap-3">
                        <input type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Amount"
                            className="flex-1 p-3 bg-black/40 rounded-xl border border-white/10 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-white placeholder-gray-600"
                        />
                        <button onClick={handleAddMoney} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-all">
                            Add
                        </button>
                    </div>
                </div>

                {/* Buy Tokens Section */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                        <span className="bg-yellow-500/20 text-yellow-400 p-1.5 rounded-lg text-sm">T</span> Buy Tokens
                    </h3>
                    <div className="flex gap-3">
                        <input type="number"
                            value={tokenAmount}
                            onChange={e => setTokenAmount(e.target.value)}
                            placeholder="Tokens to buy"
                            className="flex-1 p-3 bg-black/40 rounded-xl border border-white/10 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all text-white placeholder-gray-600"
                        />
                        <button onClick={handleBuyTokens} className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white px-6 rounded-xl font-bold shadow-lg shadow-yellow-900/20 active:scale-95 transition-all">
                            Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallet
