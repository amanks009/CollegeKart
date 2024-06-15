import Header from './Header';
import {useEffect,useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import axios from 'axios';
import Categories from './Categories';
// import { isHtmlElement } from 'react-router-dom/dist/dom';
// import {AiOutlineHeart} from 'react-icons/fa';
import {FaHeart,FaRegHeart} from 'react-icons/fa';
import './Home.css'


function Home(){

    const navigate=useNavigate()
    const [cproducts,setcproducts]=useState([]);
    const [products,setproducts]=useState([]);
    const [search,setsearch]=useState('');
    const [issearch,setissearch]=useState(false);
 

    // useEffect(()=>{
    //     // console.log(localStorage.getItem('token'))
    //     if(!localStorage.getItem('token')){
    //         navigate('/login')
    //     }
    // },[])

    useEffect(()=>{
        const url='http://localhost:4000/get-products';
        axios.get(url)
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
        
    },[])


    const handlesearch = (value)=>{
        // console.log('hh',value);
        setsearch(value);
    }
    const handleClick=()=>{

        const url='http://localhost:4000/search?search=' + search;
        axios.get(url)
        .then((res)=>{
            // console.log(res.data)
            setcproducts(res.data.products);
            setissearch(true);
        })
        .catch((err)=>{
            // console.log(err)
            alert('err is here')
        })


        //HERE WE WERE SEARCHING LOCALLY
        // console.log('products',products);
        // let filteredProducts=products.filter((item)=>{
        //     if( item.pname.toLowerCase().includes(search.toLowerCase()) 
        //         || item.pdesc.toLowerCase().includes(search.toLowerCase()) || 
        //         item.category.toLowerCase().includes(search.toLowerCase()))
            
        //     {
        //         return item;
        //     }
        // });
        // setcproducts(filteredProducts)

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

    const handleProduct=(id)=>{
        navigate('/product/'+ id)
    }

    return (
        <div>
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick}/>
            <Categories handleCategory={handleCategory}/>
            {/* <h2>My products:</h2> */}
            {issearch && cproducts && <h5>Search Results
                    <button className="clear-btn" onClick={()=>setissearch(false)}>Clear</button>
                </h5>}
            
            {issearch && cproducts && cproducts.length==0 && <h5>NO Result Found</h5>}
            {issearch &&  <div className="d-flex justify-content-center flex-wrap">
            {cproducts && cproducts.length >0 &&
                cproducts.map((item,index)=>{
                    // console.log('hello')
                    return (
                        <div onClick={()=>handleProduct(item._id)} key={item._id} className="card m-3">
                            {/* <AiOutlineHeart/> */}
                            <div onClick={()=>handleLike(item._id)} classname="icon-con">
                                <FaRegHeart className="icons"/>
                            </div>
                            <img width="250px" height="170px" src={'http://localhost:4000/'+item.pimage}/>
                            <h3 className="m-2 price-text">Rs. {item.price} /-</h3> 
                            <p className="m-2">{item.pname} | {item.category} </p>
                            
                            <p className="m-2 text-success">{item.pdesc}</p>
                            
                        </div>
                    )
                })
            }
            </div>}
            {/* <h5>all results</h5> */}
           {!issearch && <div className="d-flex justify-content-center flex-wrap">
                {products && products.length >0 &&
                    products.map((item,index)=>{
                        // console.log('hello')
                        return (
                            <div  onClick={()=>handleProduct(item._id)} key={item._id} className="card m-3">
                                <div onClick={()=>handleLike(item._id)} className="icon-con">
                                    <FaRegHeart className="icons"/>
                                </div>
                                <img width="250px" height="170px" src={'http://localhost:4000/'+item.pimage}/>
                                <h3 className="m-2 price-text">Rs. {item.price} /-</h3>
                                <p className="m-2">{item.pname} | {item.category} </p>
                                 
                                <p className="m-2 text-success">{item.pdesc}</p>
                                
                            </div>
                        )
                    })
                }
            </div>}
        </div>
    )
}

export default Home;