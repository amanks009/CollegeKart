import './Header.css';
import {Link,useNavigate} from 'react-router-dom';
import categories from './categoriesList';


function Categories(props){

    const navigate=useNavigate();
    return(
        <div className="cat-conatiner">
            
            <div>
                <span className="pr-3">All Categories</span>
                { categories && categories.length>0 &&
                  categories.map((item,index)=>{
                    return(
                        <span onClick={()=>navigate('/category/'+item)} key={index} className="category">{item}</span>
                    )
                  })
                }
            </div>
        </div>
    )
}

export default Categories;