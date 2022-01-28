import React from "react";

const Header = ({
  examsList,
  selectedExam,
  setSelectedExam,
  totalAttendance,
  setTotalAttendance,
  maxMarks,
  setMaxMarks,
}) => (
  <>
    <div className='form-floating mb-3'>
      <select
        className='form-select bg-transparent text-revert border-secondary'
        value={selectedExam}
        onChange={(e) => setSelectedExam(e.target.value)}
        required>
        <option value='' disabled hidden>
          Select an exam
        </option>
        {examsList.map((exam, i) => (
          <option className='bg-secondary text-revert' value={exam.id} key={i}>
            {exam.name}
          </option>
        ))}
      </select>
      <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
        Exam
      </label>
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
