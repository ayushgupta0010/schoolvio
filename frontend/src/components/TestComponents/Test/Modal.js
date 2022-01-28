import React from "react";

const Question = ({ que, answers }) => (
  <div className='my-2 bg-dark rounded p-5' key={que.id}>
    <p className='styledFont m-0'>
      Q{que.id}. {que.question}
    </p>
    <p className='m-0'>a. {que.optA}</p>
    <p className='m-0'>b. {que.optB}</p>
    <p className='m-0'>c. {que.optC}</p>
    <p className='m-0'>d. {que.optD}</p>
    <p className='styledFont2 text-success m-0'>
      Correct option: {que.correctOpt}
    </p>
    <p
      className={`styledFont2 text-${
        que.correctOpt === answers[que.id - 1].myAns ? "success" : "danger"
      }`}>
      Selected option: {answers[que.id - 1].myAns}
    </p>
  </div>
);

const Modal = ({ questions, answers }) => (
  <div className='modal fade' id='viewModal' tabIndex='-1' role='dialog'>
    <div className='modal-dialog modal-dialog-scrollable' role='document'>
      <div className='modal-content bg-black'>
        <div className='modal-header'>
          <h5 className='modal-title text-danger'>Test details</h5>
          <button
            className='btn-close bg-dark text-light'
            data-bs-dismiss='modal'
            aria-label='Close'
          />
        </div>
        <div className='modal-body'>
          {questions.map((que, i) => (
            <Question que={que} answers={answers} key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
