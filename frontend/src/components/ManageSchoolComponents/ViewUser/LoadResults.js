import React from "react";
import { Link } from "react-router-dom";

const LoadResults = ({ searchResult, role }) => (
  <div className='list-group mt-3'>
    {searchResult.map((x, i) => (
      <div className='list-group-item mb-1 bg-dark' key={i}>
        <img
          className='rounded-circle me-3 float-start'
          style={{ width: "50px", height: "50px" }}
          src={x.photo}
          alt='profile-pic'
        />
        <div className='container'>
          <div className='d-flex flex-column float-start'>
            <Link
              to={`/profile/${x.username}`}
              className='styledFont2 text-revert'>
              {x.username}
            </Link>
            <span className='styledFont2 text-info font-italic'>{x.name}</span>
          </div>
          {x.role === "STUDENT" && (
            <>
              <span className='badge bg-danger ms-0 ms-md-5'>
                Class {x.classSection.replace("C_", "").replace("_", "-")}
              </span>
              <span
                className='badge bg-info ms-2'
                style={{ letterSpacing: "1px" }}>
                Admission No: {x.admNo}
              </span>
            </>
          )}
          <div className='float-end'>
            {role === "SCHOOL" && (
              <Link
                to={`/school/edit/user/${x.username}`}
                className='btn btn-danger py-2 me-2'>
                Edit
              </Link>
            )}
            <Link to={`/profile/${x.username}`} className='btn btn-info py-2'>
              View
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadResults;
