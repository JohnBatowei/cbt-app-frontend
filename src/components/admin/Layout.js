// Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Aside from "./Aside";
import "./styles/general/general.css";

const Layout = ({ handleClick }) => {
  return (
    <div className="admin">
      <Navbar clickF={handleClick} />
      <Aside />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
