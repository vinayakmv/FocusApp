import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import walletService from '../services/walletService';
import tokenService from '../services/tokenService';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);

    const fetchBalances = async () => {
        if (user && user.token) {
            try {
                const walletData = await walletService.getBalance(user.token);
                const tokenData = await tokenService.getTokenBalance(user.token);
                setBalance(walletData.balance);
                setTokenBalance(tokenData.tokenBalance);
            } catch (error) {
                console.error("Failed to fetch balances", error);
            }
        }
    };

    useEffect(() => {
        fetchBalances();
    }, [user]);

    const refreshWallet = async () => {
        await fetchBalances();
    };

    return (
        <WalletContext.Provider value={{ balance, tokenBalance, refreshWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
