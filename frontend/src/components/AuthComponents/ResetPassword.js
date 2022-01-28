import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RESET_PASSWORD_MUTATION } from "../../utils/mutation";
import client from "../../utils/apollo";

const ResetPassword = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .mutate({
        mutation: RESET_PASSWORD_MUTATION,
        variables: { token, password },
      })
      .then((res) => {
        if (res.data.passwordReset.success) {
          let text = "Password reset successful. Redirecting in 3s...";
          setMsg([{ text, color: "success" }]);
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setMsg([]);
          let { errors } = res.data.passwordReset;

          errors.newPassword2?.map((x) =>
            setMsg((original) => [
              ...original,
              { text: x.message, color: "danger" },
            ])
          );
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (isLoggedIn) return navigate("/");
    else document.title = "Reset Password";
  }, [navigate, isLoggedIn]);

  return (
    <div className='container my-3'>
      <div className='d-flex justify-content-center'>
        <div className='box'>
          <form onSubmit={handleSubmit}>
            <p className='styledFont text-skyblue'>Enter your new password:</p>
            <input
              className='styledInput w-100'
              type='password'
              placeholder='Your new password...'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </form>
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

export default ResetPassword;
