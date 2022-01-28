import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const HighlySecuredRoute = () => {
  const {
    verified,
    isLoggedIn,
    isSuspended,
    isSchoolVerified,
    isProfileCompleted,
    isSubscriptionExpired,
  } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return navigate("/login");
    else if (verified === false) return navigate("/account_unverified");
    else if (isProfileCompleted === false) return navigate("/profile/setup");
    else if (isSchoolVerified === false) return navigate("/school_unverified");
    else if (isSubscriptionExpired) return navigate("/subscription_expired");
    else if (isSuspended) return navigate("/account_suspended");
  }, [
    navigate,
    verified,
    isLoggedIn,
    isSuspended,
    isSchoolVerified,
    isProfileCompleted,
    isSubscriptionExpired,
  ]);

  return <Outlet />;
};

export default HighlySecuredRoute;
