import React, { useState } from "react";
import { uploadFile } from "../../../utils/fileManager";
import {
  UNVERIFY_TEACHER_MUTATION,
  VERIFY_TEACHER_MUTATION,
} from "../../../utils/mutation";
import client from "../../../utils/apollo";
import QualificationList from "../../UtilityComponents/QualificationList";

const LoadTeacher = ({ teacher, handleChange, cleanForm, setUser }) => {
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleImgChange = async (e) => {
    setMsg({ text: "Uploading image. Please wait", color: "info" });
    let file = e.target.files[0];
    let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
    let path = `${teacher.user.username}/${teacher.user.username}_profilePhoto.${extension}`;
    let url = await uploadFile(file, path);
    setUser((original) => ({
      ...original,
      user: { ...original.user, photo: url },
    }));
    setMsg({ text: "Uploaded successfully", color: "success" });
    setTimeout(() => setMsg({ text: "", color: "" }), 3000);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: "Verifying. Please wait...", color: "info" });
    client
      .mutate({
        mutation: VERIFY_TEACHER_MUTATION,
        variables: {
          username: teacher.user.username,
          photo: teacher.user.photo,
          ...teacher,
        },
      })
      .then((res) => {
        alert("Verified");
        cleanForm();
        setInterval(() => setMsg({ text: "", color: "" }), 500);
      })
      .catch((err) => err);
  };

  const handleUnverify = (e) => {
    setMsg({ text: "Unverifying. Please wait...", color: "danger" });
    client
      .mutate({
        mutation: UNVERIFY_TEACHER_MUTATION,
        variables: { username: teacher.user.username },
      })
      .then((res) => {
        alert("Unverified");
        cleanForm();
        setInterval(() => setMsg({ text: "", color: "" }), 500);
      })
      .catch((err) => err);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='d-flex justify-content-center my-3'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
      </div>
      <div className='text-center mb-3'>
        <figure className='figure my-0'>
          <img
            className='rounded'
            style={{ width: "200px", height: "200px", cursor: "pointer" }}
            src={teacher.user.photo}
            alt='profile'
            onClick={() => document.getElementById("imgFile").click()}
          />
          <figcaption className='figure-caption text-center'>
            Click to change image
          </figcaption>
        </figure>
        <input
          type='file'
          accept='image/*'
          hidden
          id='imgFile'
          onChange={handleImgChange}
        />
      </div>
      <div className='form-floating mb-3'>
        <input
          type='text'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='name'
          value={teacher.name}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Name
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='text'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='startedTeaching'
          value={teacher.startedTeaching}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Started Teaching
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='date'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='joiningDate'
          value={teacher.joiningDate}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Joining Date
        </label>
      </div>
      <div className='form-floating mb-3'>
        <select
          className='form-select bg-transparent text-revert border-secondary'
          id='floatingSelectGrid'
          name='qualification'
          value={teacher.qualification}
          onChange={handleChange}>
          <QualificationList />
        </select>
        <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
          Qualification
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='text'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='contact'
          value={teacher.contact}
          onChange={handleChange}
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
          name='address'
          value={teacher.address}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Address
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='date'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='dob'
          value={teacher.dob}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Date of Birth
        </label>
      </div>
      <div className='text-center my-3'>
        <button type='submit' className='btn btn-success me-5'>
          Verify
        </button>
        <button
          type='button'
          className='btn btn-danger'
          onClick={handleUnverify}>
          Unverify
        </button>
      </div>
    </form>
  );
};

export default LoadTeacher;
