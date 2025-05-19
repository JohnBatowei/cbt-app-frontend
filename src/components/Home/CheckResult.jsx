import './styles/examPort.scss';
import { Link, useHistory } from "react-router-dom";
import { ChevronDoubleLeft } from 'react-bootstrap-icons';
import axios from './StudentAxios';
import { useState,useEffect } from 'react';


const CheckResult = () => {
  const [profileCode, setProfileCode] = useState('');
  const [scratchCard, setScratchCard] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); // Hook to programmatically navigate
  const [headings,setHeadings] = useState('Candidate result Portal')


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('/st-check-result', { profileCode,scratchCard }, {
        // headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res.status === 200) {
        history.push('/student-results/'+res.data.markedResult)
      } else {
        setError(res.data.error || 'Unknown error');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'An error occurred');
    }
  };



const getHeadings = async () => {
  try {
    // const res = await axios.get('http://localhost:3800/headings', {
    const res = await axios.get('/headings', {
      headers: { 'Content-Type':'application/json' },
    });

    if (res.status === 200 && res.data.data) {
      const headingData = res.data.data.find((data) => data.deff === 'result');
      // console.log(headingData);

      // Update heading regardless of confirmation status
      if (headingData) {
        setHeadings(headingData.resultPage || 'Candidate result Portal');
      }
    }
  } catch (error) {
    console.error('Error fetching headings:', error);
    setHeadings('Candidate result Portal');
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
        <input
          type="text"
          placeholder="Enter scratch card"
          value={scratchCard}
          onChange={(e) => setScratchCard(e.target.value)}
        />
        <button type="submit">Check Result</button>
      </form>
      {error && <p className="error-message" style={{color: 'rgb(255, 202, 183)'}}>{error}</p>}
      <Link to='/' style={{ color: 'whitesmoke'}}><ChevronDoubleLeft /> Back</Link>
    </div>
  );
};

export default CheckResult;
