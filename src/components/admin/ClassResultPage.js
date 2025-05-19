import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import axios from './Axios';
import Navbar from "./Navbar";
import Aside from "./Aside";
import "jspdf-autotable";
import styles from './styles/classResultPage.scss'; // SCSS styles

const ClassResultPage = () => {
    const { logout } = useLogout();
    const history = useHistory();
    const { id, className } = useParams();
    const [classResults, setClassResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const rowsPerPage = 10;
    const resultPageRef = useRef(null);

    const handleClick = () => {
        logout();
        history.push("/cordportal");
    };

    const handlePrint = () => {
        if (resultPageRef.current) {
            const printContent = resultPageRef.current.innerHTML;
            const originalContent = document.body.innerHTML;

            document.body.innerHTML = printContent;
            window.print();
            document.body.innerHTML = originalContent;
        } else {
            console.error('Result page content not found.');
        }
    };

    useEffect(() => {
        const fetchClassResults = async () => {
            try {
                const response = await axios.get(`/class-results/${id}`, {
                    params: {
                        page: currentPage,
                        limit: rowsPerPage,
                        search: searchTerm
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    setClassResults(response.data.data);
                    setTotalCount(response.data.totalCount || 0);
                } else {
                    console.error('Failed to fetch class results:', response.data);
                }
            } catch (error) {
                console.error('Error fetching class results:', error);
            }
        };

        fetchClassResults();
    }, [id, currentPage, searchTerm]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(totalCount / rowsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const exportToExcel = async () => {
        try {
            const response = await axios.get(`/class-results/export-excel/${id}`, {
                params: { search: searchTerm },
                responseType: 'blob',
                withCredentials: true
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${className}_Results.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting results to Excel:', error);
        }
    };

    return (
        <div className='classResultPage'>
            <Navbar clickF={handleClick} />
            <Aside />
            <main>
                <br />
                <button className="backbtn" onClick={() => window.history.back()}>Back</button>
                <button className='printBtn' onClick={handlePrint}>Print Results</button>
                <button className='excelBtn' onClick={exportToExcel}>Export Excel</button>

                <div className='resultPage' ref={resultPageRef}>
                    <div className='searchContainer'>
                        <span>
                            Search:
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setCurrentPage(1); // reset to page 1 on search
                                    setSearchTerm(e.target.value);
                                }}
                                placeholder="Search by name, profile code, or subject"
                            />
                        </span>
                        <h4> Class : {className} - (results)</h4>
                    </div>

                    {classResults.length > 0 ? (
                        <>
                        <p className="nomOfStudent">Number of students : <span>{totalCount}</span></p>
                            <table className="table table-bordered" border={1}>
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Student Name</th>
                                        <th>Profile Code</th>
                                        <th>Subjects</th>
                                        <th>Total Score</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Student Name</th>
                                        <th>Profile Code</th>
                                        <th>Subjects</th>
                                        <th>Total Score</th>
                                    </tr>
                                </tfoot>
                                <tbody>
                                    {classResults.map((result, index) => (
                                        <tr key={index}>
                                            <td>{index + 1 + ((currentPage - 1) * rowsPerPage)}</td>
                                            <td>{result.candidateName.toUpperCase()}</td>
                                            <td>{result.profileCode}</td>
                                            <td className='subjectsScore'>
                                                {result.subjects.map(subject => `${subject.subjectName.toUpperCase()}: ${parseInt(subject.score)}`).join(', ')}
                                            </td>
                                            <td>{parseInt(result.totalScore)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='pagination'>
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                                <span style={{ color: 'whitesmoke' }}>Page {currentPage} of {Math.ceil(totalCount / rowsPerPage)}</span>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= Math.ceil(totalCount / rowsPerPage)}>Next</button>
                            </div>
                        </>
                    ) : (
                        <p className={styles.noResults} style={{color:"orange"}}>No results available for this class.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ClassResultPage;
