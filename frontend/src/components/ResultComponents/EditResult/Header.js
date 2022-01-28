import React from "react";

const Header = ({
  examName,
  maxMarks,
  setMaxMarks,
  totalAttendance,
  setTotalAttendance,
}) => (
  <>
    <div className='text-center'>
      <span className='styledFont'>{examName}</span>
      <hr className='mt-0' />
    </div>
    <div className='row g-2'>
      <div className='col-md'>
        <div className='form-floating mb-3'>
          <input
            type='number'
            className='form-control bg-transparent text-revert border-secondary'
            placeholder='Total Attendance'
            id='floatingInput'
            value={totalAttendance}
            onChange={(e) => setTotalAttendance(e.target.value)}
            required
          />
          <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
            Total Attendance
          </label>
        </div>
      </div>
      <div className='col-md'>
        <div className='form-floating mb-3'>
          <input
            type='number'
            className='form-control bg-transparent text-revert border-secondary'
            id='floatingInput'
            placeholder='Maximum Marks per Subject'
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            required
          />
          <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
            Maximum Marks per Subject
          </label>
        </div>
      </div>
    </div>
  </>
);

export default Header;
