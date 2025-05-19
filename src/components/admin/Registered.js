import Navbar from "./Navbar";
import Aside from "./Aside";
import { useLogout } from "../../hooks/useLogout";
import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import axios from "./Axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useHistory } from "react-router-dom";
import "./styles/student.scss";
import "./styles/registered.scss";

const Registered = function () {
  const { logout } = useLogout();
  const { admin } = useAuthContext();
  const token = admin.token;
  const history = useHistory();

  const [classesApiData, setClassesApiData] = useState([]);
  const [originalClassesData, setOriginalClassesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const fetchClass = useCallback(
    debounce(async () => {
      try {
        const res = await axios.get("/get-subjects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (res.data && Array.isArray(res.data.classes)) {
          setClassesApiData(res.data.classes);
          setOriginalClassesData(res.data.classes);
        } else {
          setClassesApiData([]);
          setOriginalClassesData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    [token]
  );

  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback(() => {
    if (searchTerm.trim() === "") {
      setClassesApiData(originalClassesData);
      return;
    }

    const filteredData = originalClassesData.filter((item) => {
      const className = item.name ? item.name.toLowerCase() : "";
      const timer = item.timer ? item.timer.toString().toLowerCase() : "";

      return (
        className.includes(searchTerm.toLowerCase()) ||
        timer.includes(searchTerm.toLowerCase())
      );
    });

    const sortedData = filteredData.sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : "";
      const nameB = b.name ? b.name.toLowerCase() : "";

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setClassesApiData(sortedData);
  }, [searchTerm, sortOrder, originalClassesData]);

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, sortOrder, debouncedSearch]);

  const handleView = function (id, className) {
    try {
      history.push(`/registered-class/${id}/${className}`);
    } catch (e) {
      console.log(e);
    }
  };


  const handleDeleteRegisteredStudents = async (id,name) => {
    if (!window.confirm(`Click OK if you want to delete ${name} registered candidates`)) return;
  
    try {
      const res = await axios.delete(`/delete-registered-students/${id}`,{withCredentials: true});
      alert(`${res.data.message}`);
  
      // Optional: refresh the list or remove from UI state
      fetchClass()
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete student.");
    }
  };
  
  return (
    <div className="registered">
      <Navbar clickF={() => logout()} />
      <Aside />
      <main>
        <div className="field">
          <div className="search">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>S/N</th>
                <th>Class Name</th>
                <th>Time in minutes</th>
                <th>Actions</th>
              </tr>
            </tfoot>
            <tbody>
              {paginateData().map((item, index) => (
                <React.Fragment key={item._id}>
                  <tr>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.timer} Minutes</td>
                    <td className="groupBtn">
                     <div className="btnwrap">
                     <span
                        className="btn2"
                        onClick={() => handleView(item._id, item.name)}
                        title="View registered candidates"
                      >
                        See candidates
                      </span>
                      <span className="deleteBtn"
                        onClick={() => handleDeleteRegisteredStudents(item._id,item.name)}
                        title="Delete registered candidates"
                      >
                        Delete
                      </span>
                     </div>
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
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Registered;
