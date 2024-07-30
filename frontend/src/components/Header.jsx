import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

function Header(props) {
  const [loc, setLoc] = useState(null);
  const [showOver, setShowOver] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  let locations = [
    {
      latitude: 13.0108,
      longitude: 74.7943,
      placeName: 'NIT Trichy, Trichy',
    },
    {
      latitude: 15.0108,
      longitude: 77.7863,
      placeName: 'NIT Surathkal, Surathkal',
    },
    {
      latitude: 25.4917,
      longitude: 81.8632,
      placeName: 'NIT Allahabad, Allahabad',
    },
  ];

  let userData = localStorage.getItem('userData');
  let firstLetter = 'L';
  if (userData) firstLetter = userData[0];

  return (
    <nav className="navbar navbar-expand-lg navbar-info bg-info">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          COLLEGEKART
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <select
                className="form-select"
                value={loc}
                onChange={(e) => {
                  localStorage.setItem('userLoc', e.target.value);
                  setLoc(e.target.value);
                }}
              >
                {locations.map((item, index) => (
                  <option key={index} value={`${item.latitude}, ${item.longitude}`}>
                    {item.placeName}
                  </option>
                ))}
              </select>
            </li>
            <li className="nav-item">
              <input
                className="form-control"
                type="text"
                value={props && props.search}
                onChange={(e) => props.handlesearch && props.handlesearch(e.target.value)}
                placeholder="Search"
              />
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-light"
                onClick={() => props.handleClick && props.handleClick()}
              >
                <FaSearch />
              </button>
            </li>
          </ul>
          <div className="d-flex">
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                aria-expanded="false"
                onClick={() => setShowOver(!showOver)}
              >
                {firstLetter}
              </button>
              <ul className={`dropdown-menu ${showOver ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                {!!localStorage.getItem('token') && (
                  <li>
                    <Link className="dropdown-item" to="/liked-products">
                      Favourites
                    </Link>
                  </li>
                )}
                {!!localStorage.getItem('token') && (
                  <li>
                    <Link className="dropdown-item" to="/my-products">
                      My Products
                    </Link>
                  </li>
                )}
                {!!localStorage.getItem('token') && (
                  <li>
                    <Link className="dropdown-item" to="/add-product">
                      Add Product
                    </Link>
                  </li>
                )}
                <li>
                  {!localStorage.getItem('token') ? (
                    <Link className="dropdown-item" to="/login">
                      LOGIN!
                    </Link>
                  ) : (
                    <button className="dropdown-item" onClick={handleLogout}>
                      LOGOUT
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
