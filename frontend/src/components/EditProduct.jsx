import Header from './Header';
import {useEffect,useState} from 'react';
import {useNavigate,Link,useParams} from 'react-router-dom';
import axios from "axios";
import categories from './categoriesList';


function EditProduct(){

    const navigate=useNavigate()
    const [pname,setpname]=useState('');
    const [pdesc,setpdesc]=useState('');
    const [price,setprice]=useState('');
    const [category,setcategory]=useState('Cycle');
    const [pimage,setpimage]=useState('');
    const [pimage2 , setpimage2 ] = useState('');
    const [poldimage,setpoldimage]=useState('');
    const [poldimage2 , setpoldimage2 ] = useState('');
    const p=useParams();



    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/login')
        }
    },[])

    useEffect(()=>{
        const url='http://localhost:4000/get-product/'+p.productId;
        axios.get(url)
        .then((res)=>{
            console.log(res)
            if(res.data.product){
                // setproduct(res.data.product)
                let product=res.data.product;
                setpname(product.pname)
                setpdesc(product.pdesc)
                setprice(product.price)
                setcategory(product.category)
                setpoldimage(product.pimage)
                setpoldimage2(product.pimage2)
            }
        })
        .catch((err)=>{
            // console.log(err)
            alert('err is here')
        })
        
    },[])

    const handleApi=()=>{

        navigator.geolocation.getCurrentPosition((position)=>{
            const formData= new FormData();
            formData.append('plat',position.coords.latitude)
            formData.append('plong',position.coords.longitude)
            formData.append('pname',pname);
            formData.append('pdesc',pdesc);
            formData.append('price',price);
            formData.append('category',category);
            formData.append('pimage',pimage);
            formData.append('pimage2',pimage2);
            formData.append('userId',localStorage.getItem('userId'));

            const url='http://localhost:4000/add-product';
            axios.post(url,formData)
            .then((res)=>{
                console.log(res)
                if(res.data.message){
                    alert(res.data.message);
                    navigate('/');
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            })
    }

    return (
        <div>
            <Header/>
            <div className="p-3">
                <h2>Edit product here:</h2>
                <label>Product name:</label>
                <input className="form-control" type="text" value={pname}
                    onChange={(e)=>{
                        setpname(e.target.value)
                    }}
                />
                <label>Product Description:</label>
                <input className="form-control" type="text" value={pdesc}
                    onChange={(e)=>{
                        setpdesc(e.target.value)
                    }}
                />
                <label>Product Price:</label>
                <input className="form-control" type="text" value={price}
                    onChange={(e)=>{
                        setprice(e.target.value)
                    }}
                />
                <label>Product Category:</label>
                <select className="form-control" value={category}
                    onChange={(e)=>{
                        setcategory(e.target.value)
                    }}
                >
                    {/* <option>Cycles</option>
                    <option>Laptop</option>
                    <option>Mobiles</option>
                    <option>Beds</option>
                    <option>Notes</option>
                    <option>Kettle</option>
                    <option>others</option> */}
                    {console.log(categories.length)}
                    {
                        categories && categories.length>0 &&
                        categories.map((item,index)=>{
                            return(
                                <option key={'option'+index}>{item}</option>
                            )
                        })
                    }
                </select>
                <label>Product Image:</label>
                <input style={{ width:'50%'}} className="form-control" type="file"
                    onChange={(e)=>{
                        setpimage(e.target.files[0])
                    }}
                    />
                    <img src={'http://localhost:4000/'+poldimage } width={100} height={50} />
                    <br/>
                <label>Product Second Image:</label>
                <input style={{ width:'50%'}} className="form-control" type="file"
                    onChange={(e)=>{
                        setpimage2(e.target.files[0])
                    }}
                />
                <img src={'http://localhost:4000/'+poldimage2 } width={100} height={50} />
                <br></br>
                <button onClick={handleApi} className="btn btn-primary mt-3">SUBMIT</button>
            </div>
        </div>
    )
}

export default EditProduct;