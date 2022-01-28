import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import First from "./First";
import Fourth from "./Fourth";
import Second from "./Second";
import Third from "./Third";

const SetupProfile = () => {
  const { username, verified, isProfileCompleted } = useSelector(
    (state) => state.auth
  );

  const [accountType, setAccountType] = useState("");
  const [viewPage, setViewPage] = useState(1);
  const [account, setAccount] = useState({
    username,
    name: "",
    contact: "",
    dob: "",
    address: "",
    fatherName: "",
    motherName: "",
    admNo: "",
    rollNo: "",
    busNo: "",
    goal: "",
    startedTeaching: "",
    joiningDate: "",
    qualification: "",
    about: "",
    school: "",
    principal: "",
    board: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (verified === false) return navigate("/account_unverified");
    else if (isProfileCompleted) return navigate(`/profile/${username}`);
    else {
      document.title = "Setup Profile";
      setAccount((original) => ({ ...original, username }));
    }
  }, [navigate, isProfileCompleted, username, verified]);

  const data = {
    accountType,
    account,
    username,
    setAccountType,
    setAccount,
    setViewPage,
  };

  return (
    <>
      {viewPage === 1 && <First data={data} />}
      {viewPage === 2 && <Second data={data} />}
      {viewPage === 3 && <Third data={data} />}
      {viewPage === 4 && <Fourth data={data} />}
    </>
  );
};

export default SetupProfile;
