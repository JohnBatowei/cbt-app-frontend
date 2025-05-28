import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import './styles/result.scss'
import axios from './Axios';
import Navbar from "./Navbar";
import Aside from "./Aside";

const Result = () => {
    const { logout } = useLogout();
    const history = useHistory();
    const [results, setResults] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [totalClasses, setTotalClasses] = useState(0);

    const fetchResults = async () => {
        try {
            const response = await axios.get('/get-results', { withCredentials: true });
            console.log('API response:', response.data);
            
            if (response.data && response.data.success) {
                setResults(response.data.data);
                setTotalClasses(Object.keys(response.data.data).length);
            } else {
                console.error('API response does not contain expected data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleViewClass = (classId,className) => {
        history.push(`/class-results/${classId}/${className}`);
    };

    const handleViewClassCorrections = (classId,className) => {
        history.push(`/class-results-correction/${classId}/${className}`);
    };

    // Filter results based on search term
    const filteredResults = Object.entries(results).filter(([className, classResults]) => {
        return (
            (className && className.toLowerCase().includes(searchTerm.toLowerCase())) ||
            classResults.some(result =>
                (result.className && result.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (result.createdAt && new Date(result.createdAt).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    });


    const handleDeleteClassResults = async (id,name) => {
        if (!window.confirm(`click OK if you want to delete ${name} results`)) return;
      
        try {
          const res = await axios.delete(`/delete-class-results/${id}`,{withCredentials: true});
          alert(`${res.data.message}`);
      
          // Optional: refresh the list or remove from UI state
          fetchResults()
        } catch (error) {
          console.error("Delete error:", error);
          alert("Failed to delete student.");
        }
      };


    return (
        <div className="Result">
            <Navbar clickF={() => logout()} />
            <Aside />
            <main>
                <div className="result-wrapper">
                    <div className="search">
                        <span>Search: </span>
                        <input 
                            type="text" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            placeholder="Search by class name or date" 
                        />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Class Name</th>
                                <th>Total Students</th>
                                {/* <th>Date Created</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>Class Name</th>
                                <th>Total Students</th>
                                {/* <th>Date Created</th> */}
                                <th>Actions</th>
                            </tr>
                        </tfoot>
                        <tbody>
                            {filteredResults.map(([className, classResults]) => (
                                <tr key={className}>
                                    <td>{className}</td>
                                    <td>{classResults.length}</td>
                                    {/* <td>{new Date(classResults[0].createdAt).toLocaleDateString()}</td> */}
                                    <td className='controlBtn'>
                                        <button className='a' onClick={() => handleViewClass(classResults[0].classId,classResults[0].className)} title="View results">
                                            See results
                                        </button>
                                        <span className='a'  onClick={() => handleViewClassCorrections(classResults[0].classId,classResults[0].className)}
                                          style={{
                                            border: '1px solid blue',
                                            padding: '8px 10px',
                                            borderRadius: '5px',
                                            backgroundColor: 'blue',
                                            color: 'whitesmoke',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                          
                                            }}

                                            title="Corrections">
                                         Reviews
                                        </span>
                                        <span className='a'
                                            onClick={() => handleDeleteClassResults(classResults[0].classId,classResults[0].className)}
                                            style={{
                                            border: '1px solid red',
                                            padding: '8px 10px',
                                            borderRadius: '5px',
                                            backgroundColor: '#ffe6e6',
                                            color: 'red',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                         
                                            }}

                                            title="Delete results"
                                        >
                                            Delete results
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="table-footer">
                        <p>Total Classes: {totalClasses}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Result;
