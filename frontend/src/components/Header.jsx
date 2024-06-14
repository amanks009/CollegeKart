import './Header.css';
import {Link,useNavigate} from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';


function Header(props){
    const navigate=useNavigate()
    const handleLogout=()=>{
        localStorage.removeItem('token');
        navigate('/login')
    }
    return(
        <div className="header-container d-flex justify-content-between">
           <div className="header">
            <Link className="links" to="/">COLLEGEKART</Link>

            <input className="search" type="text"  value={props && props.search}
                onChange={(e)=> props.handlesearch && props.handlesearch(e.target.value)
                }
            />
            <button className="search-btn" onClick={()=>props.handleClick &&props.handleClick()}><FaSearch/></button>
           </div>
           <div>
                {!!localStorage.getItem('token') && 
                <Link  to="/add-product"><button className="logout-btn">Add Product </button>
                </Link>}
                {!!localStorage.getItem('token') && 
                <Link  to="/liked-products"><button className="logout-btn">LikedProduct </button>
                </Link>}
                {!localStorage.getItem('token') ?
                <Link to="/login">LOGIN!</Link> :
                <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
                }
           </div>
        </div>
    )
}

export default Header;