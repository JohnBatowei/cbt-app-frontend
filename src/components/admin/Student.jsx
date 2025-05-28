import React, { useState, useEffect, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import Navbar from "./Navbar";
import Aside from "./Aside";
import './styles/student.scss';
import { useAuthContext } from "../../hooks/useAuthContext";
import debounce from "lodash.debounce";
import axios from "./Axios";
import "./styles/newError.scss";
import { X, Trash3 } from "react-bootstrap-icons";

const Student = () => {
  const { admin } = useAuthContext();
  const token = admin.token;
  const { logout } = useLogout();
  const history = useHistory();
  const [classesApiData, setClassesApiData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [examTime, setExamTime] = useState("");
  const [profileCode, setProfileCode] = useState("");
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passport, setPassport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidateDocsCount, setCandidateDocsCount] = useState(0);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    logout();
    history.push("/cordportal");
  };


  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");



  // Debounced fetchClass function
  const fetchClass = useCallback(
    debounce(async (page, searchTerm) => {
      try {
        const res = await axios.get("/get-subjects", {
          params: { page, limit: itemsPerPage, searchTerm },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("Classes data:", res.data.findCandidates);

        if (res.data && Array.isArray(res.data.classes) && Array.isArray(res.data.findCandidates)) {
          setClassesApiData(res.data.classes);
          setCandidate(res.data.findCandidates);
          setCandidateDocsCount(res.data.findCandidatesDocsCount);
        } else {
          setClassesApiData([]);
          setCandidate([]);
          setCandidateDocsCount(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    [token]
  );
  


  const fetchProfileCode = async (prefix) => {
    try {
      const response = await axios.get(`/generate-profile-code?prefix=${prefix}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      if (response.status === 200) {
        return response.data.profileCode;
      } else {
        throw new Error("Failed to generate profile code");
      }
    } catch (error) {
      console.error("Error fetching profile code:", error);
      throw error;
    }
  };
  



  useEffect(() => {
    fetchClass();
    return () => {
      console.log("Cleaning up effect");
    };
  }, [fetchClass]);


  const handleClassChange = async (event) => {
    const classId = event.target.value;
    const selected = classesApiData.find(cls => cls._id === classId);
  
    if (selected) {
      setSelectedClass(selected);
      setSubjects(selected.subject || []);
      setSelectedSubjects([]);
      setExamTime(selected.timer || "");
  
      try {
        console.log(selected.profileCodeInitials);
        const code = await fetchProfileCode(selected.profileCodeInitials); // ✅ await here
        setProfileCode(code); // ✅ now setting actual string
      } catch (error) {
        setError("Failed to generate profile code.");
      }
    }
  };
  
  

  const handleSubjectChange = (event) => {
    const subjectId = event.target.value;
    setSelectedSubjects(prevSelectedSubjects =>
      prevSelectedSubjects.includes(subjectId)
        ? prevSelectedSubjects.filter(id => id !== subjectId)
        : [...prevSelectedSubjects, subjectId]
    );
  };



  const handleError = () => {
    setError("");
    setSuccess("");
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedClass) {
      setError("Oops!!! please select a class");
      setSuccess('');
      // alert("Please select a class.");
      return;
    }

    if (selectedSubjects.length  < 1) {
      setError("Oops!!! Please select atleast a subject");
      setSuccess('');
      // console.log("Error: No subjects selected.");
      return;
    }
  // return console.log(selectedClass.isBatched);
 // Subject limit logic
 if (!selectedClass.isBatched && selectedSubjects.length > 4) {
  setError("You can only select up to 4 subjects for this class.");
  setSuccess('');
  return;
}

if (selectedClass.isBatched && selectedSubjects.length < 1) {
  setError("You can only select 1 subject for a batched class.");
  setSuccess('');
  return;
}


    const formData = new FormData();
    formData.append("classId", selectedClass._id);
    formData.append("className", selectedClass.name);
    formData.append("fullname", fullname);
    formData.append("phoneNumber", phoneNumber);
    formData.append("file", passport); // Ensure 'file' matches the name used in multer configuration
    formData.append("profileCode", profileCode);
    formData.append("examTime", examTime);
    formData.append("subjects", JSON.stringify(selectedSubjects));
  
    try {
      const response = await axios.post("/register-student", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      console.log("Registration successful:", response.data);
      
      if (response.status === 200) {
        // Clear specific form fields
        setFullname("");
        setPhoneNumber("");
        setPassport(null);
        setSelectedSubjects([]); // Clear selected subjects
        fetchClass()
        const newCode = await fetchProfileCode(selectedClass.profileCodeInitials);
        setProfileCode(newCode);
     
        setError("");
        setSuccess(response.data.message);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } else {
        setError(response.data.message);
        setSuccess("");
      }
  
    } catch (error) {
      setError("Error registering student:", error.message);
      setSuccess('');
      console.error("Error registering student:", error);
      // Handle error, e.g., show an error message
    }
  };
  


  const handleDelete = async (candidateId) => {
    try {
      const res = await axios.delete(`/delete-student/${candidateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials:true
      });

      if (res.status === 200) {
        fetchClass();
        setError("");
        setSuccess(res.data.message);
      } else {
        setError(res.data.message);
        setSuccess("");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };


  useEffect(() => {
    fetchClass(currentPage, searchTerm.trim());
  }, [currentPage, searchTerm, fetchClass]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to page 1 when typing search
  };
  

  return (
    <div className="Student">
      <Navbar clickF={handleClick} />
      <Aside />
      <main>
        <div className="student-wrapper">

        <div className={`es-message ${error || success ? "override" : ""}`}>
            {error && (
              <p className="error gen">
                {error}
                <X
                  style={{
                    marginLeft: "28px",
                    marginTop: "-8px",
                    cursor: "pointer",
                  }}
                  onClick={handleError}
                />
              </p>
            )}
            {success && (
              <p className="success gen">
                {success}
                <X
                  style={{
                    marginLeft: "28px",
                    marginTop: "-8px",
                    cursor: "pointer",
                  }}
                  onClick={handleError}
                />
              </p>
            )}
          </div>

          <div className="candidate-reg-form">
            <h3 className='_text'>Register Candidate</h3>

            <form onSubmit={handleSubmit}>
              <div className="wrap">
                <label className='_text'>Select Class: </label>
                <select name="class" onChange={handleClassChange}>
                  <option value="">Select class</option>
                  {classesApiData.map(item => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="populate-class-subjects">
                {subjects.length > 0 && (
                  <div>
                    <label className="label _text" >Select Subjects : </label>
                        <div className="checkbox-wrapper">
                        {subjects.map(subject => (
                      <div  key={subject._id}>
                        <label className="box">
                          <input
                            type="checkbox"
                            value={subject._id}
                            checked={selectedSubjects.includes(subject._id)}
                            onChange={handleSubjectChange}
                          />
                          {subject.name}
                        </label>
                      </div>
                    ))}
                        </div>
                  </div>
                )}
              </div>

              <div className="candidate">
                <div className="editable">
                <div className="wrap-child wrap">
                  <span className='_text'>Fullname : </span>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>

                <div className="wrap-child wrap">
                  <span className='_text'>Passport : </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setPassport(e.target.files[0])}
                  />
                </div>

                <div className="wrap-child wrap">
                  <span className='_text'>Phone Number : </span>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                </div>

                <div className="reaOnly">
                <div className="wrap-child wrap">
                  <span className='_text'>Profile Code: </span>
                  <input type="text" value={profileCode} readOnly />
                </div>

                <div className="wrap-child wrap">
                  <span className='_text'>Exam Time: </span>
                  <input type="text" value={examTime} readOnly />
                </div>
                </div>
              </div>

              <button type="submit">Register new</button>
            </form>
          </div>
          {/* end */}


            
          <div className="field table-wrapper">
      <div className="search">
        <span>You have {candidateDocsCount} students registered for an exam</span>
        <div>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <label htmlFor="search"> : Search</label>
        </div>
      </div>

      <table className="regCanTable">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Class Name</th>
            <th>Student name</th>
            <th>Time in minutes</th>
            <th>Profile Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>S/N</th>
            <th>Class Name</th>
            <th>Student name</th>
            <th>Time in minutes</th>
            <th>Profile Code</th>
            <th>Action</th>
          </tr>
        </tfoot>
        <tbody>
          {candidate.map((item, index) => (
            <React.Fragment key={item._id}>
              <tr>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{item.className}</td>
                <td style={{textTransform:'capitalize'}}>{item.candidateName}</td>
                {/* <td>{item.timer} Minutes</td> */}
                {item.timer == 0 && <td>Subject time base</td>}
                {item.timer != 0 && <td>{item.timer} Minutes</td>}
                <td>{item.profileCode}</td>
                <td className="actions">
                  <button onClick={() => handleDelete(item._id)}>
                    <Trash3 />
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= candidateDocsCount}
        >
          Next
        </button>
      </div>
    </div>


        </div>
      </main>
    </div>
  );
};

export default Student;
