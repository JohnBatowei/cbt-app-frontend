import Navbar from "./Navbar";
import Aside from "./Aside";
import "./styles/question.scss";
import "./styles/error.scss";
import React, { useState, useEffect } from "react";
import axios from "./Axios";
import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

const Question = () => {
  const { admin } = useAuthContext();
  const token = admin.token;
  const history = useHistory();
  const { logout } = useLogout();

  const [apiData, setApiData] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalQuestions / itemsPerPage);

  // ✅ Fetch data from the backend with pagination + search
  const fetchData = async (page = 1, search = "") => {
    try {
      const res = await axios.get(
        `/get-all-questions?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data && Array.isArray(res.data.questions)) {
        setApiData(res.data.questions);
        setTotalQuestions(res.data.total);
        setCurrentPage(page);
      } else {
        setApiData([]);
        setTotalQuestions(0);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // ✅ Debounced search effect
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchData(1, searchTerm); // Reset to page 1 on new search
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  useEffect(() => {
    fetchData(); // Initial load
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchData(newPage, searchTerm);
    }
  };

  const HandleClick = () => {
    logout();
    history.push("/cordportal");
  };

  return (
    <>
      <Navbar clickF={HandleClick} />
      <Aside />
      <main>
        <div className="questions">
          <h3>
            Total number of questions <strong>{totalQuestions}</strong>
          </h3>
          <div className="main">
            <div className="field">
              <div className="search">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label htmlFor="search"> : Search</label>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Subject</th>
                    <th>Questions</th>
                    <th>OptionA</th>
                    <th>OptionB</th>
                    <th>OptionC</th>
                    <th>OptionD</th>
                    <th>Answers</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>S/N</th>
                    <th>Subject</th>
                    <th>Questions</th>
                    <th>OptionA</th>
                    <th>OptionB</th>
                    <th>OptionC</th>
                    <th>OptionD</th>
                    <th>Answers</th>
                  </tr>
                </tfoot>
                <tbody>
                  {apiData.map((item, index) => (
                    <tr key={item.questionId}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.subjectName}</td>
                      <td><div dangerouslySetInnerHTML={{ __html: item.question }}></div></td>
                      <td><div dangerouslySetInnerHTML={{ __html: item.optionA }}></div></td>
                      <td><div dangerouslySetInnerHTML={{ __html: item.optionB }}></div></td>
                      <td><div dangerouslySetInnerHTML={{ __html: item.optionC }}></div></td>
                      <td><div dangerouslySetInnerHTML={{ __html: item.optionD }}></div></td>
                      <td style={{ textTransform: "uppercase" }}>{item.answer}</td>
                    </tr>
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
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Question;
