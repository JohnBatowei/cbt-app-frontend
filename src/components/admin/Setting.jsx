import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useEffect, useState, useCallback, useRef } from "react";
import "./styles/setting.scss";
import Navbar from "./Navbar";
import Aside from "./Aside";
import axios from "./Axios";
import { X,ArrowRight, ArrowDownCircleFill} from "react-bootstrap-icons";
import { useAuthContext } from "../../hooks/useAuthContext";


// Reusable component for handling header changes
const HeaderChangeForm = ({
  title,
  currentHeader,
  headerValue,
  setHeaderValue,
  onSubmit
}) => (
  <div className="header-section">
    <div>
      <span>{title} is <ArrowRight size={18} style={{ marginLeft: "6px" }} /> </span> <h2>{currentHeader}</h2>
    </div>
    <p>
      {/* <span>You can  with the input field below <ArrowDownCircleFill size={18} style={{ marginLeft: "6px" }} /></span> */}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={headerValue}
          placeholder={`Change heading ${currentHeader}`}
          onChange={(e) => setHeaderValue(e.target.value)}
        />
        <button>Update</button>
      </form>
    </p>
  </div>
);

const Setting = () => {
  const { admin,dispatch } = useAuthContext();

  const { logout } = useLogout();
  const history = useHistory();
  const [headers, setHeaders] = useState({
    frontPageHeader: "",
    cooHeader: "",
    canHeader: "",
    resultHeader: "",
    rFrontPage: "AriTron CBT Software",
    rCoo: "Coordinators Portal",
    rCan: "CBT Exam Portal",
    rResult: "Candidate result Portal"
  });
  const [message, setMessage] = useState({ type: "", content: "" });
  const [selectedResultOption, setSelectedResultOption] = useState("NO");
  const [changePasswrd,setChangePassword] = useState('')
  const [changeName,setChangeName] = useState('')
  const [selectedImage,setSelectedImage] = useState(null)
  const [batchAwaitTime, setBatchAwaitTime] = useState('')
  const [numberOfQuestions, setNumberOfQuestions] = useState('')
  const fileInputRef = useRef(null);
  // const [getBatchAwaitTime, setGetBatchAwaitTime] = useState('')
  const handleClick = () => {
    logout();
    history.push("/cordportal");
  };

  const handleError = () => {
    setMessage({ type: "", content: "" });
  };

  const fetchBatchAwaitTime = useCallback(async () => {
    try {
      const res = await axios.get("/batchAwaitTime", { withCredentials: true });
  
      if (res.status === 200) {
        const batchAwaitTime = res?.data?.data?.batchAwaitTime ?? null;
        const numberOfQues = res?.data?.numOfQuest?.numberOfQuestionPerSubject ?? null;
  
        const storedAdmin = JSON.parse(localStorage.getItem('admin')) || {};
  
        const updatedAdmin = {
          ...storedAdmin,
          ...(batchAwaitTime && { batchTiming: batchAwaitTime }),
          ...(numberOfQues && { numberOfQues }), // Only add if not null
        };
  
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        dispatch({ type: 'LOGIN', payload: updatedAdmin });
  
        // For UI update if needed
        // if (batchAwaitTime) setGetBatchAwaitTime(batchAwaitTime);
      }
    } catch (error) {
      console.error("Error fetching batch await time:", error);
    }
  }, []);
  


  const fetchHeaders = useCallback(async () => {
    try {
      const res = await axios.get("/all-headers", { withCredentials: true });
      if (res.status === 200 && res.data) {
        const headerData = res.data.data;
        const updatedHeaders = {
          rFrontPage:
            headerData.find((item) => item.deff === "f")?.frontPage ||
            "AriTron CBT Software",
          rCoo:
            headerData.find((item) => item.deff === "coo")?.corPage ||
            "Coordinators Portal",
          rCan:
            headerData.find((item) => item.deff === "can")?.canPage ||
            "CBT Exam Portal",
          rResult:
            headerData.find((item) => item.deff === "result")?.resultPage ||
            "Candidate result Portal"
        };
        setHeaders((prevHeaders) => ({ ...prevHeaders, ...updatedHeaders }));
        const confirmationSetting = headerData.find(
          (item) => item.deff === "confirmation"
        )?.confirmation;
        setSelectedResultOption(confirmationSetting === "yes" ? "YES" : "NO");
      }
    } catch (error) {
      console.error("Error fetching headers", error);
    }
  }, []);


  useEffect(() => {
    fetchBatchAwaitTime();
    fetchHeaders();
  }, [fetchHeaders,fetchBatchAwaitTime]);


  const handleHeaderChange = async (type, headerValue) => {
    if (!headerValue) {
      setMessage({
        type: "error",
        content: `Changing your ${type} header must not be empty`
      });
      alert(
        `Changing your ${
          type.includes("f")
            ? "front page"
            : type.includes("result")
            ? "result"
            : type.includes("coo")
            ? "coordinators"
            : type.includes("can")
            ? "candidate"
            : ""
        } header must not be empty`
      );
      return;
    }
    try {
      const res = await axios.post(
        `/change-headers/${type}`,
        { body: headerValue },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setHeaders({
          frontPageHeader: "",
          cooHeader: "",
          canHeader: "",
          resultHeader: "",
        })
        setMessage({ type: "success", content: res.data.data });
        fetchHeaders(); // Update the headers after a successful change
      }
    } catch (error) {
      console.error(`Error changing ${type} header`, error);
      setMessage({
        type: "error",
        content: "An error occurred while changing the header"
      });
    }
  };

  const handleResultState = async (event) => {
    const selectedValue = event.target.value;
    setSelectedResultOption(selectedValue);

    let confirmationMessage = "";
    if (selectedValue === "YES") {
      confirmationMessage =
        "Press ok if you want the student to see their result after taken their exams";
    } else if (selectedValue === "NO") {
      confirmationMessage =
        "You are about to turn off the feature for your students to see their result on their screen after taken their exams";
    }

    if (confirmationMessage && window.confirm(confirmationMessage)) {
      try {
        const res = await axios.post(
          `/change-headers/${"confirmation"}`,
          { body: selectedValue },
          { withCredentials: true }
        );

        if (res.status === 200) {
          setMessage({
            type: "success",
            content: "Result visibility setting updated successfully."
          });
        } else {
          setMessage({
            type: "error",
            content: "Failed to update result visibility setting."
          });
        }
      } catch (error) {
        console.error("Error updating result state", error);
        setMessage({
          type: "error",
          content:
            "An error occurred while updating the result visibility setting."
        });
      }
    }
  };


  const handleChangePassword = async (e) => {
    try {
      e.preventDefault();
      // console.log(admin.email, changePasswrd);
      const decision = window.confirm(`${admin.name}, press OK if you want to change your password`);
      if (decision) {
        const res = await axios.put('/change-password', {
          email: admin.email,
          newPassword: changePasswrd
        },{ withCredentials: true });
  
        if (res.status === 200) {
          setChangePassword('');
          alert(res.data.message);
        }
      }
    } catch (error) {
      console.error('Password change failed:', error);
      alert("Failed to change password. Please try again.");
    }
  };
  

  // console.log(admin);
  const handleChangeProfileImage = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append('image', selectedImage);
    // formData.append('adminId', admin._id); // Or use req.admin from token
  
    try {
      const res = await axios.put('/update-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },{ withCredentials: true });
  
      if (res.status === 200) {
        alert(res.data.message);
        
      // Get the current admin from localStorage
      const storedAdmin = JSON.parse(localStorage.getItem('admin'));

      // Update the image path (adjust key depending on what backend sends)
      const updatedAdmin = {
        ...storedAdmin,
        image: res.data.newImage 
      };

      // Update localStorage
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));

      // Update context
      dispatch({ type: 'LOGIN', payload: updatedAdmin });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Failed to update profile image.");
    }
  };


  const handleNameChange = async (e) => {
    e.preventDefault();
    
    if (!changeName) {
      alert("Name cannot be empty");
      return;
    }
  
    try {
      const res = await axios.put('/name-change', {name: changeName},{ withCredentials: true });
  
      if (res.status === 200) {
        alert(res.data.message);
        
      // Get the current admin from localStorage
      const storedAdmin = JSON.parse(localStorage.getItem('admin'));

      // Update the image path (adjust key depending on what backend sends)
      const updatedAdmin = {
        ...storedAdmin,
        name: res.data.newName 
      };

      // Update localStorage
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));

      // Update context
      dispatch({ type: 'LOGIN', payload: updatedAdmin });
        setChangeName('')
      }
    } catch (error) {
      console.error("Name failed to update", error);
      alert("Failed to update profile name.");
    }
  };
  
  const handleChangeBatchAwaitTime = async (e) => {
    e.preventDefault();
    
    const decision = window.confirm(`Click OK to change batch await timing else cancel`);
    if (!decision)return;
  
    try {
      const res = await axios.put('/change-batchAwaitTime', {
        batchAwaitTime
      },
      {withCredentials: true})
  
      if (res.status === 200) {
        alert(`${res.data.message} ${res.data.newName} minutes`);
        
      // Get the current admin from localStorage
      const storedAdmin = JSON.parse(localStorage.getItem('admin'));

      // Update the image path (adjust key depending on what backend sends)
      const updatedAdmin = {
        ...storedAdmin,
        batchTiming: res.data.newName 
      };

      // Update localStorage
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));

      // Update context
      dispatch({ type: 'LOGIN', payload: updatedAdmin });
        setBatchAwaitTime('')
      }
    } catch (error) {
      console.error("Name failed to update", error);
      alert("Failed to update profile name.");
    }
  };
 

  const handleNumberOfQuestions = async (e) => {
    e.preventDefault();
    
    const decision = window.confirm(`Click OK to set number of questions per subjects`);
    if (!decision)return;
    if (isNaN(numberOfQuestions) || numberOfQuestions <1)return;
  
    try {
      const res = await axios.put('/number-of-questions', {
        numberOfQuestionPerSubject: numberOfQuestions
      },
      {withCredentials: true})
  
      if (res.status === 200) {
        alert(`${res.data.message} ${res.data.newNumQuest} minutes`);
        
      // Get the current admin from localStorage
      const storedAdmin = JSON.parse(localStorage.getItem('admin'));

      // Update the image path (adjust key depending on what backend sends)
      const updatedAdmin = {
        ...storedAdmin,
        numberOfQues: res.data.newNumQuest 
      };

      // Update localStorage
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));

      // Update context
      dispatch({ type: 'LOGIN', payload: updatedAdmin });
        setBatchAwaitTime('')
      }
    } catch (error) {
      console.error("Name failed to update", error);
      alert("Failed to update profile name.");
    }
  };


  return (
    <div className="Setting">
      <Navbar clickF={handleClick} />
      <Aside />
      <main className="setting-main">
        {message.content && (
          <div className={`es-message ${message.type}`}>
            <p className={`${message.type} gen`}>
              {message.content}
              <X
                style={{
                  marginLeft: "28px",
                  marginTop: "-8px",
                  cursor: "pointer"
                }}
                onClick={handleError}
              />
            </p>
          </div>
        )}

        <div className="change-wrapper">
          <HeaderChangeForm
            title="Front page heading"
            currentHeader={headers.rFrontPage}
            headerValue={headers.frontPageHeader}
            setHeaderValue={(value) =>
              setHeaders((prev) => ({ ...prev, frontPageHeader: value }))
            }
            onSubmit={(e) => {
              e.preventDefault();
              handleHeaderChange("f", headers.frontPageHeader);
            }}
          />

          <HeaderChangeForm
            title="Coordinators heading"
            currentHeader={headers.rCoo}
            headerValue={headers.cooHeader}
            setHeaderValue={(value) =>
              setHeaders((prev) => ({ ...prev, cooHeader: value }))
            }
            onSubmit={(e) => {
              e.preventDefault();
              handleHeaderChange("coo", headers.cooHeader);
            }}
          />

          <HeaderChangeForm
            title="Candidate heading"
            currentHeader={headers.rCan}
            headerValue={headers.canHeader}
            setHeaderValue={(value) =>
              setHeaders((prev) => ({ ...prev, canHeader: value }))
            }
            onSubmit={(e) => {
              e.preventDefault();
              handleHeaderChange("can", headers.canHeader);
            }}
          />

          <HeaderChangeForm
            title="Candidate result heading"
            currentHeader={headers.rResult}
            headerValue={headers.resultHeader}
            setHeaderValue={(value) =>
              setHeaders((prev) => ({ ...prev, resultHeader: value }))
            }
            onSubmit={(e) => {
              e.preventDefault();
              handleHeaderChange("result", headers.resultHeader);
            }}
          />
        </div>
        <br />
        <section className="second">
          <div className="result">
            <span>
              Do you want students to see their result after taking their exam?
            </span>
            <form onChange={handleResultState}>
              <input
                type="radio"
                name="result"
                value="YES"
                checked={selectedResultOption === "YES"}
              />
              <big>Yes</big>
              <input
                type="radio"
                name="result"
                value="NO"
                checked={selectedResultOption === "NO"}
              />
              <big>No</big>
            </form>
          </div>
<br />
          <div className="change-password">
            <form onSubmit={handleNameChange}>
            <span>Update profile name<ArrowDownCircleFill size={18} style={{ marginLeft: "6px" }} /></span>
            <div>
            <input type="text" minLength={6} value={changeName} onChange={(e)=>setChangeName(e.target.value)} placeholder={`${admin?.name}`} required/>
            <button>Update</button>
            </div>
            </form>
<br />
            <form onSubmit={handleChangePassword}>
            <span>Update password below <ArrowDownCircleFill size={18} style={{ marginLeft: "6px" }} /></span>
            <div>
            <input type="text" minLength={6} value={changePasswrd} onChange={(e)=>setChangePassword(e.target.value)} placeholder="Type in new password" required/>
            <button>Update</button>
            </div>
            </form>
<br />
            <form onSubmit={handleChangeProfileImage}>
            <span>
              Update profile image below <ArrowDownCircleFill size={18} style={{ marginLeft: "6px" }} />
            </span>
            <div>
            <input 
              style={{color: 'whitesmoke'}}
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={(e) => setSelectedImage(e.target.files[0])} 
              required 
            />
            <button type="submit">Update</button>
            </div>
          </form>
<br />
            <form onSubmit={handleChangeBatchAwaitTime}>
            {admin.batchTiming && <p className="batch-setting">Current batch await time is <i>{admin.batchTiming}</i>  minutes </p>}
            {!admin.batchTiming && <span>Set batch await time (Default is 15 minutes)  <ArrowDownCircleFill size={18} style={{ marginLeft: "6px" }} /></span>}
            <div>
            <input 
             
              type="number" 
              value={batchAwaitTime}
              onChange={(e) => setBatchAwaitTime(e.target.value)} 
              placeholder="Set await time  "
              required 
            />
            <button type="submit">Update</button>
            </div>
          </form>
<br />
            <form onSubmit={handleNumberOfQuestions}>
            {admin.numberOfQues && <p className="batch-setting">Number of questions <i>{admin.numberOfQues}</i>/subject  <ArrowDownCircleFill size={18} style={{ marginLeft: "6px" }} /></p>}
            {!admin.numberOfQues && <span>Number of questions by default is 50/subjects <ArrowDownCircleFill size={18} style={{ marginLeft: "6px" }} /></span>}
            <div>
            <input 
             
              type="number" 
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)} 
              placeholder="Set the number of questions per subject"
              required 
            />
            <button type="submit">Update</button>
            </div>
          </form>

          </div>
        </section>
      </main>
    </div>
  );
};

export default Setting;
