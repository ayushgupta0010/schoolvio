import React from "react";
import ClassList from "../../UtilityComponents/ClassList";
import SectionList from "../../UtilityComponents/SectionList";
import SubjectList from "../../UtilityComponents/SubjectList";

const Headers = (props) => (
  <>
    <div className='form-floating mb-3'>
      <input
        type='text'
        className='form-control bg-transparent text-revert border-secondary'
        id='floatingInput'
        value={props.title}
        onChange={(e) => props.setTitle(e.target.value)}
        required
      />
      <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
        Title
      </label>
    </div>
    <div className='row g-2'>
      <div className='col-md'>
        <div className='form-floating mb-3'>
          <select
            className='form-select bg-transparent text-revert border-secondary'
            id='floatingSelect'
            value={props.currentClass}
            onChange={(e) => props.setCurrentClass(e.target.value)}
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
            value={props.currentSection}
            onChange={(e) => props.setCurrentSection(e.target.value)}
            required>
            <SectionList />
          </select>
          <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
            Section
          </label>
        </div>
      </div>
    </div>

    <div className='row g-2'>
      <div className='col-md'>
        <div className='form-floating mb-3'>
          <select
            className='form-select bg-transparent text-revert border-secondary'
            id='floatingSelectGrid'
            value={props.subject}
            onChange={(e) => props.setSubject(e.target.value)}
            required>
            <SubjectList />
          </select>
          <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
            Subject
          </label>
        </div>
      </div>

      <div className='col-md'>
        <div className='form-floating mb-3'>
          <input
            type='number'
            className='form-control bg-transparent text-revert border-secondary'
            id='floatingInput'
            value={props.duration}
            onChange={(e) => props.setDuration(e.target.value)}
            required
          />
          <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
            Duration (in minutes)
          </label>
        </div>
      </div>
    </div>
  </>
);

export default Headers;
