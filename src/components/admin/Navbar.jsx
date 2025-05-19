import React, { useState } from "react";
import {
  PersonBadgeFill, List, HouseDoorFill, Speedometer2, PlusSquare,
  Book, PatchQuestion, CloudUpload, People, ClipboardCheck,
  BarChart, CreditCard2Front, Gear
} from "react-bootstrap-icons";
import { useAuthContext } from "../../hooks/useAuthContext";
import { NavLink } from "react-router-dom";
import "./styles/nav/nav.scss";

const Navbar = ({ clickF }) => {
  const { admin } = useAuthContext();
  const [showSidebar, setShowSidebar] = useState(false); // toggle state

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div className="nav">
      <div className="nameControl">
        <span className="list" onClick={toggleSidebar}>
          <List size={24} />
        </span>
        <p>
          {admin.name || 'Loading...'}
          <p style={{ color: '#fdbbe9', fontSize: '10px' }}>
            {admin.email || 'Loading...'}
          </p>
        </p>
      </div>

      <div className="logcontrol">
        <NavLink to="/admin" name="dashboard">
          <span><HouseDoorFill size={24} /></span>
        </NavLink>
        <button onClick={clickF}>
          Log out
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" className="bi bi-power" viewBox="0 0 16 16">
            <path d="M7.5 1v7h1V1z" />
            <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812" />
          </svg>
        </button>
      </div>

      {admin && admin.image ? (
        <img crossOrigin="anonymous" src={`${window.location.origin}${admin.image}`} alt="Admin Profile" />
      ) : (
        <PersonBadgeFill style={{ height: "90px", width: "100px" }} />
      )}

      {/* Sidebar: mobile toggle visibility */}
      <div className={`asideN ${showSidebar ? "showSidebar" : ""}`}>
        <div className="aside-links" onClick={e => e.stopPropagation()}>
        <div className="closeBtWrap"><button className="closeAside" onClick={()=>{setShowSidebar(false)}}>X</button></div>
          <button className="asideLogouts" onClick={clickF}>
            Logout
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              fill="currentColor" className="bi bi-power" viewBox="0 0 16 16">
              <path d="M7.5 1v7h1V1z" />
              <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812" />
            </svg>
          </button>

          <NavLink to="/admin"><Speedometer2 size={20} /><span>Dashboard</span></NavLink>
          <NavLink to="/create-class"><PlusSquare size={20} /><span>Create Class</span></NavLink>
          <NavLink to="/subject"><Book size={20} /><span>Subjects</span></NavLink>
          <NavLink to="/question"><PatchQuestion size={20} /><span>Questions</span></NavLink>
          <NavLink to="/upload-question"><CloudUpload size={20} /><span>Upload</span></NavLink>
          <NavLink to="/student"><People size={20} /><span>Candidates</span></NavLink>
          <NavLink to="/registered"><ClipboardCheck size={20} /><span>Enrolled Candidates</span></NavLink>
          <NavLink to="/result"><BarChart size={20} /><span>Result</span></NavLink>
          <NavLink to="/scratchcard"><CreditCard2Front size={20} /><span>Scratchcards</span></NavLink>
          <NavLink to="/setting"><Gear size={20} /><span>Settings</span></NavLink>
        </div>

        <footer>
          Powered by <a href="https://www.aritron.com.ng" target="_blank" rel="noreferrer">www.AriTron.com.ng</a>
        </footer>
      </div>
    </div>
  );
};

export default Navbar;
