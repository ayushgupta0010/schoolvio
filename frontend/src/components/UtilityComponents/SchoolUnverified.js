import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SchoolUnverified = () => {
  const { verified, isProfileCompleted, isSchoolVerified } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (verified === false) return navigate("/account_unverified");
    else if (isProfileCompleted === false) return navigate("/profile/setup");
    else if (isSchoolVerified) return navigate("/");
    else document.title = "School Unverified";
  }, [navigate, isProfileCompleted, isSchoolVerified, verified]);

  return (
    <div className='container'>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: "80vh" }}>
        <div className='text-center'>
          <p className='text-skyblue m-0 fs-1'>
            You have not been verified by your school yet
          </p>
          <p className='text-revert m-0 fs-4'>
            You will be shown this page until your school verifies you
          </p>
          <p className='text-revert m-0 mt-7 fs-5'>
            If you are to fill your profile again, then this means that your
            school has marked you as "Unverified"
          </p>
          <p className='text-revert m-0 fs-5'>
            You should consult with your school before filling out your profile
            again
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolUnverified;
