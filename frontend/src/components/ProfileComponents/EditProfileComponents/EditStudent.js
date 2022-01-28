import React from "react";
import GoalList from "../../UtilityComponents/GoalList";

const EditStudent = ({ data }) => (
  <>
    <div className='form-floating mb-3'>
      <select
        className='form-select bg-transparent text-revert border-secondary'
        id='floatingSelectGrid'
        value={data.profile.goal}
        onChange={(e) =>
          data.setProfile({ ...data.profile, goal: e.target.value })
        }>
        <GoalList />
      </select>
      <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
        Goal
      </label>
    </div>
  </>
);

export default EditStudent;
