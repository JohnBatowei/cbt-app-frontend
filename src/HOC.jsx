import { Redirect, Route } from "react-router-dom";

 function ProtectedAdminRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("admin")
          ? <Component {...props} />
          : <Redirect
              to={{ pathname: "/cordportal", state: { from: props.location } }}
            />}
    />
  );
}

export default ProtectedAdminRoute