import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import FilmedByVivek from './pages/FilmedByVivek';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Page404 from './pages/Page404';

import './App.css';

function App() {
    return (
        <ThemeProvider>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Home />
                            <About />
                            <Services />
                            <FilmedByVivek />
                        </>
                    } />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </main>
            <Footer />
        </ThemeProvider>
    );
}

export default App;