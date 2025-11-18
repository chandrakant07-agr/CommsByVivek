import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

// Components
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import AdminLayout from './admin/components/Admin.Layout';
import PersistLogin from './admin/components/PersistLogin';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLoginRoute from './admin/components/AdminLoginRoute';

// Public and non-lazy loaded pages
import Testimonials from './pages/Testimonials';
import LandingPage from './pages/Landing.Page';
import Portfolio from './pages/Portfolio';
import Page404 from './pages/Page404';

// ---------------------------------
// Lazy loaded components
// ---------------------------------

// public page
const Contact = lazy(() => import('./pages/Contact'));
const RateProject = lazy(() => import('./pages/RateProject'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

// admin pages
const Login = lazy(() => import('./admin/pages/Login'));
const Backup = lazy(() => import('./admin/pages/Backup'));
const Gallery = lazy(() => import('./admin/pages/Gallery'));
const Profile = lazy(() => import('./admin/pages/Profile'));
const Messages = lazy(() => import('./admin/pages/Messages'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const HeroBanner = lazy(() => import('./admin/pages/HeroBanner'));
const ContactInfo = lazy(() => import('./admin/pages/ContactInfo'));
const ProjectType = lazy(() => import('./admin/pages/ProjectType'));
const MessageDetail = lazy(() => import('./admin/pages/MessageDetail'));
const ReviewManagement = lazy(() => import('./admin/pages/ReviewManagement'));

// Styles
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
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
                autoClose={5000}
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
                    <Route path="/contact" element={
                        <Suspense fallback={<LoadingSpinner color="var(--accent-color)" />}>
                            <Contact />
                        </Suspense>
                    } />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/rate-project/:token" element={
                        <Suspense fallback={<LoadingSpinner color="var(--accent-color)" />}>
                            <RateProject />
                        </Suspense>
                    } />
                    <Route path="/privacy-policy" element={
                        <Suspense fallback={<LoadingSpinner color="var(--accent-color)" />}>
                            <PrivacyPolicy />
                        </Suspense>
                    } />
                    <Route path="*" element={<Page404 />} />
                </Route>
                <Route path="/admin" element={<PersistLogin />}>
                    <Route element={<AdminLoginRoute />}>
                        <Route index element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <Login />
                            </Suspense>
                        } />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="gallery" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <Gallery />
                                </Suspense>
                            } />
                            <Route path="backup" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <Backup />
                                </Suspense>
                            } />
                            <Route path="profile" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <Profile />
                                </Suspense>
                            } />
                            <Route path="messages" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <Messages />
                                </Suspense>
                            } />
                            <Route path="dashboard" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <Dashboard />
                                </Suspense>
                            } />
                            <Route path="heroBanner" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <HeroBanner />
                                </Suspense>
                            } />
                            <Route path="contactInfo" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <ContactInfo />
                                </Suspense>
                            } />
                            <Route path="projectType" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <ProjectType />
                                </Suspense>
                            } />
                            <Route path="messages/:status" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <Messages />
                                </Suspense>
                            } />
                            <Route path="messageView/:id" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <MessageDetail />
                                </Suspense>
                            } />
                            <Route path="review" element={
                                <Suspense fallback={<LoadingSpinner />}>
                                    <ReviewManagement />
                                </Suspense>
                            } />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;