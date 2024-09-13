import Header from './Header';
import {useEffect,useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import axios from 'axios';
import Categories from './Categories';
// import { isHtmlElement } from 'react-router-dom/dist/dom';
// import {AiOutlineHeart} from 'react-icons/fa';
import {FaHeart,FaRegHeart} from 'react-icons/fa';
import './Home.css'


function MyProducts(){

    const navigate=useNavigate()
    const [cproducts,setcproducts]=useState([]);
    const [products,setproducts]=useState([]);
    const [search,setsearch]=useState('');
    const [refresh,setrefresh]=useState(false);
 

    // useEffect(()=>{
    //     // console.log(localStorage.getItem('token'))
    //     if(!localStorage.getItem('token')){
    //         navigate('/login')
    //     }
    // },[])

    useEffect(()=>{
        const url='http://localhost:4000/my-products';
        let data={ userId: localStorage.getItem('userId')}
        axios.post(url,data)
        .then((res)=>{
            // console.log(res);
            if(res.data.products){
                setproducts(res.data.products);
                // setcproducts(res.data.products);
            }
        })
        .catch((err)=>{
            // console.log(err)
            alert('err is here')
        })
        
    },[refresh])


    const handlesearch = (value)=>{
        // console.log('hh',value);
        setsearch(value);
    }
    const handleClick=()=>{
        // console.log('products',products);
        let filteredProducts=products.filter((item)=>{
            if( item.pname.toLowerCase().includes(search.toLowerCase()) 
                || item.pdesc.toLowerCase().includes(search.toLowerCase()) || 
                item.category.toLowerCase().includes(search.toLowerCase()))
            
            {
                return item;
            }
        });
        setcproducts(filteredProducts)

    }

    const handleCategory=(value)=>{
        // console.log(value,"v");
        let filteredProducts=products.filter((item)=>{ 
            if(item.category.toLowerCase()==(value.toLowerCase()))       
            {
                return item;
            }
        });
        // console.log(products);
        setcproducts(filteredProducts)
    }

    const handleLike = (productId)=>{
        // console.log('userId','producId',productId)
        let userId=localStorage.getItem('userId')  
        const url='http://localhost:4000/like-product';
        const data={userId,productId}
        axios.post(url,data)
        .then((res)=>{
            alert('Liked product')
        })
        .catch((err)=>{
            console.log(err)
            alert('err is here')
        })
    }

    const handleDel=(pid)=>{
        // console.log(pid);
        if(!localStorage.getItem('userId')){
            alert('Login First')
            return ;
        }
        const url='http://localhost:4000/delete-product';
        const data={
            pid,
            userId : localStorage.getItem('userId')
        }
        
        axios.post(url,data)
        .then((res)=>{
            if(res.data.message){
                alert('Product removed')
                setrefresh(!refresh)
            }
        })
        .catch((err)=>{
            alert('server error')
        })
    }

    return (
        <div>
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick}/>
            <Categories handleCategory={handleCategory}/>
            <div className="d-flex justify-content-center flex-wrap">
            {cproducts && cproducts.length >0 &&
                cproducts.map((item,index)=>{
                    // console.log('hello')
                    return (
                        <div key={item._id} className="card m-3">
                            {/* <AiOutlineHeart/> */}
                            <div onClick={()=>handleLike(item._id)} classname="icon-con">
                                <FaRegHeart className="icons"/>
                            </div>
                            <img width="200px" height="200px" src={'http://localhost:4000/'+item.pimage}/>
                            <p className="m-2">{item.pname} | {item.category} </p>
                            <h3 className="m-2 text-danger">{item.price}</h3> 
                            <p className="m-2 text-success">{item.pdesc}</p>
                            {/* <button>Delete</button> */}
                        </div>
                    )
                })
            }
            </div>
            {/* <h5>all results</h5> */}
            <div className="d-flex justify-content-center flex-wrap">
                {products && products.length >0 &&
                    products.map((item,index)=>{
                        // console.log('hello')
                        return (
                            <div key={item._id} className="card m-3">
                                <div onClick={()=>handleLike(item._id)} className="icon-con">
                                    <FaRegHeart className="icons"/>
                                </div>
                                <img width="250px" height="200px" src={'http://localhost:4000/'+item.pimage}/>
                                <p className="m-2">{item.pname} | {item.category} </p>
                                <h5 className="m-2 text-danger">{item.price}</h5> 
                                <p className="m-2 text-danger"><Link to={ `/edit-product/${item._id}`}>Edit product</Link></p> 
                                {/* <p className="m-2 text-success">{item.pdesc}</p> */} 
                                <button onClick={()=>handleDel(item._id)}>Delete</button>
                            </div>
                        )
                    })
                }
            </div>

            
        </div>
    )
}

export default MyProducts;