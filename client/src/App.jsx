import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import { AuthProvider } from './context/AuthContext'
import { WalletProvider } from './context/WalletContext'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <WalletProvider>
                    <AppRouter />
                </WalletProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
