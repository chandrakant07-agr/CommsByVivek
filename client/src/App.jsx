import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import Layout from './components/Layout';
import LandingPage from './pages/Landing.Page';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Page404 from './pages/Page404';

import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import Messages from './admin/pages/Messages';
import MessageDetail from './admin/pages/MessageDetail';
import Profile from './admin/pages/Profile';
import AdminLayout from './admin/components/Admin.Layout';
import ProjectType from './admin/pages/ProjectType';
import ContactInfo from './admin/pages/ContactInfo';
import PortfolioAdmin from './admin/pages/Portfolio';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={isDarkMode ? "dark" : "light"}
            />
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
                        <Route path="messages/:status" element={<Messages />} />
                        <Route path="messageView/:id" element={<MessageDetail />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="projectType" element={<ProjectType />} />
                        <Route path="contactInfo" element={<ContactInfo />} />
                        <Route path="portfolio" element={<PortfolioAdmin />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;