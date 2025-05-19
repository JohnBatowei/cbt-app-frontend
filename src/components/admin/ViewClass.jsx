import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
// import { useEffect } from "react";
import Navbar from "./Navbar";
import Aside from "./Aside";
// import Footer from "./Footer";
// import "./styles/general/general.css";
import './styles/event/event.css'
// import { PersonLinesFill, CalendarEvent } from "react-bootstrap-icons";

const ViewClass = () => {
  const { logout } = useLogout();
  const history = useHistory();



  const HandleClick = () => {
    logout();
    history.push("/cordportal");
  };

//   const HandleChange = (e) => {
    
//   };

  return (
    <div className="ViewClass">
      <Navbar clickF={HandleClick} />
      <Aside />
      <main>
        view class 
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default ViewClass;
