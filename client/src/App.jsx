import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from './components/Layout';
import LandingPage from './pages/Landing.Page';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Page404 from './pages/Page404';

import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import AdminLayout from './admin/components/Admin.Layout';

import './App.css';
import Messages from './admin/pages/Messages';
import Profile from './admin/pages/Profile';

function App() {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="*" element={<Page404 />} />
                </Route>
                <Route path="/admin">
                    <Route index element={<Login />} />
                    <Route element={<AdminLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                    {/* Add other admin routes here */}
                </Route>
            </Routes>
        </>
    );
}

export default App;