import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VERIFY_EMAIL_MUTATION } from "../../utils/mutation";
import { updateVerified } from "../../redux/actions/actionStates";
import client from "../../utils/apollo";

const EmailVerify = () => {
  const [msg, setMsg] = useState([
    { text: "Verifying email...", color: "info" },
  ]);

  const dispatch = useDispatch();
  const { token } = useParams();

  useEffect(() => {
    document.title = "Verify Email";
    client
      .mutate({ mutation: VERIFY_EMAIL_MUTATION, variables: { token } })
      .then((res) => {
        if (res.data.verifyAccount.success) {
          setMsg([{ text: "Verification successful", color: "success" }]);
          dispatch(updateVerified());
          return;
        }
        setMsg([]);
        let { errors } = res.data.verifyAccount;
        errors?.nonFieldErrors?.map((x) =>
          setMsg((original) => [
            ...original,
            { text: x.message, color: "danger" },
          ])
        );
      })
      .catch((err) => err);
  }, [dispatch, token]);

  return (
    <div className='container my-3'>
      <div className='d-flex justify-content-center'>
        <div className='box'>
          <p className='styledFont text-skyblue mb-0'>
            Your email address is being verified
            <br />
            Please wait...
            <br />
            <br />
          </p>
          {msg.length !== 0 &&
            msg.map((x, i) => (
              <div key={i} className={`alert alert-${x.color}`} role='alert'>
                {x.text}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
