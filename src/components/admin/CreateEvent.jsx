import { Link, useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
// import { useEffect } from "react";
import Navbar from "./Navbar";
import Aside from "./Aside";
// import Footer from "./Footer";
// import "./styles/general/general.css";
import './styles/event/event.css'
import { PersonLinesFill, CalendarEvent } from "react-bootstrap-icons";

const Event = () => {
  const { logout } = useLogout();
  const history = useHistory();



  const HandleClick = () => {
    logout();
    history.push("/cordportal");
  };

//   const HandleChange = (e) => {
    
//   };

  return (
    <div className="Event">
      <Navbar clickF={HandleClick} />
      <Aside />
      <main>
        <Link to={""}>
          <PersonLinesFill style={{height:'90px', width:'100px'}} /> <span>Create Event</span>
        </Link>
        <Link to={""}>
          <CalendarEvent style={{height:'90px', width:'100px'}} /> <span>View Event</span>
        </Link>  
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Event;
