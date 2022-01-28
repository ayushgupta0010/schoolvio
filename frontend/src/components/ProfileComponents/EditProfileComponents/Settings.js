import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ACTIONS } from "../../../redux/actions";
import { PASSWORD_CHANGE_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";

const Settings = () => {
  const { email } = useSelector((state) => state.auth);

  const [changedEmail, setChangedEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [msg, setMsg] = useState([]);

  const dispatch = useDispatch();

  const handleEmailUsernameSubmit = (e) => {
    e.preventDefault();
    dispatch(SET_ACTIONS.EMAIL(changedEmail)).then((res) => {
      if (res.data.updateUserAuth.success) {
        setMsg([{ text: "Account updated", color: "success" }]);
        setInterval(() => setMsg([{ text: "", color: "" }]), 2000);
        return;
      }
      setMsg([]);
      let { errors } = res.data.updateUserAuth;
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
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword1 !== newPassword2) {
      setMsg([{ text: "Passwords do not match", color: "danger" }]);
      return;
    }

    let refreshToken = localStorage.getItem("refreshToken");
    client
      .mutate({
        mutation: PASSWORD_CHANGE_MUTATION,
        variables: { oldPassword, newPassword1, newPassword2, refreshToken },
      })
      .then((res) => {
        if (res.data.passwordChange.success) {
          setMsg([{ text: "Password changed", color: "success" }]);
          refreshToken = res.data.passwordChange.refreshToken;
          localStorage.setItem("token", res.data.passwordChange.token);
          localStorage.setItem("refreshToken", refreshToken);
        } else {
          setMsg([]);
          let { errors } = res.data.passwordChange;
          errors.oldPassword?.map((x) =>
            setMsg((original) => [
              ...original,
              { text: x.message, color: "danger" },
            ])
          );

          errors.newPassword2?.map((x) =>
            setMsg((original) => [
              ...original,
              { text: x.message, color: "danger" },
            ])
          );
        }
      });
  };

  useEffect(() => (document.title = "Account Settings"), []);

  useEffect(() => {
    setChangedEmail(email);
  }, [email]);

  return (
    <div className='container my-12'>
      {msg.length !== 0 &&
        msg.map((x, i) => (
          <div className='d-flex justify-content-center' key={i}>
            <div className={`alert alert-${x.color}`} role='alert'>
              {x.text}
            </div>
          </div>
        ))}
      <div className='box p-0 m-0 mt-3 rounded'>
        <form onSubmit={handleEmailUsernameSubmit}>
          <input
            type='text'
            placeholder='Email'
            value={changedEmail}
            onChange={(e) => setChangedEmail(e.target.value)}
            required
          />
          <button className='styledButton' disabled={changedEmail === email}>
            Save
          </button>
        </form>
      </div>
      <div className='box p-0 my-4 rounded'>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type='password'
            placeholder='Old Password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete='on'
            required
          />
          <input
            type='password'
            placeholder='New Password'
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
            autoComplete='on'
            required
          />
          <input
            type='password'
            placeholder='Confirm New Password'
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            autoComplete='on'
            required
          />
          <button className='styledButton'>Save</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
