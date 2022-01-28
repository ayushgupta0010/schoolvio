import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SUBSCRIPTION_QUERY } from "../../utils/query";
import { JOIN_US, WEBSITE_NAME } from "../../utils/websiteData";
import client from "../../utils/apollo";

const getDate = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

const plan = {
  A_14_DAYS: "14 days subscription plan",
  A_3_MONTH: "3 Month subscription plan",
  A_6_MONTH: "6 Month subscription plan",
  A_1_YEAR: "1 Year subscription plan",
};

const SubscriptionExpired = () => {
  const {
    role,
    username,
    verified,
    isSchoolVerified,
    isProfileCompleted,
    isSubscriptionExpired,
  } = useSelector((state) => state.auth);

  const [subscription, setSubscription] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (verified === false) return navigate("/account_unverified");
    else if (isProfileCompleted === false) return navigate("/profile/setup");
    else if (isSchoolVerified === false) return navigate("/school_unverified");
    else if (isSubscriptionExpired === false) return navigate("/");

    document.title = "Subscription Expired";
    if (role !== "SCHOOL") return;
    client
      .query({ query: SUBSCRIPTION_QUERY })
      .then((res) => setSubscription(res.data.subscription))
      .catch((err) => err);
  }, [
    role,
    navigate,
    verified,
    isSchoolVerified,
    isProfileCompleted,
    isSubscriptionExpired,
  ]);

  const body = `This is ${subscription.school?.name}, ${subscription.school?.address} (@${username}) requesting for a subscription.`;

  return (
    <div
      className='container d-flex justify-content-center flex-column align-items-center'
      style={{ height: "80vh" }}>
      <i
        className='bi bi-hourglass-bottom text-danger'
        style={{ fontSize: "50px" }}
      />
      <p className='styledFont text-danger fs-3'>School Subscription Expired</p>
      {role === "SCHOOL" && (
        <>
          {subscription.plan !== "NONE" && (
            <>
              <p className='styledFont text-skyblue fs-5'>
                Your {plan[subscription.plan]} ended on{" "}
                {getDate(subscription.endDate)}
              </p>
              <p className='styledFont fs-6'>
                Date of Subscription: {getDate(subscription.startDate)}
              </p>
            </>
          )}
          <p className='styledFont'>Select a subscription plan:</p>
          <a
            href={`mailto:${JOIN_US.email}?subject=14 days subscription of ${WEBSITE_NAME}&body=${body}`}
            className='styledFont btn btn-outline-primary text-skyblue fw-bolder my-3'
            style={{ width: "120px" }}
            target='_blank'
            rel='noreferrer'>
            14 days
          </a>
          <a
            href={`mailto:${JOIN_US.email}?subject=3 months subscription of ${WEBSITE_NAME}&body=${body}`}
            className='styledFont btn btn-outline-primary text-skyblue fw-bolder my-3'
            style={{ width: "120px" }}
            target='_blank'
            rel='noreferrer'>
            3 months
          </a>
          <a
            href={`mailto:${JOIN_US.email}?subject=6 months subscription of ${WEBSITE_NAME}&body=${body}`}
            className='styledFont btn btn-outline-primary text-skyblue fw-bolder my-3'
            style={{ width: "120px" }}
            target='_blank'
            rel='noreferrer'>
            6 months
          </a>
          <a
            href={`mailto:${JOIN_US.email}?subject=1 year subscription of ${WEBSITE_NAME}&body=${body}`}
            className='styledFont btn btn-outline-primary text-skyblue fw-bolder my-3'
            style={{ width: "120px" }}
            target='_blank'
            rel='noreferrer'>
            1 year
          </a>
        </>
      )}
    </div>
  );
};

export default SubscriptionExpired;
