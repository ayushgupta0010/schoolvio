import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TRY_ACTIONS } from "../../redux/actions";

const Login = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEmail = (text) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = isEmail(usernameOrEmail) ? "email" : "username";
    dispatch(TRY_ACTIONS.LOGIN(method, usernameOrEmail, password))
      .then(
        (res) => !res.data.login.success && setMessage("Invalid credentials")
      )
      .catch((err) => setMessage("Something went wrong"));
  };

  useEffect(() => {
    if (isLoggedIn) return navigate("/");
    else document.title = "Login";
  }, [navigate, isLoggedIn]);

  return (
    <div className='container'>
      <div className='d-flex justify-content-center'>
        <div className='box'>
          {message && (
            <div className='alert alert-danger' role='alert'>
              {message}
            </div>
          )}
          <p className='text-center styledFont text-revert fs-1'>
            <i className='bi bi-unlock' />
            <br />
            Log In
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              value={usernameOrEmail}
              placeholder='Username Or Email'
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              autoComplete='on'
              required
            />
            <input
              type='password'
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='on'
              required
            />
            <Link to='/forgot_password'>Forgot password?</Link>
            <button className='styledButton'>Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
