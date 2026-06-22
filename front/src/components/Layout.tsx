import { Outlet } from "react-router-dom";
import Footer from "./footer.tsx";
import Navbar from "./navbar.tsx";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default Layout;
