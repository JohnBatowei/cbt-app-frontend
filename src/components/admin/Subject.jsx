import Navbar from "./Navbar";
import Aside from "./Aside";
import "./styles/createStore.scss";
import "./styles/error.scss";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import the styles
import DOMPurify from 'dompurify';


import React, { useState, useEffect } from "react";
import { useRef } from "react";
import axios from "./Axios";
import { X,Eye,EyeSlash,Trash3,PlusLg,DashLg,Pen,Book } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import noImg from '../assets/question-mark-svgrepo-com.svg'

const Subject = props => {
  const { admin } = useAuthContext();
  const token = admin.token;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const fileInputRef = useRef(null);
  
  const [storeDesc, setStoreDesc] = useState("");
  const [ee,setEe] = useState('')
  const [ss,setSs] = useState('')
  const [storeName,setStoreName] = useState('')
  // const [selectedStore, setSelectedStore] = useState(null);
  const [selectedStoreProducts, setSelectedStoreProducts] = useState([]);
  // const [editingProduct, setEditingProduct] = useState(null);
  const [ imageUpdate ,setImageUpdate ] = useState({})
  const [productEditStates, setProductEditStates] = useState([]);
  // const [storeDesign,setStoreDesign] =useState('')
  
  
     const [productStates, setProductStates] = useState([]);
  
    const [openPlus, setOpenPlus] = useState({});
    const [openEyeSlash, setOpenEyeSlash] = useState({});
    const [openEdit, setOpenEdit] = useState({});
    
    const [apiData, setApiData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPagePro, setCurrentPagePro] = useState(1);
    const [activeButtonPlus, setActiveButtonPlus] = useState(null);
    const [activeButtonSee, setActiveButtonSee] = useState(null);
    
    const itemsPerPage = 10;
    const totalPages = Math.ceil(apiData.length / itemsPerPage);
    const totalPagesPro = Math.ceil(selectedStoreProducts.length / itemsPerPage);
    
    const [searchTerm, setSearchTerm] = useState("");
    // const paginateData = () => {
      //   const startIndex = (currentPage - 1) * itemsPerPage;
      //   const endIndex = startIndex + itemsPerPage;
      //   return apiData.slice(startIndex, endIndex);
      // };
      const paginateData = () => {
        const filteredData = apiData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return filteredData.slice(startIndex, endIndex);
      };
      
      
      const [searchTermEdit, setSearchTermEdit] = useState('');
      // const paginateDataPro = () => {
    //   const startIndex = (currentPagePro - 1) * itemsPerPage;
      
    //   const endIndex = startIndex + itemsPerPage;
    //   return selectedStoreProducts.slice(startIndex, endIndex);
    // };
    const paginateDataPro = () => {
      const filteredProducts = selectedStoreProducts.filter((product) =>
        product.question.toLowerCase().includes(searchTermEdit.toLowerCase())
      );
    
      const startIndex = (currentPagePro - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
    
      return filteredProducts.slice(startIndex, endIndex);
    };
    
    const { logout } = useLogout();
    const history = useHistory();
  //  const [question, setQuestion] = useState()
  
  
    const HandleClick = () => {
      logout();
      history.push("/cordportal");
    };

    const fetchData = async () => {
      try {
        // console.log(token)
        const res = await axios.get(
          "/get-subjects",
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );
  
        // console.log(res.data);
        if (res.data && Array.isArray(res.data.message)) {
          setApiData(res.data.message);
        } else {
          // console.error("API res data is not an array:", res.data);
          setApiData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
  
    const HandleFileInput = () => {
      if (fileInput) {
        return <img crossOrigin="anonymous" src={URL.createObjectURL(fileInput)} alt="" />;
      }
      return null;
    };
  
//     const handleSelectDesign = event => {
//       const selectOption = event.target.value;
//       setStoreDesign(selectOption);
// //    alert(selectOption)
//     };
  
    const handleCreateFormSubmit = async event => {
      event.preventDefault();
  
     if(storeDesc.trim() === "") {
        setEe("Please enter a valid name for a subject !!!");
        // setErrorMessage("Please enter a valid store name.");
        setSs("");
        setSuccessMessage("");
        return;
      } else {
        setEe("");
        // setErrorMessage("");
        const subjectName = storeDesc
        let formData = JSON.stringify({subjectName})
        // console.log(formData);
  
        
        try {
          const res = await axios.post("/create-subject",  formData,{
            // method: "POST",
            headers: {
              'Content-Type':'application/json',
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true
            
          });
          
          // console.log(res)
          if (res.statusText != 'OK') {
            throw new Error("Server not reachable");
          }

          setSs(res.data.message);
          // setSuccessMessage(data.message);
          fetchData();
        } catch (error) {
          alert(error.message);
        }
      }
    };
  


    const handlePageChange = newPage => {
      setCurrentPage(newPage);
    };
    const handlePageChangePro = newPage => {
      setCurrentPagePro(newPage);
    };
  
    const handlePlusSign = id => {
      setOpenPlus(prevOpenPlus => {
        return { ...prevOpenPlus, [id]: !prevOpenPlus[id] };
      });
      setActiveButtonPlus(prevState => prevState === id ? null : id);
      // setActiveButtonPlus(id);
    };
  
  
    const handleSeeButtonClick = async (subjectId) => {
  
      try {
        if(subjectId === 'refresh'){
          setStoreName('')
          // Update the state with the selected store and its products
          // setSelectedStore('');
          setSelectedStoreProducts([]);
          setOpenEyeSlash({}); 
          return
        }
        // console.log(token)
        // Fetch the products for the selected store
        const response = await axios.get(`/get-subject-questions/${subjectId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
    
        const products = response.data.questions || [];

        console.log(products)

        const storeName = response.data.subjectName ?? ''
        setStoreName(storeName)

        // Update the state with the selected store and its products
        // setSelectedStore(subjectId);
        setSelectedStoreProducts(products);
        setOpenEyeSlash({}); 
        setOpenEyeSlash(prevOpenPlus => {
          return { ...prevOpenPlus, [subjectId]: !prevOpenPlus[subjectId] };
        });
        setActiveButtonSee(subjectId);
      } catch (error) {
        console.error('Error fetching store products:', error.message);
      }
    };
    
    const handleDelete = async itemId => {
      try {
        // const status = window.confirm("Do you want to delete this file?");
  
        // if (status) {
        const res = await axios.delete(
          `/delete-subject/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );
  
        if (res.statusText === 'OK') {
          // const data = await res.json();
          setSs(res.data.message);
          setEe('')
          setErrorMessage(""); 
          fetchData();
          handleSeeButtonClick('refresh')
          
        } else {
          fetchData();
          // setErrorMessage("Failed to delete the item");
          setEe("Failed to delete the item");
          setSs("");
          setEe("");
          setSuccessMessage("");
          // setSuccessMessage("");
          console.error("Failed to delete the item");
        }
   
      } catch (error) {
        console.error("Error deleting item:", error.message);
        setEe("Error deleting item: " + error.message);
        // setErrorMessage("Error deleting item: " + error.message);
      }
    };
  
  //--------------------------------------------------------------------------------------------------------
    //upload product to the specific store
       // Function to initialize the state for a new product
    // Function to initialize the state for a new product
    const initializeProductState = () => {
      return {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        answer: "",
        // Add other fields as needed...
      };
    };
  
  
     // Function to handle changes for a specific product row
     const handleProductOptionA = (index, field, value) => {
      const updatedProductStates = [...productStates];
    
      if (!updatedProductStates[index]) {
        updatedProductStates[index] = initializeProductState();
      }
    
      updatedProductStates[index] = {
        ...updatedProductStates[index],
        [field]: value, // Just value, not value.target.value
      };
    
      setProductStates(updatedProductStates);
    };
    

    const handleProductOptionB = (index, field, value) => {
      if (!productStates[index]) {
        const updatedProductStates = [...productStates];
        updatedProductStates[index] = initializeProductState();
        setProductStates(updatedProductStates);
      }
    
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = {
        ...updatedProductStates[index],
        [field]: value, // ✅ Correct — value is the HTML string from Quill
      };
      setProductStates(updatedProductStates);
    };
    

    const handleProductOptionC = (index, field, value) => {
      if (!productStates[index]) {
        const updatedProductStates = [...productStates];
        updatedProductStates[index] = initializeProductState();
        setProductStates(updatedProductStates);
      }
    
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = {
        ...updatedProductStates[index],
        [field]: value, // ✅ Using the raw HTML string directly — correct
      };
      setProductStates(updatedProductStates);
    };
    

     const handleProductAnswer = (index, field, value) => {
      // Ensure that productStates[index] is initialized
      if (!productStates[index]) {
        const updatedProductStates = [...productStates];
        updatedProductStates[index] = initializeProductState();
        setProductStates(updatedProductStates);
      }
    
      // Update the specific field for the product
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = {
        ...updatedProductStates[index], // Preserve existing properties
        [field]: value,
      };
      setProductStates(updatedProductStates);
    };
    // const handleProductAnswer = (index, field, value) => {
    //   setProductStates(prev => {
    //     const updated = [...prev];
    //     const current = updated[index] || initializeProductState();
    //     updated[index] = {
    //       ...current,
    //       [field]: value,
    //     };
    //     return updated;
    //   });
    // };
    
     const handleProductQuestion = (index, field, value) => {
      // Ensure that productStates[index] is initialized
      if (!productStates[index]) {
        const updatedProductStates = [...productStates];
        updatedProductStates[index] = initializeProductState();
        setProductStates(updatedProductStates);
      }
    
      // Update the specific field for the product
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = {
        ...updatedProductStates[index], // Preserve existing properties
        [field]: value,
      };
      setProductStates(updatedProductStates);
    };
    
  
    const handleUploadFileInputChange = event => {
      const selectedFile = event.target.files[0];
      setFileInput(selectedFile);
    };

    
    const sanitizeQuestion = (question) => {
      return DOMPurify.sanitize(question);
    };
  
    const handlUploadProduct = async (event,subjectId,index) => {
      event.preventDefault();
        // Check if the product state for the specific index exists
    if (!productStates[index]) {
      setErrorMessage("Please fill in all the required fields");
      setSuccessMessage("");
      return;
    }
  
    let { question, optionA, optionB, optionC, answer} = productStates[index];
    
    // console.log(productStates[index]);
    // console.log(fileInput);
    // console.log(subjectId);


      if (!answer || !question || !optionA || !optionB || !optionC) {
        setEe("Please fill in all the required fields");
        // setErrorMessage("Please fill in all the required fields");
        setSuccessMessage("");
        setSs("");
        return
      }

        // Validate answer
  const trimmedAnswer = answer.trim();
  if (trimmedAnswer.length !== 1 || !['a', 'b', 'c'].includes(trimmedAnswer.toLowerCase()) || !isNaN(trimmedAnswer)) {
    setEe("Answer must be a single letter (a, b, or c) and not a number.");
    setSuccessMessage("");
    setSs("");
    return;
  }
      else {
        setErrorMessage("");
        setEe("");
        let sanitizedQuestion = sanitizeQuestion(question);
        
        const formData = new FormData();
        formData.append("subjectId", subjectId);
        formData.append("question", sanitizedQuestion);
        formData.append("file", fileInput);
        formData.append("optionA", optionA);
        formData.append("optionB", optionB);
        formData.append("optionC", optionC);
        formData.append("answer", trimmedAnswer);
  
        // alert(storeId+'  , '+productName+' , '+amount+' , '+discountPercentage+' , '+discAmount+' , '+discounted+' , '+quantity+' , '+productType)
        try {
          const res = await axios.post(
            "/create-subject-question",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              withCredentials: true
            }
          );
          
  
          if (res.status === 200) {
            setErrorMessage("");
            setEe("");
            productStates[index].question = ""
            productStates[index].optionA = ""
            productStates[index].optionB = ""
            productStates[index].optionC = ""
            productStates[index].answer = ""
            setFileInput(null)
              // Clear actual file input element
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            handleSeeButtonClick(subjectId)
            setSs(res.data.message);
            // setSuccessMessage(res.data.message);
          } else {
            setEe("Failed to upload the product. You might want to check if type was selected");
            // setErrorMessage("Failed to upload the product");
            setSuccessMessage('');
            setSs('');
          }
        } catch (error) {
          setSs('');
          setSuccessMessage('');
          setEe(error.message);
          // setErrorMessage("Error uploading the product");
        }
      }
    };
  


    const handleError = function(){
   setSs('')
   setEe('')
    }
  
  
  
    //-------------------Edit-----Section---------------------------------------------------------------------------------------------
   
  const initializeEditProductState = (product) => {
  
    return {
      subjectName: product.subjectName,
      questionId: product.questionId,
      subjectId: product.subjectId,
      question: product.question,
      optionA: product.optionA,
      optionB: product.optionB,
      optionC: product.optionC,
      answer: product.answer,
      // Add other fields as needed...
    };
  };
  
  const [activeButton, setActiveButton] = useState(null);
  const handleEdit = (productId) => {
    setActiveButton(prevState => prevState === productId ? null : productId);
    // Set the openEdit state for the specific product
    setOpenEdit((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  
    // Initialize the edit state with the existing product data
    if (selectedStoreProducts && selectedStoreProducts.length > 0) {
      const product = selectedStoreProducts.find((p) => p.questionId === productId);
      const editStateWithData = initializeEditProductState(product);
      console.log(editStateWithData)
      setProductEditStates((prevState) => ({
        ...prevState,
        [productId]: editStateWithData,
      }));
  
      // console.log('Updated productEditStates:', productEditStates);
    }
  };
  

  
  const handleEditImage = (productId, event) => {
    const selectedFile = event.target.files[0];
  
  // Update the productImages state with the selected image for the specific product
  setImageUpdate((prevImages) => ({
    ...prevImages,
    [productId]: selectedFile,
    }));
  };
  

  const handleEditField = (productId, fieldName, value) => {
    setProductEditStates((prevState) => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [fieldName]: value,
      },
    }));
  };


  // ---------Submit-------------Upadate--------------------------
  const handleProductUpdate = async (event, productID) => {
    event.preventDefault();

    const { question, optionA, optionB, optionC, answer } = productEditStates[productID];

    // return console.log(productEditStates[productID] , imageUpdate[productID])

    if (!answer || !question || !optionA || !optionB || !optionC) {
      setEe("Please fill in all the required fields");
      setSuccessMessage("");
      setSs("");
      // setErrorMessage("Please fill in all the required fields");
      // setSuccessMessage("");
      return;
    }

    const trimmedAnswer = answer.trim().toLowerCase();
    if (!['a', 'b', 'c'].includes(trimmedAnswer)) {
      setEe("Answer must be a single letter (a, b, or c) and not a number.");
    setSuccessMessage("");
    setSs("");
      return;
    }

    const formData = new FormData();
    formData.append("subjectId", productEditStates[productID].subjectId);
    formData.append("questionId", productID);
    formData.append("question", question);
    formData.append("optionA", optionA);
    formData.append("optionB", optionB);
    formData.append("optionC", optionC);
    formData.append("answer", trimmedAnswer);

    if (imageUpdate[productID]) {
      formData.append("file", imageUpdate[productID]);
    }

    try {
      const res = await axios.patch(
        `/update-question`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } , withCredentials: true}
      );

      if (res.status === 200) {
        setErrorMessage("");
        setEe("");
        handleSeeButtonClick(productEditStates[productID].subjectId)
        setSs(res.data.message);
      } else {
        setEe("Failed to update the product.");
        setSuccessMessage('');
      }
    } catch (error) {
      setEe(error.message);
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  };

  
  
  const handleDeleteProduct = async (questionId,subjectId) => {
    try {
      // Make an API call to delete the product with the given questionId
      // alert(questionId+' + '+subjectId)
      const res = await axios.delete(
        `/delete-question/${subjectId}/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );
  
      // Handle success or failure based on the response
      if (res.status === 200) {
        // Optionally, update the UI to reflect the deletion
        handleSeeButtonClick(subjectId)
        setEe('')
        setSs(res.data.message);
      } else {
        setSs(`Failed to delete product with ID ${questionId}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  


  const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };
    
 
  // const stripHtmlTags = (htmlContent) => {
  //   const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
  //   return doc.body.textContent || "";  // Extracts plain text without HTML tags
  // };


    return (

      <>
       <Navbar clickF={HandleClick} />
      <Aside />


      <main>

   
      <div className="createStore">
        {errorMessage &&
          <p className="error-message">
            {errorMessage}
          </p>}
        {successMessage &&
          <p className={`error-message ${successMessage ? "success" : ""}`}>
            {successMessage}
          </p>}
  
          <div className={`es-message ${ee ? 'override': ''} ${ss ? 'override': ''}`}>
          {ee && <p className="ee gen">{ee}  <X style={{ marginLeft: "28px", marginTop: "-8px", cursor: "pointer" }} onClick={handleError} /></p>}
          {ss && <p className="ss gen">{ss}  <X style={{ marginLeft: "28px", marginTop: "-8px", cursor: "pointer" }} onClick={handleError} /></p>}
          </div>
  
 
 
 
  {/* ---------------------------------------------create subject ----------------------------------------------------------------*/}
        <form className="createForm" onSubmit={handleCreateFormSubmit}>

          <div className="upload">
            <label className="addSubject" style={{color: 'whitesmoke'}}>Add Subject</label>
            <div className="control-input">
              <div>
                <label>Subject : </label>
                <input
                  name="displayScreen"
                  id="displayScreen"
                  value={storeDesc}
                  onChange={e => setStoreDesc(e.target.value)}
                  style={{ marginLeft: ".9em", marginTop: ".7em" }}
                  placeholder="Type in subject name"
                />
              </div>
                <button>Add new</button>
            </div>
          </div>
  
          <div className="viewImage">
            {HandleFileInput()}
          </div>
        </form>
  

  {/*  */}
        <div className="main">
          <div className="field">
            <div className="search">
            <span className='_search'>{apiData.length} Subject</span>
              <div>
              <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <label htmlFor="search" className='_search'> : Search</label>
              </div>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Subject Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>S/N</th>
                  <th>Subject Name</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                {paginateData().map((item, index) =>
                  <React.Fragment key={item._id}>
                    <tr>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.name}</td> {/* Adjust this line if needed */}
          
                      <td className="actions">
                        <button title="Delete subject" onClick={() => handleDelete(item._id)}>
                          <Trash3 />
                        </button>
                        <button title="View questions of this subject" className={activeButtonSee === item._id ? 'active' : ''} onClick={() => handleSeeButtonClick(item._id)}>{openEyeSlash[item._id] ? <Eye/>:<EyeSlash/> }</button>
                        <button title="Add new question" className={activeButtonPlus === item._id ? 'active' : ''} onClick={() => handlePlusSign(item._id)}>
                          {openPlus[item._id] ? <DashLg/> : <PlusLg/>}
                        </button>
                      </td>

                    </tr>
                    {openPlus[item._id] &&
                      <tr>
                        <td colSpan="4" className="productField">
                          <p className='_label p'>
                            add question to {item.name} 
                          </p>
                          <form onSubmit={(event) => handlUploadProduct(event, item._id, index)}>
                            <br />
                            
                          <span className='_label'>question :</span>
                          {/* <textarea id="" cols="72" rows="10" placeholder='Type in question here'  
                              value={productStates[index]?.question || ""}
                              onChange={(e) => handleProductQuestion(index, 'question', e.target.value)}
                              required>      
                         </textarea> */}
                            <div className="richTextArea">
                              <ReactQuill
                                theme="snow"
                                value={productStates[index]?.question || ""}
                                onChange={(value) => handleProductQuestion(index, 'question', value)}
                                placeholder="Type in question here..."
                                style={{ height: "250px", marginBottom: "50px" , color:'black'}} 
                              />
                            </div>


                            <div className="first create-product">
                            <span className='_label'>diagram</span>  <input
                                type="file"
                                id="productImage"
                                ref={fileInputRef}
                                onChange={handleUploadFileInputChange}
                                accept="image/*"
                              />

                              <div className="pName">
                                <label className='_label'>
                                Option A :
                                </label>
                              {/* <textarea id="" cols="72" rows="2" placeholder='Type in option A' 
                              name="optionA" 
                               value={productStates[index]?.optionA || ""}
                               onInput={(e) => handleProductOptionA(index, 'optionA', e)}
                              required> </textarea> */}

                            <div className="richTextArea">
                              <ReactQuill
                                theme="snow"
                                value={productStates[index]?.optionA || ""}
                                onChange={(value) => handleProductOptionA(index, 'optionA', value)}
                                placeholder="Type in option A"
                                style={{ height: "70px", marginBottom: "50px" , color:'black'}} 
                              />
                            </div>
                              </div>

                              <div className="pName">
                                <label className='_label'>
                                Option B :
                                </label>
                              {/* <textarea id="" cols="72" rows="2" placeholder='Type in option B'  
                               value={productStates[index]?.optionB || ""}
                               onChange={(e) => handleProductOptionB(index, 'optionB', e.target.value)}
                              required></textarea> */}

                            <div className="richTextArea">
                            <ReactQuill
                                theme="snow"
                                value={productStates[index]?.optionB || ""}
                                onChange={(value) => handleProductOptionB(index, 'optionB', value)}
                                placeholder="Type in option B"
                                style={{ height: "70px", marginBottom: "50px", color: 'black' }} 
                              />
                            </div>
                              </div>

                              <div className="pName">
                                <label className='_label'>
                                Option C :
                                </label>
                              {/* <textarea id="" cols="72" rows="2" placeholder='Type in option C'  
                               value={productStates[index]?.optionC || ""}
                               onChange={(e) => handleProductOptionC(index, 'optionC', e.target.value)}
                              required></textarea> */}

                                {/* <input type="text" style={{ zIndex: 9999, position: 'relative' }} /> */}
                            <div className="richTextArea">
                            <ReactQuill
                                theme="snow"
                                value={productStates[index]?.optionC || ""}
                                onChange={(value) => handleProductOptionC(index, 'optionC', value)}
                                placeholder="Type in option C"
                                style={{ height: "70px", marginBottom: "50px", color: 'black' }} 
                              />

                            </div>
                              </div>

                              <div className="pName">
                                <label className='_label'>
                                Correct answer Option :
                                </label>
                              <textarea id="" cols="72" rows="2" placeholder='Type in the correct answer from the options. Example  "a" or "A", "b" or "B", "c" or "C"'  
                               value={productStates[index]?.answer || ""}
                               onChange={(e) => handleProductAnswer(index, 'answer', e.target.value)}
                              required style={{ zIndex: 9999, position: 'relative' }}></textarea>


                            {/* <div className="richTextArea">
                              <ReactQuill
                                theme="snow"
                                value={productStates[index]?.answer || ""}
                                onChange={(value) => handleProductAnswer(index, 'answer', value)}
                                placeholder='Type in the correct option  "a" or "A", "b" or "B", "c" or "C"'  
                                style={{ height: "70px", marginBottom: "50px" , color:'black', border:'7px solid red',width:'100%'}} 
                              />
                            </div> */}
                              </div>
                                                                                       
                            </div>
                            
                            <input type="text" placeholder="AriTron Software"/>
                            {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
                              <div className="submitQuestion">
                              <button type="submit">
                                Upload question</button>
                              </div>
                           
                
                         
                          </form>
                        </td>
                      </tr>}
                  </React.Fragment>
                )}
              </tbody>
            </table>
  
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className='_search'>
                Page {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
  
  
  
  {/* -------------------------------------------------------------------------------------------------------------------------------------- */}
         
            <div className="storeProductTable">
                    <div className="searchProduct">
                      <div className="label">
                      <label className='_search'>{!storeName && 'Subject'}</label>{" "}
                      <label className='_search'>{storeName && storeName+'  | '+selectedStoreProducts.length +' question'}</label>{" "}
                      </div>
                      <input 
                       type="text" 
                       onChange={(e) => setSearchTermEdit(e.target.value)}
                       placeholder="Search for product" />
                    </div>


                    <table className="productTable">
                          <thead>
                            <tr>
                              <th>S/N</th>
                              <th>Questions</th>
                              <th>Diagram</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tfoot>
                            <tr>
                              <th>S/N</th>
                              <th>Questions</th>
                              <th>Diagram</th>
                              <th>Actions</th>
                            </tr>
                          </tfoot>
                          <tbody>
                            {paginateDataPro().map((product, index) => (
                            <React.Fragment key={index}>
                              <tr key={index} className="edit-tr">
                                <td>{(currentPagePro - 1) * itemsPerPage + index + 1}</td>
                                <td className="truncateText">
                                {/* {product.question } */}
                                 <div dangerouslySetInnerHTML={{ __html: product.question }} className="truncateTexts"/></td>
                                {/* <td className="truncateText">{truncateText(product.question, 6)}</td> */}
                                <td>
                               {/* {product.image && <img crossOrigin="anonymous" src={product.image} alt="" /> }{ !product.image && <img src={noImg}></img>}  */}
                               {product.image ? (
                                                <img crossOrigin="anonymous" src={product.image} alt="" onError={(e) => { e.target.onerror = null; e.target.src = noImg; }} />
                                              ) : (
                                                <img src={noImg} alt="No image available" />
                                              )}

                                </td>
                                <td className="actions">
                                <button title="Delete question" onClick={() => handleDeleteProduct(product.questionId,product.subjectId)}><Trash3/></button>
                                  <button title="Edit question"  className={activeButton === product.questionId ? 'active' : ''} onClick={() => handleEdit(product.questionId)}>
                                  {openEdit[product.questionId] ? <Book/> : <Pen/>}
                                    </button>
                                </td>
                              </tr>

                                    {openEdit[product.questionId] &&

                              <tr className="edit-container">
                                <td colSpan={4} className="editProduct">
                                    <p style={{color:"pink", fontSize:'1rem',fontWeight:'500'}}>
                                      Edit question :
                                    </p>


                                    <form onSubmit={(event) => handleProductUpdate(event, product.questionId, index)}>
                                      
                                      <div className="editable">
                                           <span>question :</span>
                                            {/* <textarea id="" cols="70" rows="10" placeholder='Type in question here'  
                                              value={productEditStates[product.questionId]?.question || ''}
                                              onChange={(e) => handleEditField(product.questionId, 'question', e.target.value)}>     
                                          </textarea> */}
                                     <div className="richTextArea" style={{background:"white",height: "283px",width:'85%', borderRadius:'5px'}}>
                                     <ReactQuill
                                                theme="snow"
                                                value={productEditStates[product.questionId]?.question || ''}
                                                onChange={(value) => handleEditField(product.questionId, 'question', value)}
                                                placeholder="Type in question here"
                                                style={{
                                                  background: "white",
                                                  color: "black",
                                                  width: "100%",
                                                  margin: "0 0 2rem 0",
                                                  height: "240px",
                                                  // border: "4px solid red",
                                                  // overflowY: "auto",  // Ensure scroll is handled
                                                }}
                                              />
                                     </div>

                                      </div>

                                      <div className="editable">
                                        <span>change diagram :</span> 
                                        <input type="file" style={{color:'whitesmoke'}} onChange={(event) => handleEditImage(product.questionId, event)}  />
                                        <div className="imgDiv">
                                          {/* {product.image && <img crossOrigin="anonymous" src={product.image} alt="Diagram" />} */}
                                          {product.image ? (
                                                <img crossOrigin="anonymous" src={`${window.location.origin}${product.image}`} alt="" onError={(e) => { e.target.onerror = null; e.target.src = noImg; }} />
                                              ) : (
                                                <img src={noImg} alt="No image available" />
                                              )}
                                        </div>

                                      </div>

                                      <div className="editable">
                                           <span>Option A :</span>
                                            {/* <textarea id="" cols="70" rows="2" placeholder='Type in question here'  
                                              value={productEditStates[product.questionId]?.optionA || ''}
                                              onChange={(e) => handleEditField(product.questionId, 'optionA', e.target.value)}>     
                                          </textarea> */}
                                          <div className="richTextArea" style={{background:"white",height: "70px",width:'85%', borderRadius:'5px'}}>
                                     <ReactQuill
                                                theme="snow"
                                                value={productEditStates[product.questionId]?.optionA || ''}
                                                onChange={(value) => handleEditField(product.questionId, 'optionA', value)}
                                                placeholder="Type in question here"
                                                style={{
                                                  background: "white",
                                                  color: "black",
                                                  width: "100%",
                                                  margin: "0 0 2rem 0",
                                                  height: "240px",
                                                  // border: "4px solid red",
                                                  // overflowY: "auto",  // Ensure scroll is handled
                                                }}
                                              />
                                     </div>
                                      </div>

                                      <div className="editable">
                                           <span>Option B :</span>
                                            {/* <textarea id="" cols="70" rows="2" placeholder='Type in question here'  
                                              value={productEditStates[product.questionId]?.optionB || ''}
                                              onChange={(e) => handleEditField(product.questionId, 'optionB', e.target.value)}>     
                                          </textarea> */}

                                          <div className="richTextArea" style={{background:"white",height: "70px",width:'85%', borderRadius:'5px'}}>
                                     <ReactQuill
                                                theme="snow"
                                                value={productEditStates[product.questionId]?.optionB || ''}
                                                onChange={(value) => handleEditField(product.questionId, 'optionB', value)}
                                                placeholder="Type in question here"
                                                style={{
                                                  background: "white",
                                                  color: "black",
                                                  width: "100%",
                                                  margin: "0 0 2rem 0",
                                                  height: "240px",
                                                  // border: "4px solid red",
                                                  // overflowY: "auto",  // Ensure scroll is handled
                                                }}
                                              />
                                     </div>
                                      </div>

                                      <div className="editable">
                                           <span>Option C :</span>
                                            {/* <textarea id="" cols="70" rows="2" placeholder='Type in question here'  
                                              value={productEditStates[product.questionId]?.optionC || ''}
                                              onChange={(e) => handleEditField(product.questionId, 'optionC', e.target.value)}>     
                                          </textarea> */}

                                          <div className="richTextArea" style={{background:"white",height: "70px",width:'85%', borderRadius:'5px'}}>
                                     <ReactQuill
                                                theme="snow"
                                                value={productEditStates[product.questionId]?.optionC || ''}
                                                onChange={(value) => handleEditField(product.questionId, 'optionC', value)}
                                                placeholder="Type in question here"
                                                style={{
                                                  background: "white",
                                                  color: "black",
                                                  width: "100%",
                                                  margin: "0 0 2rem 0",
                                                  height: "240px",
                                                  // border: "4px solid red",
                                                  // overflowY: "auto",  // Ensure scroll is handled
                                                }}
                                              />
                                     </div>
                                      </div>
                                      <div className="editable">
                                           <span>Answer :</span>
                                            <textarea id="" cols="70" rows="2" placeholder='Type in question here'  
                                              value={productEditStates[product.questionId]?.answer || ''}
                                              onChange={(e) => handleEditField(product.questionId, 'answer', e.target.value)}>     
                                          </textarea>
                                          
                                      </div>
                    
                                     
                                      <div className="updateBtnWrapper">
                                      <button className="updateBtn">Update Question</button>
                                      </div>
                                    
                                </form>
                              </td>
                              </tr>
                                      
                                      
                                      }
                            </React.Fragment>
                            ))}
                          </tbody>
                    </table>


                    <div className="pagination">
                          <button
                            onClick={() => handlePageChangePro(currentPagePro - 1)}
                            disabled={currentPagePro === 1}
                          >
                            Previous
                          </button>
                          <span className='_search'>
                            Page {currentPagePro}
                          </span>
                          <button
                            onClick={() => handlePageChangePro(currentPagePro + 1)}
                            disabled={currentPagePro >= totalPagesPro}
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
export default Subject;