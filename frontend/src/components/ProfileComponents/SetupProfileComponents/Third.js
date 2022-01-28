import React from "react";
import GoalList from "../../UtilityComponents/GoalList";

const Third = ({ data }) => {
  const handleChange = (e) =>
    data.setAccount({
      ...data.account,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    data.setViewPage(4);
  };

  return (
    <div className='d-flex justify-content-center my-5'>
      <div className='box py-4'>
        <form onSubmit={handleSubmit}>
          {data.accountType === "student" && (
            <select
              className='w-100'
              name='goal'
              style={{ textAlignLast: "center" }}
              value={data.account.goal}
              onChange={handleChange}
              required>
              <option value='' disabled hidden>
                Goal
              </option>
              <GoalList />
            </select>
          )}
          <textarea
            className='col-sm-12 rounded bg-black text-white mt-2 p-2'
            style={{ height: "200px", border: "2px solid #3498db" }}
            name='about'
            placeholder='Tell us about yourself...'
            value={data.account.about}
            onChange={handleChange}
            onFocus={(e) => (e.target.style.border = "2px solid #2ecc71")}
            required
          />
          <button className='styledButton'>Next</button>
        </form>
      </div>
    </div>
  );
};

export default Third;
