import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import axios from "./Axios";
import Navbar from "./Navbar";
import Aside from "./Aside";
import "jspdf-autotable";
import styles from "./styles/classResultPage.scss";

const rowsPerPage = 10;

const ClassResultPageCorrection = () => {
  const { logout }         = useLogout();
  const history            = useHistory();
  const { id, className }  = useParams();

  const [classResults, setClassResults]   = useState([]);
  const [searchTerm,   setSearchTerm]     = useState("");
  const [currentPage,  setCurrentPage]    = useState(1);
  const [totalCount,   setTotalCount]     = useState(0);
  const [detailsShown, setDetailsShown]   = useState({});
  const resultPageRef = useRef(null);

  /* ───────── helpers ───────── */

  const toggleDetails = id =>
    setDetailsShown(prev => ({ ...prev, [id]: !prev[id] }));

  const optionText = (q, key) => q.options?.[key?.toUpperCase()] || "";

  const handleLogout = () => { logout(); history.push("/cordportal"); };

//   const handlePrint  = () => {
//     if (!resultPageRef.current) return;
//     const html = resultPageRef.current.innerHTML;
//     const orig = document.body.innerHTML;
//     document.body.innerHTML = html;
//     window.print();
//     document.body.innerHTML = orig;
//   };

  /* ───────── data fetch ───────── */

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/class-results/${id}`, {
          params: { page: currentPage, limit: rowsPerPage, search: searchTerm },
          withCredentials: true,
        });
        if (res.status === 200) {
          setClassResults(res.data.data);
          setTotalCount(res.data.totalCount || 0);
        }
      } catch (e) { console.error(e); }
    })();
  }, [id, currentPage, searchTerm]);

  /* ───────── pagination ───────── */

  const changePage = p => {
    const max = Math.ceil(totalCount / rowsPerPage);
    if (p >= 1 && p <= max) setCurrentPage(p);
  };

  /* ───────── export ───────── */

//   const exportToExcel = async () => {
//     try {
//       const res = await axios.get(`/class-results/export-excel/${id}`, {
//         params: { search: searchTerm },
//         responseType: "blob",
//         withCredentials: true,
//       });
//       const url = URL.createObjectURL(new Blob([res.data]));
//       const a   = document.createElement("a");
//       a.href = url;
//       a.download = `${className}_Results.xlsx`;
//       a.click();
//     } catch (e) { console.error(e); }
//   };

  /* ───────── render ───────── */

  return (
    <div className="classResultPage">
      <Navbar clickF={handleLogout} />
      <Aside />

      <main>
        <br />
        <button className="backbtn"  onClick={() => history.goBack()} style={{margin:'0 0 1rem 0'}}>Back</button>
        {/* <button className="printBtn" onClick={handlePrint}>Print Results</button> */}
        {/* <button className="excelBtn" onClick={exportToExcel}>Export Excel</button> */}

        <div className="resultPage" ref={resultPageRef}>
          {/* search */}
          <div className="searchContainer">
            <span>Search:&nbsp;
              <input
                value={searchTerm}
                onChange={e => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                placeholder="Search by name, profile code, or subject"
              />
            </span>
            <h4>Class&nbsp;: {className} <small>(with corrections)</small></h4>
          </div>

          {classResults.length ? (
            <>
              <p className="nomOfStudent">Number of students : <span>{totalCount}</span></p>

              <table className="table table-bordered" border={1}>
                <thead>
                  <tr>
                    <th>S/N</th><th>Student Name</th><th>Profile Code</th><th>Total Score</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classResults.map((r, i) => (
                    <React.Fragment key={r._id}>
                      {/* summary row */}
                      <tr>
                        <td>{i + 1 + (currentPage - 1) * rowsPerPage}</td>
                        <td>{r.candidateName.toUpperCase()}</td>
                        <td>{r.profileCode}</td>
                        <td>{Math.round(r.totalScore)}</td>
                        <td><button className="but" onClick={() => toggleDetails(r._id)}>
                          {detailsShown[r._id] ? "Hide Corrections" : "Show corrections"}
                        </button></td>
                      </tr>

                      {/* detail row */}
                      {detailsShown[r._id] && (
                        <tr className="detailsRow">
                          <td colSpan={5}>
                            {r.subjects.map(sub =>{ 
                                const totalPass = sub.questions.filter(q => q.isCorrect).length;
                                const totalFail = sub.questions.length - totalPass;
                                return(
                                
                              <div key={sub.subjectId} className="subjectBlock">
                                <h4>{sub.subjectName.toUpperCase()} <span className='bad'>{`Failed:${totalFail}`}</span> , <span className="good">{`Passed:${totalPass}`} </span></h4>

                                <table className="innerTable" border={1}>
                                  <thead>
                                    <tr>
                                      <th>#</th><th>Question</th>
                                      <th>Your Answer</th>
                                      <th>Correct Answer</th>
                                      <th>✔ / ✖</th>
                                   
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sub.questions.map((q, idx) => (
                                      <tr key={q.questionId ?? idx}>
                                        <td>{idx + 1}</td>
                                        <td dangerouslySetInnerHTML={{__html: q.questionText}} />
                                        <td
                                          dangerouslySetInnerHTML={{
                                            __html: q.selectedText || optionText(q, q.selectedOption) || "-",
                                          }}
                                          className={q.isCorrect ? "good" : "bad"}
                                        />
                                        <td
                                          dangerouslySetInnerHTML={{
                                            __html: q.correctText  || optionText(q, q.correctAnswer),
                                          }}
                                        />
                                        <td>{q.isCorrect ? <span className="good">✔</span> : <span className="bad">✖</span>}</td>
                                    
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )})}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>S/N</th><th>Student Name</th><th>Profile Code</th><th>Total Score</th><th>Action</th>
                  </tr>
                </tfoot>
              </table>

              <div className="pagination">
                <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                <span style={{color:"whitesmoke"}}>
                  Page {currentPage} of {Math.ceil(totalCount / rowsPerPage)}
                </span>
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / rowsPerPage)}
                >Next</button>
              </div>
            </>
          ) : (
            <p className={styles.noResults} style={{color:"orange"}}>No results available for this class.</p>
          )}
        </div>
      </main>

      {/* quick styles */}
      <style jsx>{`
        .good{color:green;font-weight:500}
        .bad{color:crimson;font-weight:500}
        .subjectBlock{margin-bottom:1.5rem}
        .innerTable{width:100%;margin-top:.5rem}
        .but{padding:5px 12px; box-shadow: 2px 2px 4px grey; border-radius: 5px; background: limegreen;cursor:pointer;border: 1px solid limegreen; color: white}
      `}</style>
    </div>
  );
};

export default ClassResultPageCorrection;
