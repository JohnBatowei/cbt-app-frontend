import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./components/auth/AuthContext";
import { AuthContextProviderStudent } from "./components/auth/AuthStudentContext";
// import { AdminContext } from "./components/auth/AdminContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <AuthContextProviderStudent>
        {/* <AdminContext> */}
            <App />
        {/* </AdminContext> */}
    </AuthContextProviderStudent>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
