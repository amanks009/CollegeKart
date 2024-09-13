import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Categories from './Categories';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Shimmer from './Shimmer'; // Import Shimmer component
import './Home.css';

function CategoryPage() {
    const navigate = useNavigate();
    const param = useParams();

    const [cproducts, setcproducts] = useState([]);
    const [products, setproducts] = useState([]);
    const [search, setsearch] = useState('');
    const [issearch, setissearch] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [likedproducts, setlikedproducts] = useState([]);
    const [loading, setloading] = useState(true); // Loading state

    useEffect(() => {
        const url = 'https://collegekart-ltme.onrender.com/get-products?catName=' + param.catName;
        axios.get(url)
            .then((res) => {
                if (res.data.products) {
                    setproducts(res.data.products);
                }
                setloading(false); // Set loading to false after fetching data
            })
            .catch(() => {
                alert('Error fetching products');
                setloading(false); // Set loading to false in case of error
            });

        const url2 = 'https://collegekart-ltme.onrender.com/liked-products';
        let data = { userId: localStorage.getItem('userId') };
        axios.post(url2, data)
            .then((res) => {
                if (res.data.products) {
                    setlikedproducts(res.data.products);
                }
            })
            .catch(() => {
                alert('Error fetching liked-products');
            });
    }, [param, refresh]);

    const handlesearch = (value) => {
        setsearch(value);
    };

    const handleClick = () => {
        const url = 'https://collegekart-ltme.onrender.com/search?search=' + search + '&loc=' + localStorage.getItem('userLoc');
        axios.get(url)
            .then((res) => {
                setcproducts(res.data.products);
                setissearch(true);
            })
            .catch(() => {
                alert('Error during search');
            });
    };

    const handleCategory = (value) => {
        let filteredProducts = products.filter((item) => item.category.toLowerCase() === value.toLowerCase());
        setcproducts(filteredProducts);
    };

    const handleLike = (productId, e) => {
        e.stopPropagation();
        let userId = localStorage.getItem('userId');
        const url = 'https://collegekart-ltme.onrender.com/like-product';
        const data = { userId, productId };
        axios.post(url, data)
            .then(() => {
                alert('Liked product');
                setrefresh(!refresh);
            })
            .catch(() => {
                alert('Error liking product');
            });
    };

    const handleDisLike = (productId, e) => {
        e.stopPropagation();
        let userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Please Login first');
            return;
        }

        const url = 'https://collegekart-ltme.onrender.com/dislike-product';
        const data = { userId, productId };
        axios.post(url, data)
            .then(() => {
                alert('Removed from favourites');
                setrefresh(!refresh);
            })
            .catch(() => {
                alert('Error disliking product');
            });
    };

    const handleProduct = (id) => {
        navigate('/product/' + id);
    };

    return (
        <div>
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick} />
            <Categories handleCategory={handleCategory} />
            <div className="container py-5">
                {issearch && (
                    <div className="text-center">
                        <h4 className="mb-5"><strong>Search Results</strong></h4>
                        <button className="clear-btn" onClick={() => setissearch(false)}>Clear</button>
                        <div className="row">
                            {loading ? (
                                [...Array(6)].map((_, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                                        <Shimmer />
                                    </div>
                                ))
                            ) : (
                                cproducts.length > 0 ? (
                                    cproducts.map((item) => (
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
                                                                <s>₹{item.price}</s>
                                                                <strong className="ms-2 text-danger">₹{item.discountedPrice}</strong>
                                                            </>
                                                        ) : (
                                                            `₹${item.price}`
                                                        )}
                                                    </h6>
                                                    <div onClick={(e) => likedproducts.find((likedItem) => likedItem._id === item._id) ? handleDisLike(item._id, e) : handleLike(item._id, e)} className="icon-con">
                                                        {likedproducts.find((likedItem) => likedItem._id === item._id) ? <FaHeart className="icons red-icons" /> : <FaRegHeart className="icons" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <h5>No Results Found</h5>
                                )
                            )}
                        </div>
                    </div>
                )}
                {!issearch && (
                    <div className="text-center">
                        <h4 className="mb-5"><strong>All Products</strong></h4>
                        <div className="row">
                            {loading ? (
                                [...Array(6)].map((_, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                                        <Shimmer />
                                    </div>
                                ))
                            ) : (
                                products.map((item) => (
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
                                                            <s>₹{item.price}</s>
                                                            <strong className="ms-2 text-danger">₹{item.discountedPrice}</strong>
                                                        </>
                                                    ) : (
                                                        `₹${item.price}`
                                                    )}
                                                </h6>
                                                <div onClick={(e) => likedproducts.find((likedItem) => likedItem._id === item._id) ? handleDisLike(item._id, e) : handleLike(item._id, e)} className="icon-con">
                                                    {likedproducts.find((likedItem) => likedItem._id === item._id) ? <FaHeart className="icons red-icons" /> : <FaRegHeart className="icons" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;
