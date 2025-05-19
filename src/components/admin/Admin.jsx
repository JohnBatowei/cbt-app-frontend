import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Aside from "./Aside";
import "./styles/admin.scss";
import {  NavLink } from "react-router-dom";
import candidates from '../assets/male-student-studying-svgrepo-com.svg'
import result from '../assets/medical-result-svgrepo-com.svg'
import classgroup from '../assets/class-svgrepo-com.svg'
import subjetcs from '../assets/books-svgrepo-com.svg'
import question from '../assets/question-mark-svgrepo-com.svg'
import upload from '../assets/upload-svgrepo-com.svg'
import settings from '../assets/settings-alt-2-svgrepo-com (1).svg'
import registered from '../assets/student-reading-svgrepo-com.svg'
import scratchcard from '../assets/cards-sd-svgrepo-com.svg'

const Admin = () => {
  const { logout } = useLogout();
  const history = useHistory();

  useEffect(() => {
    return () => {};
  }, []);

  const HandleClick = () => {
    logout();
    history.push("/cordportal");
  };

  return (
    <div className="admin">
      <Navbar clickF={HandleClick} />
      <Aside />
      <main>
        <div className="welcome">

          <div className="group-containers">


            <NavLink to="/create-class" className="candidates">
            <div className="svg">
              <img src={classgroup} alt="" />
            </div>
              <h1>Create A Class</h1>
            </NavLink>

            <NavLink to="/subject" className="candidates">
            <div className="svg">
              <img src={subjetcs} alt="" />
            </div>
              <h1>Subjects</h1>
            </NavLink>

            <NavLink to="/question" className="candidates">
            <div className="svg">
              <img src={question} alt="" />
            </div>
              <h1>Questions</h1>
            </NavLink>

            <NavLink to="/upload-question" className="candidates">
            <div className="svg">
              <img src={upload} alt="" />
            </div>
              <h1>Upload Excel File</h1>
            </NavLink>

            <NavLink to="/student" className="candidates">
            <div className="svg">
              <img src={candidates} alt="" />
            </div>
              <h1>Register Candidate</h1>
            </NavLink>

            <NavLink to="/registered" className="candidates">
            <div className="svg">
              <img src={registered} alt="" />
            </div>
              <h1>Enrolled Candidates</h1>
            </NavLink>


            <NavLink to="/result" className="candidates">
            <div className="svg">
              <img src={result} alt="" />
            </div>
              <h1>Check Results</h1>
            </NavLink>

            <NavLink to="/scratchcard" className="candidates">
            <div className="svg">
              <img src={scratchcard} alt="" />
            </div>
              <h1>Create Scratch Cards</h1>
            </NavLink>

            <NavLink to="/setting" className="candidates">
            <div className="svg">
              <img src={settings} alt="" />
            </div>
              <h1>Settings</h1>
            </NavLink>

          </div>

        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Admin;
