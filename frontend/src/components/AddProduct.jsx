import Header from './Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import categories from './categoriesList';

function AddProduct() {
    const navigate = useNavigate();
    const [pname, setPname] = useState('');
    const [pdesc, setPdesc] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Cycle');
    const [pimage, setPimage] = useState('');
    const [pimage2, setPimage2] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleApi = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const formData = new FormData();
            formData.append('plat', position.coords.latitude);
            formData.append('plong', position.coords.longitude);
            formData.append('pname', pname);
            formData.append('pdesc', pdesc);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('pimage', pimage);
            formData.append('pimage2', pimage2);
            formData.append('userId', localStorage.getItem('userId'));

            const url = 'https://collegekart-ltme.onrender.com/add-product';
            axios.post(url, formData)
                .then((res) => {
                    console.log(res);
                    if (res.data.message) {
                        alert(res.data.message);
                        navigate('/');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    };

    return (
        <div>
            <Header />
            <div className="p-3">
                <h2>Add product here:</h2>
                <label>Product name:</label>
                <input className="form-control" type="text" value={pname}
                    onChange={(e) => {
                        setPname(e.target.value);
                    }}
                />
                <label>Product Description:</label>
                <input className="form-control" type="text" value={pdesc}
                    onChange={(e) => {
                        setPdesc(e.target.value);
                    }}
                />
                <label>Product Price:</label>
                <input className="form-control" type="text" value={price}
                    onChange={(e) => {
                        setPrice(e.target.value);
                    }}
                />
                <label>Product Category:</label>
                <select className="form-control" value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                    }}
                >
                    {console.log(categories.length)}
                    {
                        categories && categories.length > 0 &&
                        categories.map((item, index) => {
                            return (
                                <option key={'option' + index}>{item}</option>
                            );
                        })
                    }
                </select>
                <label>Product Image:</label>
                <input className="form-control" type="file"
                    onChange={(e) => {
                        setPimage(e.target.files[0]);
                    }}
                />
                <label>Product Second Image:</label>
                <input className="form-control" type="file"
                    onChange={(e) => {
                        setPimage2(e.target.files[0]);
                    }}
                />
                <button onClick={handleApi} className="btn btn-primary mt-3">SUBMIT</button>
            </div>
        </div>
    );
}

export default AddProduct;
