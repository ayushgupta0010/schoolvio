import React from "react";
import { Link } from "react-router-dom";

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

const LoadTestsForStudent = ({ testsList, setModalData }) =>
  testsList.map((test, i) => (
    <div className='my-3 bg-dark p-5 rounded' key={i}>
      <div className='text-center'>
        <h3
          className='text-revert border-bottom border-secondary'
          style={{ fontFamily: "Poiret One" }}>
          {test.title}
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
        <div className='text-end'>
          {test.getAnswer === null ? (
            <Link
              to={`/test/take/${test.id}`}
              className='btn btn-outline-success'>
              Take test
            </Link>
          ) : (
            <div className='flex-column'>
              <span className='styledFont'>Marks: {test.getAnswer.marks}</span>
              <br />
              <button
                className='btn btn-outline-info'
                data-bs-toggle='modal'
                data-bs-target='#viewModal'
                onClick={() =>
                  setModalData({
                    questions: JSON.parse(test.questions),
                    answers: JSON.parse(test.getAnswer.answers),
                  })
                }>
                View
              </button>
            </div>
          )}
        </div>
      </div>
      <hr className='mb-1' />
      <span className='text-revert styledFont2 fs-6'>
        {getDate(test.timestamp)}
      </span>
    </div>
  ));

export default LoadTestsForStudent;
