import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FORGOT_PASSWORD_SEND_MAIL_MUTATION } from "../../utils/mutation";
import client from "../../utils/apollo";

const ForgotPassword = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg([{ text: "Sending email...", color: "info" }]);
    client
      .mutate({
        mutation: FORGOT_PASSWORD_SEND_MAIL_MUTATION,
        variables: { email },
      })
      .then((res) => {
        if (res.data.sendPasswordResetEmail.success) {
          setMsg([{ text: "Email sent successfully", color: "success" }]);
          return;
        }
        setMsg([]);
        let { errors } = res.data.sendPasswordResetEmail;

        errors.email?.map((x) =>
          setMsg((original) => [
            ...original,
            { text: x.message, color: "danger" },
          ])
        );
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (isLoggedIn) return navigate("/");
    else document.title = "Forgot Password";
  }, [navigate, isLoggedIn]);

  return (
    <div className='container my-3'>
      <div className='d-flex justify-content-center'>
        <div className='box'>
          <form onSubmit={handleSubmit}>
            <p className='styledFont text-skyblue'>
              A reset password link will be sent
              <br />
              to your given email address:
            </p>

            <input
              className='styledInput w-100'
              type='email'
              placeholder='Your email...'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='on'
              required
            />
          </form>

          {msg.length !== 0 &&
            msg.map((x, i) => (
              <div key={i} className={`alert alert-${x.color}`} role='alert'>
                {x.text}
              </div>
            ))}

          <span className='styledFont2 text-info'>
            Didn't receive an email?
            <Link to='#' className='styledFont2 ms-1' onClick={handleSubmit}>
              Resend
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
