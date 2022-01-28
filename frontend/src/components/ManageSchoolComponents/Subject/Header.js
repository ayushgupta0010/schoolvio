import React, { useState } from "react";
import ClassList from "../../UtilityComponents/ClassList";
import SubjectList from "../../UtilityComponents/SubjectList";

const Header = ({ subjects, setSubjects }) => {
  const [currentClass, setCurrentClass] = useState("");
  const [currentSubject, setCurrentSubject] = useState("");

  const handleSubjectChange = (action) => {
    if (currentClass === "" || currentSubject === "") return;
    let subList =
      subjects[currentClass] !== undefined
        ? new Set(subjects[currentClass])
        : new Set();

    action === "add"
      ? subList.add(currentSubject)
      : subList.delete(currentSubject);

    setSubjects((original) => ({
      ...original,
      [currentClass]: [...subList],
    }));
  };

  return (
    <>
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
              value={currentSubject}
              onChange={(e) => setCurrentSubject(e.target.value)}
              required>
              <SubjectList />
            </select>
            <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
              Subject
            </label>
          </div>
        </div>
      </div>
      <div className='text-center'>
        <button
          className='btn btn-sm btn-outline-primary me-3'
          onClick={() => handleSubjectChange("add")}>
          Add
        </button>
        <button
          className='btn btn-sm btn-outline-danger'
          onClick={() => handleSubjectChange("remove")}>
          Remove
        </button>
      </div>
    </>
  );
};

export default Header;
