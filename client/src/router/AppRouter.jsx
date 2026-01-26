import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Wallet from '../pages/Wallet'
import CreateTarget from '../pages/CreateTarget'
import FocusSession from '../pages/FocusSession'
import Family from '../pages/Family' // Module 1
import Rewards from '../pages/Rewards'
import Partnerships from '../pages/Partnerships'
import Reports from '../pages/Reports' // Module 6
import Settings from '../pages/Settings'

import Layout from '../components/Layout/Layout'

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><Layout><Wallet /></Layout></PrivateRoute>} />
            <Route path="/create-target" element={<PrivateRoute><Layout><CreateTarget /></Layout></PrivateRoute>} />
            <Route path="/session/:id" element={<PrivateRoute><Layout><FocusSession /></Layout></PrivateRoute>} />
            <Route path="/rewards" element={<PrivateRoute><Layout><Rewards /></Layout></PrivateRoute>} />
            <Route path="/family" element={<PrivateRoute><Layout><Family /></Layout></PrivateRoute>} />
            <Route path="/partnerships" element={<PrivateRoute><Layout><Partnerships /></Layout></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
        </Routes>
    )
}

export default AppRouter
