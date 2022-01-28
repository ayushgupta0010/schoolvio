import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TRY_ACTIONS } from "../../redux/actions";

const Signup = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    let val = e.target.value;
    if (val.search(/^[a-zA-Z0-9_]+$/) === -1) {
      alert("Uppercase, lowercase, numbers and underscores only allowed.");
      return;
    }
    setUsername(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(TRY_ACTIONS.SIGNUP(email, username, password))
      .then((res) => {
        if (res.data.signup.success) return;
        setMsg([]);
        let { errors } = res.data.signup;

        errors.email?.map((x) =>
          setMsg((original) => [
            ...original,
            { text: x.message, color: "danger" },
          ])
        );

        errors.username?.map((x) =>
          setMsg((original) => [
            ...original,
            { text: x.message, color: "danger" },
          ])
        );

        errors.password2?.map((x) =>
          setMsg((original) => [
            ...original,
            { text: x.message, color: "danger" },
          ])
        );
      })
      .catch((err) =>
        setMsg([{ text: "Something went wrong", color: "danger" }])
      );
  };

  useEffect(() => {
    if (isLoggedIn) return navigate("/");
    else document.title = "Signup";
  }, [navigate, isLoggedIn]);

  return (
    <div className='container'>
      <div className='d-flex justify-content-center'>
        <div className='box'>
          {msg.length !== 0 &&
            msg.map((x, i) => (
              <div key={i} className={`alert alert-${x.color}`} role='alert'>
                {x.text}
              </div>
            ))}
          <p className='text-center styledFont2 text-revert fs-1'>
            <i className='bi bi-person-plus' />
            <br />
            Sign Up
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={handleUsernameChange}
              required
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className='styledButton'>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
