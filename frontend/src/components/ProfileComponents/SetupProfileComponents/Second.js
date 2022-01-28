import React from "react";
import QualificationList from "../../UtilityComponents/QualificationList";

const SetupProfileSecond = ({ data }) => {
  const _onFocus = (e) => {
    e.currentTarget.type = "date";
  };

  const _onBlur = (e) => {
    e.currentTarget.type = "text";
    e.currentTarget.placeholder = "Date of Joining";
  };

  const handleChange = (e) => {
    if (
      (e.target.name === "fatherName" || e.target.name === "motherName") &&
      e.target.value.length > 50
    ) {
      alert("Only 50 characters allowed");
      return;
    } else if (e.target.name === "busNo" && e.target.value.length > 2) {
      alert("Only 2 characters allowed");
      return;
    }

    data.setAccount({
      ...data.account,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    data.setViewPage(3);
  };

  return (
    <div className='d-flex justify-content-center my-5'>
      {data.accountType === "student" && (
        <div className='box'>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              name='fatherName'
              placeholder="Father's Name"
              value={data.account.fatherName}
              onChange={handleChange}
              required
            />
            <input
              type='text'
              name='motherName'
              placeholder="Mother's Name"
              value={data.account.motherName}
              onChange={handleChange}
              required
            />
            <input
              type='number'
              name='admNo'
              placeholder='Admission Number'
              value={data.account.admNo}
              onChange={handleChange}
              required
            />
            <input
              type='number'
              name='rollNo'
              placeholder='Roll Number'
              value={data.account.rollNo}
              onChange={handleChange}
              required
            />
            <input
              type='text'
              name='busNo'
              placeholder='Bus Number (optional)'
              value={data.account.busNo}
              onChange={handleChange}
            />
            <button className='styledButton'>Next</button>
          </form>
        </div>
      )}
      {data.accountType === "teacher" && (
        <div className='box'>
          <form onSubmit={handleSubmit}>
            <input
              type='number'
              name='startedTeaching'
              placeholder='Started Teaching(Year)'
              value={data.account.startedTeaching}
              onChange={handleChange}
              required
            />
            <input
              className='styledInput w-100'
              type='text'
              name='joiningDate'
              placeholder='Date of Joining'
              onFocus={_onFocus}
              onBlur={_onBlur}
              value={data.account.joiningDate}
              onChange={handleChange}
              required
            />
            <select
              className='w-100'
              name='qualification'
              style={{ textAlignLast: "center" }}
              value={data.account.qualification}
              onChange={handleChange}
              required>
              <option value='' disabled hidden>
                Qualification
              </option>
              <QualificationList />
            </select>
            <button className='styledButton w-100'>Next</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SetupProfileSecond;
