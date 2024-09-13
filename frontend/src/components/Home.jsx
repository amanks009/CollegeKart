import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Header from './Header';
import Categories from './Categories';
import Shimmer from './Shimmer';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [cproducts, setcproducts] = useState([]);
    const [products, setproducts] = useState([]);
    const [likedproducts, setlikedproducts] = useState([]);
    const [search, setsearch] = useState('');
    const [refresh, setrefresh] = useState(false);
    const [issearch, setissearch] = useState(false);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        axios.get('https://collegekart-ltme.onrender.com/get-products')
            .then(res => {
                setproducts(res.data.products);
                setloading(false);
            })
            .catch(() => {
                alert('Error fetching products');
                setloading(false);
            });

        axios.post('https://collegekart-ltme.onrender.com/liked-products', { userId: localStorage.getItem('userId') })
            .then(res => {console.log("==",res.data)})
        // setlikedproducts(res.data.products))
            .catch(() => alert('Error fetching liked-products'));

    }, [refresh]);

    const handlesearch = value => setsearch(value);

    const handleClick = () => {
        axios.get(`https://collegekart-ltme.onrender.com/search?search=${search}&loc=${localStorage.getItem('userLoc')}`)
            .then(res => {
                setcproducts(res.data.products);
                setissearch(true);
            })
            .catch(() => alert('Error during search'));
    };

    const handleCategory = value => {
        setcproducts(products.filter(item => item.category.toLowerCase() === value.toLowerCase()));
    };

    const handleLike = (productId, e) => {
        e.stopPropagation();
        if (!localStorage.getItem('userId')) {
            alert('Please Login first');
            return;
        }
        axios.post('https://collegekart-ltme.onrender.com/like-product', { userId: localStorage.getItem('userId'), productId })
            .then(() => {
                alert('Liked product');
                setrefresh(!refresh);
            })
            .catch(() => alert('Error liking product'));
    };

    const handleDisLike = (productId, e) => {
        e.stopPropagation();
        if (!localStorage.getItem('userId')) {
            alert('Please Login first');
            return;
        }
        axios.post('https://collegekart-ltme.onrender.com/dislike-product', { userId: localStorage.getItem('userId'), productId })
            .then(() => {
                alert('Removed from favourites');
                setrefresh(!refresh);
            })
            .catch(() => alert('Error disliking product'));
    };

    const handleProduct = id => navigate(`/product/${id}`);

    return (
        <div className="home-container">
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick} />
            <Categories handleCategory={handleCategory} />
            {loading ? (
                <div className="row">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="col-lg-4 col-md-6 mb-4">
                            <Shimmer />
                        </div>
                    ))}
                </div>
            ) : issearch ? (
                <div className="text-center container py-5">
                    <h4 className="mt-4 mb-5"><strong>Search Results</strong></h4>
                    <button className="clear-btn" onClick={() => setissearch(false)}>Clear</button>
                    <div className="row">
                        {cproducts.length > 0 ? cproducts.map(item => (
                            <div onClick={() => handleProduct(item._id)} key={item._id} className="col-lg-4 col-md-6 mb-4">
                                <div className="card">
                                    <div className="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                                        <img src={`https://collegekart-ltme.onrender.com/${item.pimage}`} className="w-100" alt={item.pname} />
                                        <div className="mask">
                                            <div className="d-flex justify-content-start align-items-end h-100">
                                                <h5>
                                                    <span className={`badge ms-2 ${item.isNew ? 'bg-primary' : ''}`}>{item.isNew ? 'New' : ''}</span>
                                                    <span className={`badge ms-2 ${item.isEco ? 'bg-success' : ''}`}>{item.isEco ? 'Eco' : ''}</span>
                                                    <span className={`badge ms-2 ${item.isDiscount ? 'bg-danger' : ''}`}>{item.isDiscount ? `-${item.discount}%` : ''}</span>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">{item.pname}</h5>
                                        <p className="card-text">{item.category}</p>
                                        <h6 className="mb-3">
                                            {item.isDiscount ? (
                                                <>
                                                    <s>${item.price}</s>
                                                    <strong className="ms-2 text-danger">${item.discountedPrice}</strong>
                                                </>
                                            ) : (
                                                `$${item.price}`
                                            )}
                                        </h6>
                                        <div onClick={e => likedproducts.find(likedItem => likedItem._id === item._id) ? handleDisLike(item._id, e) : handleLike(item._id, e)} className="icon-con">
                                            {likedproducts.find(likedItem => likedItem._id === item._id) ? <FaHeart className="icons red-icons" /> : <FaRegHeart className="icons" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : <h5>No Results Found</h5>}
                    </div>
                </div>
            ) : (
                <div className="text-center container py-5">
                    <div className="row">
                        {products.map(item => (
                            <div onClick={() => handleProduct(item._id)} key={item._id} className="col-lg-4 col-md-6 mb-4">
                                <div className="card">
                                    <div className="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                                        <img src={`https://collegekart-ltme.onrender.com/${item.pimage}`} className="w-100" alt={item.pname} />
                                        <div className="mask">
                                            <div className="d-flex justify-content-start align-items-end h-100">
                                                <h5>
                                                    <span className={`badge ms-2 ${item.isNew ? 'bg-primary' : ''}`}>{item.isNew ? 'New' : ''}</span>
                                                    <span className={`badge ms-2 ${item.isEco ? 'bg-success' : ''}`}>{item.isEco ? 'Eco' : ''}</span>
                                                    <span className={`badge ms-2 ${item.isDiscount ? 'bg-danger' : ''}`}>{item.isDiscount ? `-${item.discount}%` : ''}</span>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">{item.pname}</h5>
                                        <p className="card-text">{item.category}</p>
                                        <h6 className="mb-3">
                                            {item.isDiscount ? (
                                                <>
                                                    <s>${item.price}</s>
                                                    <strong className="ms-2 text-danger">${item.discountedPrice}</strong>
                                                </>
                                            ) : (
                                                `$${item.price}`
                                            )}
                                        </h6>
                                        {/* {console.log("====",likedproducts)} */}
                                        <div onClick={e => likedproducts.find(likedItem => likedItem._id === item._id) ? handleDisLike(item._id, e) : handleLike(item._id, e)} className="icon-con">
                                            {likedproducts.find(likedItem => likedItem._id === item._id) ? <FaHeart className="icons red-icons" /> : <FaRegHeart className="icons" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
