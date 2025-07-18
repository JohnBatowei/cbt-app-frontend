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
import { useState,useRef } from "react";


const Upload = () => {
  const { logout } = useLogout();
  const history = useHistory();

  const [questionFiles, setQuestionFiles] = useState([]);
  const [candidateFiles, setCandidateFiles] = useState([]);
  const [uCanFil, setUCanFile] = useState('Upload Candidate File');
  const [uQuestFil, setUQuestFile] = useState('Upload Question File');
  const questionInputRef = useRef(null);
  const candidateInputRef = useRef(null);


  const HandleClick = () => {
    logout();
    history.push("/cordportal");
  };

  const handleQuestionFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) {
      alert("Please select at least one file.");
      return;
    }

    const validExtensions = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    const invalidFiles = files.filter(file => !validExtensions.includes(file.type));
    if (invalidFiles.length > 0) {
      alert("One or more files are not valid Excel files.");
      return;
    }

    setQuestionFiles(files);
  };

  const handleCandidateFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) {
      alert("Please select at least one file.");
      return;
    }

    const validExtensions = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    const invalidFiles = files.filter(file => !validExtensions.includes(file.type));
    if (invalidFiles.length > 0) {
      alert("One or more files are not valid Excel files.");
      return;
    }

    setCandidateFiles(files);
  };

  const handleQuestionUpload = async () => {
    if (!questionFiles.length) {
      alert("No question files selected.");
      return;
    }

    setUQuestFile('Uploading File...');
    const formData = new FormData();
    questionFiles.forEach(file => formData.append("files", file));

    try {
      await axios.post("/upload-x-question", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      setUQuestFile('Upload Question File');
      alert("Question file(s) uploaded successfully!");
      questionInputRef.current.value = null;
      setQuestionFiles([]);

    } catch (error) {
      setUQuestFile('Upload Question File');
      console.error("Error uploading question files:", error);
      alert("Failed to upload question file(s).");
    }
  };

  const handleCandidateUpload = async () => {
    if (!candidateFiles.length) {
      alert("No candidate files selected.");
      return;
    }

    setUCanFile('Uploading File...');
    const formData = new FormData();
    candidateFiles.forEach(file => formData.append("files", file));

    try {
      await axios.post("/upload-x-candidate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      setUCanFile('Upload Candidate File');
      alert("Candidate file(s) uploaded successfully!");
      candidateInputRef.current.value = null;
      setCandidateFiles([]);

    } catch (error) {
      setUCanFile('Upload Candidate File');
      console.error("Error uploading candidate files:", error);
      alert("Failed to upload candidate file(s).");
    }
  };

  return (
    <div className="UploadQuestion">
      <Navbar clickF={HandleClick} />
      <Aside />
      <main>
        <section className="upload-wrapper">
          {/* Upload Question Section */}
          <div className="uploadQuestion-wrapper">
            <img src={questionSampleImg} alt="Question Sample" />
            <a href={questionSample} download="QUESTIONAIRE.xlsx">Download Excel Sample and Use</a>
            <div className="group">
              <span>Upload Excel Question File(s):</span>
              <form>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleQuestionFileChange}
                  multiple
                  ref={questionInputRef}
                />
                <button type="button" onClick={handleQuestionUpload}>{uQuestFil}</button>
              </form>
            </div>
          </div>

          {/* Upload Candidate Section */}
          <div className="uploadCandidate-wrapper">
            <img src={canSampleImg} alt="Candidate Sample" />
            <a href={canSample} download="CANDIDATE TEMPLATE.xlsx">Download Excel Sample and Use</a>
            <div className="group">
              <span>Upload Excel Candidate File(s):</span>
              <form>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleCandidateFileChange}
                  multiple
                  ref={candidateInputRef}
                />
                <button type="button" onClick={handleCandidateUpload}>{uCanFil}</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Upload;
