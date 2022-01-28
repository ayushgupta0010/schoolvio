import React from "react";

const StudentResultModal = ({ result }) => (
  <div
    className='modal fade'
    id='studentResultModal'
    tabIndex='-1'
    role='dialog'>
    <div className='modal-dialog modal-dialog-centered' role='document'>
      <div className='modal-content bg-black'>
        <div className='modal-header'>
          <h5 className='modal-title text-danger'>{result.examName}</h5>
          <button
            className='btn-close bg-dark text-light'
            data-bs-dismiss='modal'
            aria-label='Close'
          />
        </div>
        <div className='modal-body'>
          <div className='d-flex justify-content-between'>
            <p className='m-0'>
              <span>Name: {result.name}</span>
              <br />
              <span>Class: {result.classSection}</span>
            </p>
            <p className='m-0'>
              <span>Roll No: {result.rollNo}</span>
              <br />
              <span>Adm. No: {result.admNo}</span>
            </p>
          </div>
          <hr />
          {Object.keys(result).length !== 0 &&
            Object.keys(result.subjects).map((subject) => (
              <div className='d-flex justify-content-between'>
                <span className='styledFont fs-6'>{subject}:</span>
                <span className=''>{result.subjects[subject]}</span>
              </div>
            ))}
          <hr />
          <div className='d-flex justify-content-between'>
            <span className='styledFont fs-6'>Total:</span>
            <span className=''>
              {result.marksObtained} / {result.totalMarks}
            </span>
          </div>
          <div className='d-flex justify-content-between'>
            <span className='styledFont fs-6'>Percentage:</span>
            <span className=''>{result.percentage} %</span>
          </div>
          <div className='d-flex justify-content-between'>
            <span className='styledFont fs-6'>Rank:</span>
            <span className=''>{result.rank}</span>
          </div>
          <div className='d-flex justify-content-between'>
            <span className='styledFont fs-6'>Attendance:</span>
            <span className=''>
              {result.attendance}/{result.totalAttendance} (
              {result.attendancePercentage} %)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StudentResultModal;
