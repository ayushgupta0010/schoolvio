import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AccountSuspended = () => {
  const {
    reason,
    verified,
    isSuspended,
    isSchoolVerified,
    isProfileCompleted,
  } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (verified === false) return navigate("/account_unverified");
    else if (isProfileCompleted === false) return navigate("/profile/setup");
    else if (isSchoolVerified === false) return navigate("/school_unverified");
    else if (isSuspended === false) return navigate("/");
    else document.title = "Account Suspended";
  }, [navigate, isProfileCompleted, isSchoolVerified, isSuspended, verified]);

  return (
    <div className='container'>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: "80vh" }}>
        <div className='text-center'>
          <p className='text-skyblue m-0 fs-1'>
            Your school suspended your account due to the reasons below
          </p>
          <p className='text-revert m-0 fs-3'>{reason}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountSuspended;
