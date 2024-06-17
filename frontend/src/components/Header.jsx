import './Header.css';
import {Link,useNavigate} from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';


function Header(props){

    const  [ loc , setLoc]=useState(null);
    const [ showover, setshowover ]=useState(false);


    const navigate=useNavigate()
    const handleLogout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('userId')
        navigate('/login')
    }

    let locations =[
        {
            "latitude":11.0420173,
            "longitude":76.9758697,
            "placeName":"NIT Trichy,Trichy"
        },
        {
            "latitude":13.0108,
            "longitude":74.7943,
            "placeName":"NIT Surathkal,Surathkal"
        },
        {
            "latitude":25.4917,
            "longitude":81.8632,
            "placeName":"NIT Allahabad,Allahabad"
        }
    ]


    return(
        <div className="header-container d-flex justify-content-between">
           <div className="header">
            <Link className="links" to="/">COLLEGEKART</Link>
            <select value={loc} onChange={(e)=>{
                localStorage.setItem('userLoc',e.target.value)
                setLoc(e.target.value)
            }}>
                {
                    locations.map((item,index)=>{
                        return (
                            <option value={  `${item.latitude}, ${item.longitude}`  } >
                                {item.placeName}
                            </option>
                        )
                    })
                }
            </select>
            <input className="search" type="text"  value={props && props.search}
                onChange={(e)=> props.handlesearch && props.handlesearch(e.target.value)
                }
            />
            <button className="search-btn" onClick={()=>props.handleClick &&props.handleClick()}><FaSearch/></button>
           </div>
           <div>
                <div className="r-icon"onClick= {()=>{setshowover(!showover)}}>
                    N
                </div>

                {showover && <div classNmae="r-icon-list">
                    <div>
                        {!!localStorage.getItem('token') && 
                        <Link  to="/liked-products"><button className="logout-btn">LikedProduct </button>
                        </Link>}
                    </div>
                    <div>
                        {!!localStorage.getItem('token') && 
                        <Link  to="/add-product"><button className="logout-btn">Add Product </button>
                        </Link>}
                    </div>
                    <div>
                        {!localStorage.getItem('token') ?
                        <Link to="/login">LOGIN!</Link> :
                        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
                        }
                    </div>
                </div>}
           </div>
        </div>
    )
}

export default Header;