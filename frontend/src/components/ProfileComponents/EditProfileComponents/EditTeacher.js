import React from "react";
import QualificationList from "../../UtilityComponents/QualificationList";

const EditTeacher = ({ data }) => (
  <>
    <div className='form-floating mb-3'>
      <select
        className='form-select bg-transparent text-revert border-secondary'
        id='floatingSelectGrid'
        value={data.profile.qualification}
        onChange={(e) =>
          data.setProfile({
            ...data.profile,
            qualification: e.target.value,
          })
        }>
        <QualificationList />
      </select>
      <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
        Qualification
      </label>
    </div>
  </>
);

export default EditTeacher;
