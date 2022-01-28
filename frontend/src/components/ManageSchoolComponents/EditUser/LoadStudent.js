import React, { useState } from "react";
import { uploadFile } from "../../../utils/fileManager";
import { UPDATE_STUDENT_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import ClassList from "../../UtilityComponents/ClassList";
import SectionList from "../../UtilityComponents/SectionList";

const LoadStudent = ({
  student,
  handleChange,
  handleCancel,
  handleUserUpdated,
  setUser,
}) => {
  const [currentClass, setCurrentClass] = useState(
    student.classSection.replace("C_", "").split("_")[0]
  );
  const [currentSection, setCurrentSection] = useState(
    student.classSection.replace("C_", "").split("_")[1]
  );
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleImgChange = async (e) => {
    setMsg({ text: "Uploading image. Please wait", color: "info" });
    let file = e.target.files[0];
    let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
    let path = `${student.user.username}/${student.user.username}_profilePhoto.${extension}`;
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
    const classSection = `C_${currentClass}_${currentSection}`;
    client
      .mutate({
        mutation: UPDATE_STUDENT_MUTATION,
        variables: {
          username: student.user.username,
          photo: student.user.photo,
          ...student,
          classSection,
        },
      })
      .then((res) => {
        if (res.data.updateStudent) {
          setMsg({ text: "Student updated", color: "success" });
          handleUserUpdated();
          alert("Saved");
        } else {
          setMsg({ text: "An unknown error occurred", color: "danger" });
          handleCancel();
          alert("An unknown error occurred");
        }
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
            src={student.user.photo}
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
          value={student.name}
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
          name='fatherName'
          value={student.fatherName}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Father's name
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='text'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='motherName'
          value={student.motherName}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Mother's name
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='number'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='admNo'
          value={student.admNo}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Admission No
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='number'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='rollNo'
          value={student.rollNo}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Roll No
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='text'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='busNo'
          value={student.busNo}
          onChange={handleChange}
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Bus No
        </label>
      </div>
      <div className='row g-2'>
        <div className='col-md'>
          <div className='form-floating mb-3'>
            <select
              className='form-select bg-transparent text-revert border-secondary'
              id='floatingSelect'
              value={currentClass}
              onChange={(e) => setCurrentClass(e.target.value)}
              required>
              <ClassList />
            </select>
            <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
              Class
            </label>
          </div>
        </div>
        <div className='col-md'>
          <div className='form-floating mb-3'>
            <select
              className='form-select bg-transparent text-revert border-secondary'
              id='floatingSelectGrid'
              value={currentSection}
              onChange={(e) => setCurrentSection(e.target.value)}
              required>
              <SectionList />
            </select>
            <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
              Section
            </label>
          </div>
        </div>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='text'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          name='contact'
          value={student.contact}
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
          value={student.address}
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
          value={student.dob}
          onChange={handleChange}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Date of Birth
        </label>
      </div>
      <div className='text-center my-3'>
        <button type='submit' className='btn btn-success me-5'>
          Save
        </button>
        <button type='button' className='btn btn-danger' onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LoadStudent;
