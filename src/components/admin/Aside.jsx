import { NavLink } from "react-router-dom";
import {
  Speedometer2,PersonBadgeFill,
  PlusSquare,
  Book,
  PatchQuestion,
  CloudUpload,
  People,
  ClipboardCheck,
  BarChart,
  CreditCard2Front,
  Gear
} from "react-bootstrap-icons";
import "./styles/aside/aside.scss";
import { useAuthContext } from "../../hooks/useAuthContext";

const Aside = () => {
  const { admin } = useAuthContext();
  return (
    <div className="aside">
      {/* <div className="border"> */}
      <div className="nameControl">
          {admin && admin.image ? (
        <img crossOrigin="anonymous" src={`${window.location.origin}${admin.image}`} alt="Admin Profile" />
      ) : (
        <PersonBadgeFill style={{ height: "90px", width: "100px" }} />
      )}
      </div>

      <div className="aside-links">
        <NavLink to="/admin" name="dashboard">
          <Speedometer2 size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/create-class" name="createClass">
          <PlusSquare size={20} />
          <span>Create Class</span>
        </NavLink>

        <NavLink to="/subject" name="subject">
          <Book size={20} />
          <span>Subjects</span>
        </NavLink>

        <NavLink to="/question" name="question">
          <PatchQuestion size={20} />
          <span>Questions</span>
        </NavLink>

        <NavLink to="/upload-question" name="uploadQuestion">
          <CloudUpload size={20} />
          <span>Upload</span>
        </NavLink>

        <NavLink to="/student" name="student">
          <People size={20} />
          <span>Candidates</span>
        </NavLink>

        <NavLink to="/registered" name="registered">
          <ClipboardCheck size={20} />
          <span>Enrolled Candidates</span>
        </NavLink>

        <NavLink to="/result" name="result">
          <BarChart size={20} />
          <span>Result</span>
        </NavLink>

        <NavLink to="/scratchcard" name="scratchcard">
          <CreditCard2Front size={20} />
          <span>Scratchcards</span>
        </NavLink>

        <NavLink to="/setting" name="setting">
          <Gear size={20} />
          <span>Settings</span>
        </NavLink>
      </div>

      <footer>
        Powered by <a href="https://www.aritron.com.ng" target="_blank" rel="noreferrer">www.AriTron.com.ng</a>
      </footer>
      {/* </div> */}
    </div>
  );
};

export default Aside;
