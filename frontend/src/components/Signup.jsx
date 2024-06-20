import Header from './Header';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
function Signup(){

    const navigate=useNavigate();
    const [username,setusername]=useState('')
    const [password,setpassword]=useState('')
    const [email,setemail]=useState('')
    const [mobile,setmobile]=useState('')


    const handleApi=()=>{
        // console.log({username,password});
        const url='http://localhost:4000/signup';
        const data={ username , password , mobile , email };
        axios.post(url,data)
        .then((res)=>{
            // console.log(res.data)
            if(res.data.message){
                alert(res.data.message)
                navigate('/login')
            }
        })
        .catch((err)=>{
            // console.log(err)
            alert('SERVER ERROR')
        })
    }
    return(
        <div>
            <Header/>
            <div className="p-3 m-3">
                <h3>Welcome to SignUp Page</h3>
                <br></br>
                Username:
                <input className="form-control" type="text" value={username}
                onChange={(e)=>{
                    setusername(e.target.value)
                }}/>
                <br></br>
                Mobile:
                <input className="form-control" type="text" value={mobile}
                onChange={(e)=>{
                    setmobile(e.target.value)
                }}/>
                <br></br>
                Email:
                <input className="form-control" type="text" value={email}
                onChange={(e)=>{
                    setemail(e.target.value)
                }}/>
                <br></br>
                Password:
                <input className="form-control" type="text" value={password} 
                onChange={(e)=>{
                    setpassword(e.target.value)
                }}/>
                <br></br>
                <button className="btn btn-primary mr-3" onClick={handleApi}>Signup</button>
                <Link className="m-3" to="/login">LOGIN</Link>
            </div>
        </div>
    )
}

export default Signup;