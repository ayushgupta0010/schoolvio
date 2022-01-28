import React from "react";
import ListSubjects from "../Common/ListSubjects";

const ListUnmodifiableStudents = ({ results }) => (
  <div className='accordion'>
    {Object.keys(results).map((student) => (
      <div className='accordion-item' key={results[student].rollNo}>
        <h2 className='accordion-header d-flex justify-content-between'>
          <button
            className='accordion-button'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target={`#${student}`}>
            <div className='d-flex justify-content-between align-items-center w-100'>
              <div>
                <img
                  className='rounded-circle me-3'
                  style={{ width: "50px", height: "50px" }}
                  src={results[student].photo}
                  alt='profile-pic'
                />
                {results[student].name}
              </div>
              <div>
                <span className='fs-6 me-3 d-block d-md-inline-block'>
                  Rank: {results[student].rank}
                </span>
                <span className='fs-6 me-1'>
                  Percentage: {results[student].percentage} %
                </span>
              </div>
            </div>
          </button>
        </h2>
        <div className='accordion-collapse collapse' id={student}>
          <div className='accordion-body'>
            <div className='input-group input-group-sm mb-3'>
              <span
                className='input-group-text bg-transparent'
                style={{ width: "130px" }}>
                Attendance
              </span>
              <input
                type='number'
                className='form-control'
                value={results[student].attendance}
                disabled
              />
            </div>
            <ListSubjects
              disabled={true}
              results={results}
              username={student}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ListUnmodifiableStudents;
