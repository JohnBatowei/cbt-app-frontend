import "./styles/examPort.scss";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import {useAuthContext} from '../../hooks/useAuthContext'
import {ChevronDoubleLeft} from 'react-bootstrap-icons'
import axios from "axios";
// import Admin from "../admin/Admin";
// import Axios from "./Axios";
// const verify_url = '/verify'


const CordPortal = () => {


  // const {setAuth} = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  const [errMsg, setErrMsg] = useState("");
  // const [successMsg, setSuccessMsg] = useState(false);

  const { dispatch } = useAuthContext()
  const history = useHistory()

// Function to fetch CSRF token
// const fetchCsrfToken = async () => {
//   const response = await axios.get('http://localhost:3800/csrf-token', { withCredentials: true });
//   return response.data.csrfToken;
// };


const [headings,setHeadings] = useState('Coordinators Portal')

const getHeadings = async () => {
  try {
    // const res = await axios.get('http://localhost:3800/headings', {
    const res = await axios.get('/api/index/headings', {
      headers: { 'Content-Type':'application/json' },
    });

    if (res.status === 200 && res.data.data) {
      const headingData = res.data.data.find((data) => data.deff === 'coo');
      // console.log(headingData);

      // Update heading regardless of confirmation status
      if (headingData) {
        setHeadings(headingData.corPage || 'Coordinators Portal');
      }
    }
  } catch (error) {
    console.error('Error fetching headings:', error);
    setHeadings('Coordinators Portal');
  }
};


useEffect(() => {
  getHeadings();
}, []);


  const HandleSubmit = async event => {
    event.preventDefault();
    try {
      // const csrfToken = await fetchCsrfToken();
      const Form = { email, password };
      // const result = await axios.post("http://localhost:3800/verify", Form, {
      const result = await axios.post("/api/index/verify", Form, {
        headers: { "Content-Type": "application/json" },
        // headers: { "Content-Type": "application/json","X-CSRF-Token": csrfToken  },
        withCredentials: true
      });
  
      // Check if response is successful
      if (result.status === 200) {
        // Clear input fields
        console.log('Result data:', result.data);

        setEmail('');
        setPassword('');
  
        // Dispatch login action with the response data
        dispatch({ type: 'LOGIN', payload: result.data });
  
        // Store admin data in localStorage
        localStorage.setItem('admin', JSON.stringify(result.data));
  
        // Redirect to admin page
        history.push('/admin');
      } else {
        // Handle unsuccessful response
        // console.log(result.data)
        setErrMsg(result.data.message || 'An error occurred');
      }
    } catch (error) {
      // console.error(error);
      setErrMsg(error.message || 'An unexpected error occurred');
    }
  };
  

 
  return (
    <>
      <div className="CordPortal ExamPortal">
        <h1 style={{ color: "whitesmoke", fontSize: "3em" }}>{headings}</h1>
        <form onSubmit={HandleSubmit}>
          {errMsg && <p id="error">{errMsg}</p>}
          <input
            type="email"
            placeholder="Enter Email"
            autoComplete="off"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <Link to="/" style={{ color: 'whitesmoke'}}><ChevronDoubleLeft /> Back </Link>
      </div>
    </>
  );
  
};

export default CordPortal;
