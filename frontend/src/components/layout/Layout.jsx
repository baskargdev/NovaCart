import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />

      <main className="pb-20 lg:pb-0">
        <Outlet />
      </main>

      <Footer />

      <BottomNav />
    </>
  );
};

export default Layout;
