import axiosSt from '../Home/StudentAxios'
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './styles/seeResult.scss'; // Import the SCSS file

const SeeResult = () => {
  const { id } = useParams();
  const [classResults, setClassResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassResults = async () => {
      try {
        // const response = await axios.get(`http://localhost:3800/student-results/${id}`, 
        const response = await axiosSt.get(`/student-results/${id}`, 
        {headers: {'Content-Type': 'application/json'}});
        if (response.status === 200) {
          setClassResults(response.data.data);
        } else {
          console.error('Failed to fetch class results:', response.data);
          setError('Failed to fetch results');
        }
      } catch (error) {
        console.error('Error fetching class results:', error);
        setError('Error fetching results');
      } finally {
        setLoading(false);
      }
    };

    fetchClassResults();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="see-result-wrapper">
    <div className="see-result">
      <div className="resultWrapper">
        <h1 className="title">{classResults.candidateName} Results</h1>
        {classResults ? (
          <div className="resultContent">
            <div className="info">
              <div className="infoItem">
                <span className="label">Name :</span>
                <span className="value">{classResults.candidateName}</span>
              </div>
              <div className="infoItem">
                <span className="label">Profile Code :</span>
                <span className="value">{classResults.profileCode}</span>
              </div>
            </div>
            <div className="subjects">
              <div className="subjectHeader">
                <span>Subject Name</span>
                <span>Score</span>
              </div>
              {classResults.subjects.map((subject, index) => (
                <div key={index} className="subjectRow">
                  <span>{subject.subjectName}</span>
                  <span>{parseInt(subject.score)}</span>
                </div>
              ))}
              <div className="totalScore">
                <span>Total Score:</span>
                <span>{parseInt(classResults.totalScore)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>No results available</p>
        )}
        <Link to='/Examportal' className="link">Take Another Exam</Link>
      </div>
    </div>
    </div>
  );
};

export default SeeResult;
