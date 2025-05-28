import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/studentLogout";
import { useAuthContextStudent } from "../../hooks/useAuthStudentCon";
import './styles/dashboard.scss'
// import icon from '../../assets/'


const Dashboard = () => {
  // const { logout } = useLogout();
  const history = useHistory();
  const { student } = useAuthContextStudent();
  const { logout } = useLogout();


  // console.log('confirming data', student.image)
  // Logout handler
  const handleLogout = () => {
    logout();
    history.push("/Examportal");
  };


  const handleExamButton = function(event){
    event.preventDefault()
    history.push('/exam')
  }



    // Image Validator function
    const imgValidator = () => {
      const imageUrl = student?.image;
      // console.log(imageUrl)
      if (imageUrl) {
        // Extract filename from URL
        const filename = imageUrl.split('/').pop();
        if(filename){
          return <img crossOrigin="anonymous" src={`${window.location.origin}${imageUrl}`} alt={filename} />;
        }
      }
      
      // Default SVG when no image is available
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
      );
    };

  return (
    <div className="dashboard-wrapper">
    <div className="dashboard">
      <div className="logout">
        <div className="wrap-logout">
        <span>You have {student?.message?.timer} minutes for this exam</span>
        <button onClick={handleLogout} className="logout-button">
        Logout 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
        <path d="M7.5 1v7h1V1z"/>
        <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
        </svg>
        </button>
        </div>
        <div className="goodluck">
            <h3>goodluck !!!</h3>
        </div>
      </div>

      <section>
        <div className="sub-parent-wrapper">
          <div className="left">
            <h3>Subjects</h3>
            <div className="subject">
              {student?.message?.subject?.length > 0 ? (
                student.message.subject.map((item, index) => (
                  <div key={item._id || index} className="subjects">
                    <label>{index + 1},</label> <span>{item.name}</span>
                  </div>
                ))
              ) : (
                <p>No subjects available</p>
              )}
            </div>
          </div>

          <div className="mid">
            <div className="mid-top">
                <div className="img">
                  {imgValidator()}
                </div>
                
                <p><label>name</label> : <span>{student?.message?.candidateName}</span></p>
                <p><label>profile code</label> : <span>{student?.message?.profileCode}</span></p>
                {student?.message?.phone && <p><label>Phone Number</label> : <span>{student?.message?.phone}</span></p>}
            </div>
                <form onSubmit={handleExamButton}>
                    <button>Start exam</button>
                </form>
          </div>

          <div className="right">
            <h3>Instructions</h3>
            <div className="instr">
                <p><span>1</span> You can logout if you are not sure you want to start this exam</p>
                <p><span>2</span> Do not click on the submit button if you are not done with the entire exam</p>
                <p><span>3</span> Do not open another tab for that will automatically end your exams</p>
                <p><span>4</span> All subjects end at the same time frame</p>
                <p><span>5</span> Call only the officials if you need a technical assistant</p>
                <p><span>6</span> To make use of a calculator, click on the calculator icon, then after use click on it again to close</p>
                <p><span>7</span> You can use the keyboard to select options and also use the arrow keys to move left and right</p>
            </div>
          </div>
          
        </div>
      </section>

      <footer>
        <p>All rights reserved | AriTron LTD @2025</p>
      </footer>
    </div>
    </div>
  );
};

export default Dashboard;
