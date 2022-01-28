import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SEND_ACTIVATION_EMAIL_MUTATION } from "../../utils/mutation";
import client from "../../utils/apollo";

const EmailSend = () => {
  const { verified, email } = useSelector((state) => state.auth);

  const [msg, setMsg] = useState({ text: "", color: "" });

  const navigate = useNavigate();

  const send_email = () => {
    setMsg({ text: "Sending verification email...", color: "info" });
    email &&
      client
        .mutate({
          mutation: SEND_ACTIVATION_EMAIL_MUTATION,
          variables: { email },
        })
        .then((res) =>
          setMsg({
            text: "Verification email sent successfully",
            color: "success",
          })
        )
        .catch((err) => err);
  };

  useEffect(() => {
    if (verified) return navigate("/");
    else document.title = "Send Verification Email";
  }, [navigate, verified]);

  return (
    <div className='container'>
      <div className='d-flex justify-content-center'>
        <div className='box'>
          <p className='styledFont text-skyblue'>
            A verification email is sent to your email address:
            <br />
            <span className='styledFont2 text-revert'>{email}</span>
          </p>

          {msg.text && (
            <div className={`alert alert-${msg.color}`}>{msg.text}</div>
          )}

          <span className='styledFont2 text-info'>
            Didn't receive an email?&nbsp;
            <Link to='#' className='styledFont2' onClick={send_email}>
              Resend
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailSend;
