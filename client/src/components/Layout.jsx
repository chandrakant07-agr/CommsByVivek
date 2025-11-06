import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
    return (
        <>
            <Header />
            <main className="mt-19 mb-10">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;