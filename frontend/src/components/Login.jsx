import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleApi = () => {
    const url = 'https://collegekart-ltme.onrender.com/login';
    const data = { username, password };
    axios.post(url, data)
      .then((res) => {
        if (res.data.message) {
          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('userData', res.data.username);
            navigate('/');
          }
        }
      })
      .catch((err) => {
        alert('SERVER ERROR');
      });
  };

  return (
    <>
      <Header />
      <section className="vh-100">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6 text-black">
              <div className="px-5 ms-xl-4">
                <i className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4" style={{ color: '#709085' }}></i>
                <span className="h1 fw-bold mb-0">CollegeKart</span>
              </div>

              <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                <form
                  style={{ width: '23rem' }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApi();
                  }}
                >
                  <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                    Log in
                  </h3>

                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control form-control-lg"
                      placeholder="Enter a valid username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form3Example3">
                      UserName
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="form3Example4"
                      className="form-control form-control-lg"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form3Example4">
                      Password
                    </label>
                  </div>

                  <div className="pt-1 mb-4">
                    <button className="btn btn-info btn-lg btn-block" type="submit">
                      Login
                    </button>
                  </div>
                  <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="link-info">
                      Register here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
            <div className="col-sm-6 px-0 d-none d-sm-block">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                alt="Login image"
                className="w-100 vh-100"
                style={{ objectFit: 'cover', objectPosition: 'left' }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
