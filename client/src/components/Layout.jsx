import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
    return (
        <>
            <Header />
            <main className="mt-17 mb-10">
                <Outlet />
            </main>
            <ScrollToTop />
            <Footer />
        </>
    );
};

export default Layout;