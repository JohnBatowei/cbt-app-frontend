import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import Navbar from "./Navbar";
import Aside from "./Aside";
import "./styles/createClass/createClass.scss";
import "./styles/newError.scss";
import axios from "./Axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import debounce from "lodash.debounce";
import { X, Trash3, PlusLg, DashLg } from "react-bootstrap-icons";

const Class = () => {
  const { admin } = useAuthContext();
  const token = admin.token;
  const { logout } = useLogout();
  const history = useHistory();
  const [apiData, setApiData] = useState([]);
  const [classesApiData, setClassesApiData] = useState([]);
  const [name, setName] = useState("");
  const [timer, setTimer] = useState("");
  const [profileCode, setProfileCode] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openPlus, setOpenPlus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeButtonPlus, setActiveButtonPlus] = useState(null);
  const [editStates, setEditStates] = useState({});

  const itemsPerPage = 10;
  const totalPages = Math.ceil(classesApiData.length / itemsPerPage);

  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return classesApiData.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePlusSign = (id) => {
    setOpenPlus((prevOpenPlus) => ({
      ...prevOpenPlus,
      [id]: !prevOpenPlus[id],
    }));
    setActiveButtonPlus((prevState) => (prevState === id ? null : id));

    if (!openPlus[id]) {
      const classToEdit = classesApiData.find((cls) => cls._id === id);
      if (classToEdit) {
        setEditStates((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            id,
            name: classToEdit.name,
            timer: classToEdit.timer,
            profileCode: classToEdit.profileCodeInitials,
            selectedSubjects: classToEdit.subject.reduce((acc, sub) => {
              acc[sub._id] = true;
              return acc;
            }, {}),
          },
        }));
      }
    }
  };

  const handleClick = () => {
    logout();
    history.push("/cordportal");
  };

  const handleError = () => {
    setError("");
    setSuccess("");
  };

  const fetchQuestions = useCallback(
    debounce(async () => {
      console.log("Fetching data...");
      try {
        const res = await axios.get("/get-subjects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });
        console.log("Classes data:", res.data.classes);
        if (
          res.data &&
          Array.isArray(res.data.message) &&
          Array.isArray(res.data.classes)
        ) {
          setApiData(res.data.message);
          setClassesApiData(res.data.classes);
        } else {
          setApiData([]);
          setClassesApiData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    [token]
  );

  useEffect(() => {
    fetchQuestions();
    return () => {
      console.log("Cleaning up effect");
    };
  }, [fetchQuestions]);

  const handleSubjectChange = (id, classId) => {
    setEditStates((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        selectedSubjects: {
          ...prev[classId].selectedSubjects,
          [id]: !prev[classId].selectedSubjects[id],
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedSubjectIds = Object.keys(selectedSubjects).filter(
      (id) => selectedSubjects[id]
    );

    if (isNaN(timer)) {
      setError('Please set Time value must be a number');
      setSuccess("");
      return;
    }
    if (Number(timer) < 0.5) {
      setError('Set Time value must not be less than 0.5 minutes');
      setSuccess("");
      return;
    }

    const formData = {
      name,
      timer,
      subjects: selectedSubjectIds,
      profileCodeInitials: profileCode,
    };

    try {
      const res = await axios.post("/create-class", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true
      });

      if (res.status === 200) {
        fetchQuestions();
        setName("");
        setTimer("");
        setProfileCode("");
        setSelectedSubjects({});
        setError("");
        setSuccess(res.data.message);
      } else {
        setError(res.data.message);
        setSuccess("");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Class name already exists");
      setSuccess("");
    }
  };



  
  const handleEditSubmit = async (classId, e) => {
    e.preventDefault();

    const editState = editStates[classId];
    const selectedSubjectIds = Object.keys(editState.selectedSubjects).filter(
      (id) => editState.selectedSubjects[id]
    );

    if (isNaN(editState.timer)) {
      setError('Please set Time value must be a number');
      setSuccess("");
      return;
    }
    if (Number(editState.timer) < 1) {
      setError('Set Time value must not be less than 1 minutes');
      setSuccess("");
      return;
    }

    const formData = {
      name: editState.name,
      timer: editState.timer,
      subjects: selectedSubjectIds,
      profileCodeInitials: editState.profileCode,
    };

    try {
      const res = await axios.patch(`/update-class/${classId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true
      });

      if (res.status === 200) {
        fetchQuestions();
        setError("");
        setSuccess(res.data.message);
        // Keep the form open by not setting openPlus to false
      } else {
        setError(res.data.message);
        setSuccess("");
      }
    } catch (error) {
      console.error("Error updating class:", error);
      setError("Update failed");
      setSuccess("");
    }
  };

  const handleDelete = async (classId) => {
    try {
      const res = await axios.delete(`/delete-class/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });

      if (res.status === 200) {
        fetchQuestions();
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

  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    handleSearch();
  }, [searchTerm, sortOrder]);



  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchQuestions();
      return;
    }

    const filteredData = classesApiData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.timer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.profileCodeInitials
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    const sortedData = filteredData.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    setClassesApiData(sortedData);
  };



  return (
    <div className="Class">
      <Navbar clickF={handleClick} />
      <Aside />
      <main>
        <div className="create-class">

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


          <div className="form-wrapper">
            {/* <strong style={{display:'block',marginBottom:'1rem', textTransform:'capitalize'}}>create class for your candidates</strong> */}
            <form onSubmit={handleSubmit} className="create-class-form">
              <div className="top-wrapper">
                <div className="time wrap">
                  <label>
                    Class Name:
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="timer wrap">
                  <label>
                    Set time in minutes:
                    <input
                      type="text"
                      value={timer}
                      onChange={(e) => setTimer(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="profileCodeInitials wrap">
                  <label>
                    Profile code initials:
                    <input
                      type="text"
                      value={profileCode}
                      onChange={(e) => setProfileCode(e.target.value)}
                      placeholder="Enter 3 initials, e.g., CBT"
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="subjects-wrapper">
                <span>Select subjects for your class :</span>
                <div className="sub-subject-wrapper">
                  {apiData.map((data) => (
                    <div className="subject" key={data._id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={!!selectedSubjects[data._id]}
                          onChange={() =>
                            setSelectedSubjects((prev) => ({
                              ...prev,
                              [data._id]: !prev[data._id],
                            }))
                          }
                        />
                        {data.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit">Create Class</button>
            </form>
          </div>

          {/* <hr /> */}

          <div className="field">
            <div className="search">
              <span>You have {classesApiData.length} Classes created</span>
              <div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label htmlFor="search"> : Search</label>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Class Name</th>
                  <th>Time in minutes</th>
                  <th>Initials</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>S/N</th>
                  <th>Class Name</th>
                  <th>Time in minutes</th>
                  <th>Initials</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                {paginateData().map((item, index) => (
                  <React.Fragment key={item._id}>
                    <tr>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.timer} Minutes</td>
                      <td>{item.profileCodeInitials}</td>
                      <td className="actions">
                        <button title="Delete class" onClick={() => handleDelete(item._id)}>
                          <Trash3 />
                        </button>
                        <button
                        title="Edit class"
                          className={
                            activeButtonPlus === item._id ? "active" : ""
                          }
                          onClick={() => handlePlusSign(item._id)}
                        >
                          {openPlus[item._id] ? <DashLg /> : <PlusLg />}
                        </button>
                      </td>
                    </tr>
                    {openPlus[item._id] && (
                      <tr className="edit-parent">
                        <td colSpan="5" className="editAndUpdateClass-wrapper">
                          <div className="editAndUpdateClass">
                            <span>
                              Edit and Update{" "}
                              <label>{item.name} </label> class
                            </span>

                            <form
                              className="update-form"
                              onSubmit={(e) => handleEditSubmit(item._id, e)}
                            >
                              <div className="top-edit">
                                <div className="wrap">
                                  <label>
                                    Class Name:
                                    <input
                                      type="text"
                                      readOnly
                                      value={editStates[item._id]?.name || ''}
                                      onChange={(e) =>
                                        setEditStates((prev) => ({
                                          ...prev,
                                          [item._id]: {
                                            ...prev[item._id],
                                            name: e.target.value,
                                          },
                                        }))
                                      }
                                      required
                                    />
                                  </label>
                                </div>
                                <div className="timer wrap">
                                  <label>
                                    Set time in minutes:
                                    <input
                                      type="text"
                                      value={editStates[item._id]?.timer || ''}
                                      onChange={(e) =>
                                        setEditStates((prev) => ({
                                          ...prev,
                                          [item._id]: {
                                            ...prev[item._id],
                                            timer: e.target.value,
                                          },
                                        }))
                                      }
                                      required
                                    />
                                  </label>
                                </div>
                                <div className="profileCodeInitials wrap">
                                  <label>
                                    Profile code initials:
                                    <input
                                      type="text"
                                      value={editStates[item._id]?.profileCode || ''}
                                      onChange={(e) =>
                                        setEditStates((prev) => ({
                                          ...prev,
                                          [item._id]: {
                                            ...prev[item._id],
                                            profileCode: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Enter 3 initials, e.g., CBT"
                                      required
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className="subjects-wrapper-ed">
                                <span>Select subjects for your class:</span>
                                <div className="sub-subject-wrapper">
                                  {apiData.map((data) => (
                                    <div className="subject" key={data._id}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={!!editStates[item._id]?.selectedSubjects[data._id]}
                                          onChange={() =>
                                            handleSubjectChange(data._id, item._id)
                                          }
                                        />
                                        {data.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button type="submit">Update Class</button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )}
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
                disabled={currentPage >= totalPages}
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

export default Class;
