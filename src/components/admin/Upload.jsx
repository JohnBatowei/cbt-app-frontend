import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import Navbar from "./Navbar";
import Aside from "./Aside";
import './styles/uploadQuestion.scss';
import canSample from '../assets/CANDIDATE TEMPLATE.xlsx';
import questionSample from '../assets/QUESTIONAIRE.xlsx';
import questionSampleImg from '../assets/Screenshot (6).png';
import canSampleImg from '../assets/Screenshot (5).png';
import axios from './Axios'; // To make HTTP requests
import { useState } from "react";

const Upload = () => {
  const { logout } = useLogout();
  const history = useHistory();

  const [questionFile, setQuestionFile] = useState(null);
  const [candidateFile, setCandidateFile] = useState(null);
  const [uCanFil , setUCanFile] = useState('Upload Candidate File')
  const [uQuestFil , setUQuestFile] = useState('Upload Question File')
  const HandleClick = () => {
    logout();
    history.push("/cordportal");
  };

  const handleQuestionFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const validExtensions = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validExtensions.includes(file.type)) {
      alert("Please upload a valid Excel file.");
      return;
    }

    setQuestionFile(file);
  };

  const handleCandidateFileChange = (event) => {
    
    const file = event.target.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const validExtensions = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validExtensions.includes(file.type)) {
      alert("Please upload a valid Excel file.");
      return;
    }

    setCandidateFile(file);
  };

  const handleQuestionUpload = async () => {
    if (!questionFile) {
      alert("No question file selected.");
      return;
    }
    setUQuestFile('Uploading File...')
    const formData = new FormData();
    formData.append("file", questionFile);


    try {
       await axios.post("/upload-x-question", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      // console.log("Question File Uploaded:", response.data);
      setUQuestFile('Upload Question File')
      alert("Question file uploaded successfully!");
    } catch (error) {
      setUQuestFile('Upload Question File')
      console.error("Error uploading question file:", error);
      alert("Failed to upload question file.");
    }
  };


  const handleCandidateUpload = async () => {
    if (!candidateFile) {
      alert("No candidate file selected.");
      return;
    }
    setUCanFile('Uploading File...')
    const formData = new FormData();
    formData.append("file", candidateFile);
    
    try {
       await axios.post("/upload-x-candidate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      // console.log("Candidate File Uploaded:", response.data);
      setUCanFile('Upload Candidate File')
      alert("Candidate file uploaded successfully!");
    } catch (error) {
    setUCanFile('Upload Candidate File')
      console.error("Error uploading candidate file:", error);
      alert("Failed to upload candidate file.");
    }
  };

  return (
    <div className="UploadQuestion">
      <Navbar clickF={HandleClick} />
      <Aside />
      <main>
        <section className="upload-wrapper">
          <div className="uploadQuestion-wrapper">
            <img src={questionSampleImg} alt="Question Sample" />
            <a href={questionSample} download="QUESTIONAIRE.xlsx">Download Excel Sample and Use</a>
            <div className="group">
              <span>Upload Excel Question File:</span>
              <form>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleQuestionFileChange}
                />
                <button type="button" onClick={handleQuestionUpload}>{uQuestFil}</button>
              </form>
            </div>
          </div>

          <div className="uploadCandidate-wrapper">
            <img src={canSampleImg} alt="Candidate Sample" />
            <a href={canSample} download="CANDIDATE TEMPLATE.xlsx">Download Excel Sample and Use</a>
            <div className="group">
              <span>Upload Excel File for Candidate:</span>
              <form>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleCandidateFileChange}
                />
                <button type="button" onClick={handleCandidateUpload}>{uCanFil}</button>
              </form>
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Upload;
