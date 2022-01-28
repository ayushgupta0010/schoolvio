import React, { useState } from "react";
import { CREATE_EXAM_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";

const CreateExam = ({ setExamsList }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .mutate({ mutation: CREATE_EXAM_MUTATION, variables: { name } })
      .then((res) => {
        if (res.data.createExam === null) {
          alert("An unknown occurred");
          return;
        }
        setExamsList((original) => [...original, res.data.createExam.exam]);
        setName("");
      })
      .catch((err) => err);
  };

  return (
    <>
      <div className='d-flex justify-content-center d-md-block'>
        <button
          className='styledButton m-0 mb-5'
          type='button'
          style={{ width: "225px" }}
          data-bs-toggle='collapse'
          data-bs-target='#examBox'
          aria-expanded='false'
          aria-controls='examBox'>
          Create exam
        </button>
      </div>
      <div className='collapse mb-3 bg-black p-5 rounded' id='examBox'>
        <form onSubmit={handleSubmit}>
          <div className='form-floating mb-3'>
            <input
              type='text'
              className='form-control bg-transparent text-revert border-secondary'
              placeholder='Exam name'
              id='floatingInput'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
              Exam name
            </label>
          </div>
          <button className='btn btn-dark mt-3'>Save</button>
        </form>
      </div>
    </>
  );
};
export default CreateExam;
