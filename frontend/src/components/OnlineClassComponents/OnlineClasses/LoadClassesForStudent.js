import React, { useEffect, useState } from "react";
import { ONLINE_CLASSES_FOR_STUDENT_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import Countdown from "react-countdown";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

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

const LoadClassesForStudent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onlineClasses, setOnlineClasses] = useState([]);

  const canLinkBeShown = (startTime, endTime) =>
    Date.now() >= new Date(startTime) && Date.now() <= new Date(endTime);

  const showLink = (id) =>
    setOnlineClasses((classes) =>
      classes.map((cls) => (cls.id === id ? { ...cls, showLink: true } : cls))
    );

  useEffect(() => {
    client
      .query({ query: ONLINE_CLASSES_FOR_STUDENT_QUERY })
      .then((res) => {
        setOnlineClasses(
          res.data.classes.map((x) => ({
            ...x,
            showLink: canLinkBeShown(x.startTime, x.endTime),
          }))
        );
        setIsLoading(false);
      })
      .catch((err) => err);
  }, []);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && onlineClasses.length === 0) {
    return <div className='text-center mt-5 styledFont'>No classes</div>;
  }

  return (
    <div className='container my-3'>
      {onlineClasses.map((cls, i) => (
        <div className='container bg-dark rounded my-3 p-5' key={i}>
          <div className='text-center'>
            <h3
              className='text-revert border-bottom border-secondary'
              style={{ fontFamily: "Poiret One" }}>
              {cls.subject}
            </h3>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <span className='styledFont m-0'>
                Starts on: {getDate(cls.startTime)}
              </span>
              <br />
              <span className='styledFont m-0'>
                Ends on: {getDate(cls.endTime)}
              </span>
            </div>
            {cls.showLink ? (
              <>
                {cls.passcode && <span>Passcode: {cls.passcode}</span>}
                <a
                  className='btn btn-outline-primary'
                  href={cls.link}
                  target='_blank'
                  rel='noreferrer'>
                  Join
                </a>
              </>
            ) : (
              <span className='styledFont'>
                Starts in:
                <Countdown
                  className='styledFont text-info ms-3'
                  date={new Date(cls.startTime)}
                  onComplete={() => showLink(cls.id)}
                />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadClassesForStudent;
