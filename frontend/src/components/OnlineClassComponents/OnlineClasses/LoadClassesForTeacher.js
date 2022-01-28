import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ONLINE_CLASSES_FOR_TEACHER_QUERY } from "../../../utils/query";
import { DELETE_ONLINE_CLASS_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import Countdown from "react-countdown";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const getClass = (classSection) =>
  classSection.replace("C_", "").replace("_", "-");

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

const LoadClassesForTeacher = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onlineClasses, setOnlineClasses] = useState([]);

  const canLinkBeShown = (startTime, endTime) =>
    Date.now() >= new Date(startTime) && Date.now() <= new Date(endTime);

  const showLink = (id) =>
    setOnlineClasses((classes) =>
      classes.map((cls) => (cls.id === id ? { ...cls, showLink: true } : cls))
    );

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    client
      .mutate({ mutation: DELETE_ONLINE_CLASS_MUTATION, variables: { id } })
      .then(
        (res) =>
          res.data.deleteOnlineClass.success &&
          setOnlineClasses((classes) => classes.filter((cls) => cls.id !== id))
      )
      .catch((err) => err);
  };

  useEffect(() => {
    client
      .query({ query: ONLINE_CLASSES_FOR_TEACHER_QUERY })
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

  return (
    <div className='container my-3'>
      <Link
        to='/online_classes/create'
        className='styledButton text-white'
        style={{ width: "225px" }}>
        Create Online Class
      </Link>
      {onlineClasses.length !== 0 ? (
        onlineClasses.map((x, i) => (
          <div className='container bg-dark rounded my-3 p-5' key={i}>
            <span className='badge bg-primary me-2 styledFont fs-6'>
              Class {getClass(x.classSection)}
            </span>
            <button
              className='btn btn-sm btn-outline-danger float-end'
              onClick={() => handleDelete(x.id)}>
              <i className='bi bi-trash-fill' />
            </button>
            <div className='text-center'>
              <h3
                className='text-revert border-bottom border-secondary'
                style={{ fontFamily: "Poiret One" }}>
                {x.subject}
              </h3>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <div>
                <span className='styledFont m-0'>
                  Starts on: {getDate(x.startTime)}
                </span>
                <br />
                <span className='styledFont m-0'>
                  Ends on: {getDate(x.endTime)}
                </span>
              </div>
              {x.showLink ? (
                <>
                  {x.passcode && <span>Passcode: {x.passcode}</span>}
                  <a
                    className='btn btn-outline-primary'
                    href={x.link}
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
                    date={new Date(x.startTime)}
                    onComplete={() => showLink(x.id)}
                  />
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className='text-center mt-5 styledFont'>No classes</div>
      )}
    </div>
  );
};

export default LoadClassesForTeacher;
