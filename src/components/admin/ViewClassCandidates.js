import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import axios from './Axios';
import Navbar from "./Navbar";
import Aside from "./Aside";
import styles from './styles/classResultPage.scss';
import { saveAs } from "file-saver";

const ViewClassCandidates = () => {
    const { logout } = useLogout();
    const history = useHistory();
    const { id, className } = useParams();

    const [classResults, setClassResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(false);
    const rowsPerPage = 12;
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
            window.location.reload();
        } else {
            console.error('Result page content not found.');
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await axios.get(`/class-registered-students/download-excel/${id}`, {
                responseType: 'blob',
            withCredentials: true });
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(blob, `Class_${className}_Candidates.xlsx`);
        } catch (error) {
            console.error('Failed to download Excel:', error);
        }
    };

    useEffect(() => {
        const fetchClassResults = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `/class-registered-students/${id}?page=${currentPage}&limit=${rowsPerPage}&search=${searchTerm}`,
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    setClassResults(response.data.data);
                    setTotalStudents(response.data.total);
                } else {
                    console.error('Failed to fetch class results:', response.data);
                }
            } catch (error) {
                console.error('Error fetching class results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClassResults();
    }, [id, currentPage, searchTerm]);

    const totalPages = Math.ceil(totalStudents / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className='ViewClassCandidates'>
            <Navbar clickF={handleClick} />
            <Aside />
            <main>
                <br />
                <button className="backbtn" onClick={() => window.history.back()}>Back</button>
                <button className='printBtn' onClick={handlePrint}>Print View</button>
                <button className='printBtn' onClick={handleExportExcel}>Export to Excel</button>

                <div className='resultPage' ref={resultPageRef}>
                    <div className='searchContainer'>
                        <span>
                            Search: <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search by name or profile code"
                            />
                        </span>
                        <h4>Class : {className}</h4>
                    </div>

                    {loading ? (
                        <h3 style={{ color: "whitesmoke" }}>Loading...</h3>
                    ) : classResults.length > 0 ? (
                        <>
                            <p className="nomOfStudent">Number of students : <span>{totalStudents}</span></p>
                            <table className="table table-bordered" border={1}>
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Student Name</th>
                                        <th>Profile Code</th>
                                        <th>Subjects</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Student Name</th>
                                        <th>Profile Code</th>
                                        <th>Subjects</th>
                                    </tr>
                                </tfoot>
                                <tbody>
                                    {classResults.map((result, index) => (
                                        <tr key={result._id}>
                                            <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                            <td style={{textTransform:'capitalize'}}>{result.candidateName}</td>
                                            <td>{result.profileCode}</td>
                                            <td className='subjectsScore'>
                                                {result.subject.map(subject => `${subject.name}`).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={`${styles.pagination} pagination`}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <span style={{ color: 'whitesmoke' }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
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

export default ViewClassCandidates;
