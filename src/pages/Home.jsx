import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const [registrationNumber, setRegistrationNumber] = useState('');

  const handleRegistrationNumberChange = (event) => {
    setRegistrationNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.get(`/api/exam/student/${registrationNumber}`)
      .then((response) => {
        const { data } = response;
        window.location.href = `/exam/${data.registrationNumber}`;
      })
      .catch((error) =>
      {
        console.error(error);
        });
        };
        
        return (
        <div>
        <h1>CBT Application</h1>
        <form onSubmit={handleSubmit}>
        <label>
        Exam Registration Number:
        <input type="text" value={registrationNumber} onChange={handleRegistrationNumberChange} />
        </label>
        <button type="submit">Start Exam</button>
        </form>
        </div>
        );
        }

        export default Home;