import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
// import { useEffect } from "react";
import Navbar from "./Navbar";
import Aside from "./Aside";
// import Footer from "./Footer";
// import "./styles/general/general.css";
import './styles/event/event.css'
// import { PersonLinesFill, CalendarEvent } from "react-bootstrap-icons";

const ViewEvent = () => {
  const { logout } = useLogout();
  const history = useHistory();



  const HandleClick = () => {
    logout();
    history.push("/cordportal");
  };

//   const HandleChange = (e) => {
    
//   };

  return (
    <div className="ViewEvent">
      <Navbar clickF={HandleClick} />
      <Aside />
      <main>
        view Event 
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default ViewEvent;
