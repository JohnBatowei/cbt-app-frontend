import { Redirect, Route } from "react-router-dom";
// import Cookies from 'js-cookie';

function ProtectedStudentRoute({ component: Component, ...rest }) {
  // const isAuthenticated = !!Cookies.get('studentExamCookie'); // Check if the cookie is present

  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("student")
          ? <Component {...props} />
          : <Redirect
              to={{ pathname: "/Examportal", state: { from: props.location } }}
            />}
    />
  );
}

export default ProtectedStudentRoute;
