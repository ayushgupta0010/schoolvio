import React from "react";

const EditSchool = ({ data }) => (
  <>
    <div className='form-floating mb-3'>
      <input
        type='text'
        className='form-control bg-transparent text-revert border-secondary'
        id='floatingInput'
        value={data.profile.contact}
        onChange={(e) =>
          data.setProfile({
            ...data.profile,
            contact: e.target.value,
          })
        }
        required
      />
      <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
        Contact
      </label>
    </div>

    <div className='form-floating mb-3'>
      <input
        type='text'
        className='form-control bg-transparent text-revert border-secondary'
        id='floatingInput'
        value={data.profile.principal}
        onChange={(e) =>
          data.setProfile({
            ...data.profile,
            principal: e.target.value,
          })
        }
        required
      />
      <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
        Principal
      </label>
    </div>

    <div className='form-floating mb-3'>
      <input
        type='text'
        className='form-control bg-transparent text-revert border-secondary'
        id='floatingInput'
        value={data.profile.name}
        onChange={(e) =>
          data.setProfile({
            ...data.profile,
            name: e.target.value,
          })
        }
        required
      />
      <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
        School name
      </label>
    </div>
  </>
);

export default EditSchool;
