import React from "react";
import { Link } from "react-router-dom";

const AnswersList = ({ questions, answers, setModalData }) =>
  answers.map((answer, i) => (
    <div
      key={i}
      className='d-flex justify-content-between align-items-center bg-dark mb-5'>
      <Link
        to={`/profile/${answer.student.user.username}`}
        className='styledFont2'>
        <img
          className='rounded-circle me-3'
          style={{ width: "50px", height: "50px" }}
          src={answer.student.user.photo}
          alt='profile-pic'
        />
        {answer.student.name}
      </Link>
      <span className=''>Marks: {answer.marks}</span>
      <button
        className='btn btn-outline-info'
        data-bs-toggle='modal'
        data-bs-target='#viewModal'
        onClick={() =>
          setModalData({
            questions: JSON.parse(questions),
            answers: JSON.parse(answer.answers),
          })
        }>
        View
      </button>
    </div>
  ));

const Offcanvas = ({ testsList, setModalData }) =>
  testsList.map((test, i) => (
    <div
      key={i}
      id={`offcanvas${test.id}`}
      className='offcanvas offcanvas-end bg-dark'
      data-bs-scroll='true'
      data-bs-backdrop='true'
      tabIndex='-1'>
      <div className='offcanvas-header text-revert'>
        <h5 id='offcanvasRightLabel'>Answers for Test {test.id}</h5>
        <button
          type='button'
          className='btn-close text-reset bg-light'
          data-bs-dismiss='offcanvas'
          aria-label='Close'
        />
      </div>
      <div className='offcanvas-body py-0'>
        {test.answers.length !== 0 ? (
          <AnswersList
            questions={test.questions}
            answers={test.answers}
            setModalData={setModalData}
          />
        ) : (
          <span className='styledFont'>No answers have been submitted yet</span>
        )}
      </div>
    </div>
  ));

export default Offcanvas;
