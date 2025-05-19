import { PersonFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";


const TakeExam = () => {
    return ( 
        <>
            <Link to='/Examportal' className="TakeExam">
               <p><PersonFill 
               style={{height:'90px',
                        width:'100px'}} />
               </p> Take Exam
            </Link>
        </>
     );
}
 
export default TakeExam;