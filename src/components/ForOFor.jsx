import { NavLink } from "react-router-dom";
import "./ForOFor.scss";

const ForOFor = () => {
  return (
    <div className="forOfor">
      <div className="error-container">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <NavLink to="/" className="home-link">
          Go Back Home
        </NavLink>
      </div>
    </div>
  );
};

export default ForOFor;
