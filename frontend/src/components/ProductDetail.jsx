import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './ProductDetail.css'; // Import custom CSS

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const p = useParams();

    useEffect(() => {
        const url = `https://collegekart-ltme.onrender.com/get-product/${p.productId}`;
        axios.get(url)
            .then(res => {
                if (res.data.product) {
                    setProduct(res.data.product);
                }
            })
            .catch(err => {
                alert('Error fetching product details');
            });
    }, [p.productId]);

    const handleContact = (addedBy) => {
        const url = `https://collegekart-ltme.onrender.com/get-user/${addedBy}`;
        axios.get(url)
            .then(res => {
                if (res.data.user) {
                    setUser(res.data.user);
                    setShowModal(true);
                }
            })
            .catch(err => {
                alert('Error fetching user details');
            });
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                {product && (
                    <div className="row">
                        <div className="col-md-6">
                            <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src={`https://collegekart-ltme.onrender.com/${product.pimage}`} className="d-block w-100 carousel-image" alt={product.pname} />
                                    </div>
                                    {product.pimage2 && (
                                        <div className="carousel-item">
                                            <img src={`https://collegekart-ltme.onrender.com/${product.pimage2}`} className="d-block w-100 carousel-image" alt={product.pname} />
                                        </div>
                                    )}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h1>{product.pname}</h1>
                            <h4 className="text-muted">{product.category}</h4>
                            <h3 className="text-danger">Rs. {product.price} /-</h3>
                            <p className="text-success">{product.pdesc}</p>
                            {product.addedBy && (
                                <button className="btn btn-primary mt-3" onClick={() => handleContact(product.addedBy)}>
                                    Show Contact Details
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {user && (
                <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Contact Details</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Username:</strong> {user.username}</p>
                                <p><strong>Mobile:</strong> {user.mobile}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetail;
