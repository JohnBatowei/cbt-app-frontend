import { Link } from "react-router-dom";
import { PersonFillSlash } from 'react-bootstrap-icons'

const Cordinator = () => {
    return ( 
        <>
            <Link to='/cordportal' className="Cordinator">
              <p><PersonFillSlash style={{height:'90px',
                        width:'100px'}} /></p> For Cordinators
            </Link>
        </>
     );
}
 
export default Cordinator;