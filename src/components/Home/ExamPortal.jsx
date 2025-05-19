import './styles/examPort.scss';
import { Link, useHistory } from "react-router-dom";
import { ChevronDoubleLeft } from 'react-bootstrap-icons';
import axios from './StudentAxios';
import { useState,useEffect } from 'react';
import { useAuthContextStudent } from '../../hooks/useAuthStudentCon';
// import Cookies from 'js-cookie';


const ExamPortal = () => {
  const [profileCode, setProfileCode] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); // Hook to programmatically navigate
  const { dispatch } = useAuthContextStudent();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('/verify-login', { profileCode }, {
        // headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res.status === 200) {
        // Update context and localStorage
        dispatch({ type: 'LOGIN', payload: res.data });
        localStorage.setItem('student', JSON.stringify(res.data));
        // Cookies.set('studentExamCookie', res.data.token)
        // const studentExamCookie = Cookies.get('studentExamCookie');
        // console.log('token:', res.data);
        // console.log('message:', res.data.message);
        // console.log('Cookie value:', studentExamCookie);
        // Redirect to the dashboard
        history.push('/dashboard');
      } else {
        setError(res.data.error || 'Unknown error');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'An error occurred');
    }
  };


const [headings,setHeadings] = useState('CBT Exam Portal')

const getHeadings = async () => {
  try {
    // const res = await axios.get('http://localhost:3800/headings', {
    const res = await axios.get('/headings', {
      headers: { 'Content-Type':'application/json' },
    });

    if (res.status === 200 && res.data.data) {
      const headingData = res.data.data.find((data) => data.deff === 'can');
      // console.log(headingData);

      // Update heading regardless of confirmation status
      if (headingData) {
        setHeadings(headingData.canPage || 'CBT Exam Portal');
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


  return (
    <div className="ExamPortal">
      <h1 style={{ color: 'whitesmoke', fontSize: '3em' }}>{headings}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter profile code"
          value={profileCode}
          onChange={(e) => setProfileCode(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message" style={{color: 'rgb(255, 202, 183)'}}>{error}</p>}
      <Link to='/' style={{ color: 'whitesmoke'}}><ChevronDoubleLeft /> Back</Link>
    </div>
  );
};

export default ExamPortal;
