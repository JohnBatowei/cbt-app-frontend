import Navbar from "./Navbar";
import Aside from "./Aside";
import "./styles/question.scss";
import "./styles/error.scss";
import React, { useState, useEffect } from "react";
import axios from "./Axios";
import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import "./styles/newError.scss";
import { X } from "react-bootstrap-icons";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const ScratchCard = props => {

  const [apiData, setApiData] = useState([]);
  const [apiDataLength, setApiDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [cardCount, setCardCount] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(null)

  const itemsPerPage = 10;
  const totalPages = Math.ceil(apiDataLength / itemsPerPage);

  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return apiData.slice(startIndex, endIndex);
  };

  const { logout } = useLogout();
  const history = useHistory();

  const HandleClick = () => {
    logout();
    history.push("/cordportal");
  };


  const getCards = async () => {
    try {
      const res = await axios.get("/get-scratch-card", {
        withCredentials: true
      });
      // console.log(res.data)
      if (res.data && Array.isArray(res.data.data)) {
        setApiData(res.data.data);
        setApiDataLength(res.data.data.length);
      } else {
        setApiData([]);
        setApiDataLength(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCards()
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, sortOrder]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      getCards();
      return;
    }

    const filteredData = apiData.filter(item =>
      item.card.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    const sortedData = filteredData.sort((a, b) => {
      const nameA = a.card.toLowerCase();
      const nameB = b.card.toLowerCase();
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    setApiData(sortedData);
    setApiDataLength(sortedData.length);
  };

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const handleError = () => {
    setError("");
    setSuccess("");
  };


  const handleScratchCard = async (e)=>{
    e.preventDefault()
    try{

      if(!cardCount){
        setError('Oops please input a number for scratch cards !!!')
        setSuccess("" );
        return 
      }
      if(isNaN(cardCount)){
        setError('Your count input must be a number !!!')
        setSuccess("" );
        return 
      }


      setIsLoading(true)
      const res = await axios.post("/create-scratch-card",{cardCount}, {
        withCredentials: true
      });

      if(res.statusText !== "OK"){
        setSuccess('')
        setError(res.data.error)
        setIsLoading(null)
        return 
      }
      setIsLoading(null)
      setError("");
      setSuccess(res.data.data);
      setCardCount(1)
      getCards()
    }catch(err){
      setError(err.message);
      setSuccess("");
      setIsLoading(null)
      console.log(err.message)
    }
  }


  return (
    <>
      <Navbar clickF={HandleClick} />
      <Aside />
      <main>

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


        <div className="questions">
            <form onSubmit={handleScratchCard} className="scratch-form">
                <label>
                    Number of scratch cards : <input type="text" value={cardCount} onChange={(e)=>(setCardCount(e.target.value))}/>
                </label>

                {isLoading === null && <button>Generate new</button>}
                {isLoading !== null && <button>Loading...</button>}
                
            </form>
            
            <p style={{color:'whitesmoke'}}>Total number of scratch cards available : {apiDataLength}</p>
          <div className="main">
            <div className="field">
              <div className="search">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <label htmlFor="search"> : Search</label>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Scratch Cards</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>S/N</th>
                    <th>Scratch Cards</th>
                    <th>Created At</th>
                  </tr>
                </tfoot>
                <tbody>
                  {paginateData().map((item, index) => (
                    <tr key={item._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.card}</td>
                      <td>{formatDistanceToNow(new Date(item.createdAt), {addSuffix: true})}</td>
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

export default ScratchCard;
