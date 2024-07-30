import { useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { useState } from "react";

function MyProfile() {

    const [user,setuser]=useState({});

    useEffect(() => {
        let url = 'https://collegekart-ltme.onrender.com/my-profile/'+localStorage.getItem('userId')
        axios.get(url)
            .then((res) => {
                console.log(res.data);
                if(res.data.user){
                    setuser(res.data.user)
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Error is here');
            });
    }, []);

    return (
        <>
            <div >
                <Header />
                <div className="m-3 p-3">
                    <h3 className="text-center mt-2">User Profile</h3>
                    <table className="table table-dark table bordered">
                        <thead>
                            <tr>
                                <td>username </td>
                                <td>Email id </td>
                                <td>Mobile Number </td>    
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.mobile} </td>    
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default MyProfile;
