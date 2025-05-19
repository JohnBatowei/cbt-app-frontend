import { Link } from "react-router-dom";
import './styles/thankyou.scss'
const Thankyou = () => {
    return ( 
        <div className="thank-you-wrapper">
        <div className="thank-you">
            <div className="congrat">
                <h1>Congratulations</h1>
                <p>You've successfully completed your exams! 🌟</p>
                <p>We're proud of your achievement and wish you all the best.</p>
                <p>You can leave the hall now, have a nice day.</p>
                <Link to='/Examportal'>Take Another Exam</Link>
            </div>
        </div>
        </div>
     );
}
 
export default Thankyou;
