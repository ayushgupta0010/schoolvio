import React from "react";
import { Link } from "react-router-dom";

const getClassSection = (classSection) =>
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

const LoadTestsForTeacher = ({ testsList, handlePublish }) =>
  testsList.map((test, i) => (
    <div className='my-2 bg-dark p-5 rounded' key={i}>
      <div className='text-center'>
        <h3
          className='text-revert border-bottom border-secondary'
          style={{ fontFamily: "Poiret One" }}>
          {test.title}
          <span className='badge bg-secondary float-end fs-6'>
            Class {getClassSection(test.classSection)}
          </span>
        </h3>
      </div>
      <div className='d-flex justify-content-between'>
        <div className='flex-column'>
          <span className='fs-6'>Test ID: {test.id}</span>
          <br />
          <span className='fs-6'>Subject: {test.subject}</span>
          <br />
          <span className='fs-6'>Duration: {test.duration} min</span>
        </div>
        <div className='flex-column'>
          {test.isPublished ? (
            <button
              className='btn btn-sm btn-outline-info'
              data-bs-toggle='offcanvas'
              data-bs-target={`#offcanvas${test.id}`}
              style={{ width: "100px" }}>
              Answers
              <i className='bi bi-list-task ms-3' />
            </button>
          ) : (
            <>
              <Link
                to={`/test/edit/${test.id}`}
                className='btn btn-sm btn-outline-danger'
                style={{ width: "100px" }}>
                Edit
                <i className='bi bi-pencil-fill ms-3' />
              </Link>
              <br />
              <button
                className='btn btn-sm btn-outline-info mt-2'
                style={{ width: "100px" }}
                onClick={() => handlePublish(test.id)}>
                Publish
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  className='bi bi-send-fill ms-2'
                  viewBox='0 0 16 16'>
                  <path
                    fillRule='evenodd'
                    d='M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154l.215.338 7.494-7.494Z'
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      <hr className='mb-1' />
      <span className='text-revert styledFont2 fs-6'>
        {getDate(test.timestamp)}
      </span>
    </div>
  ));

export default LoadTestsForTeacher;
