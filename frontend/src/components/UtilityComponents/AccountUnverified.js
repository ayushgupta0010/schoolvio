import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const AccountUnverified = () => {
  const { verified } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (verified === true) return navigate("/");
    else document.title = "Account Unverified";
  }, [navigate, verified]);

  return (
    <div className='container'>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: "85vh" }}>
        <div className='text-center'>
          <p className='text-revert m-0 fs-3'>
            Your account is not yet verified
          </p>
          <Link to='/send_verification_email' className='text-skyblue m-0 fs-3'>
            Verify Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountUnverified;
