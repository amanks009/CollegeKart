import Header from './Header';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import axios from "axios";

function Signup(){

    const [username,setusername]=useState('your webmail')
    const [password,setpassword]=useState('enter your password')
    
    const handleApi=()=>{
        // console.log({username,password});
        const url='http://localhost:4000/signup';
        const data={username,password};
        axios.post(url,data)
        .then((res)=>{
            // console.log(res.data)
            if(res.data.message){
                alert(res.data.message)
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
        Welcome to signup page
        <br></br>
        USERNAME:
        <input type="text" value={username}
         onChange={(e)=>{
            setusername(e.target.value)
        }}/>
        <br></br>
        PASSWORD:
        <input type="text" value={password} 
        onChange={(e)=>{
            setpassword(e.target.value)
        }}/>
        <br></br>
        <button onClick={handleApi}>Signup</button>
        <Link to="/login">LOGIN</Link>
        </div>
    )
}

export default Signup;