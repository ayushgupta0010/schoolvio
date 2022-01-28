import React from "react";

const QuestionsList = ({ questions, handleAnsChange }) =>
  questions.map((que) => (
    <div className='my-5' key={que.id}>
      <p className='styledFont text-skyblue fs-6 m-0 mb-1'>
        Q{que.id}. {que.question}
      </p>
      <p className='m-0 bg-secondary p-3'>
        <input
          className='form-check-input me-3'
          type='radio'
          name={`optionsFor${que.id}`}
          value='a'
          onChange={(e) => handleAnsChange(e, que.id)}
        />
        {que.optA}
      </p>
      <p className='m-0 bg-secondary p-3'>
        <input
          className='form-check-input me-3'
          type='radio'
          name={`optionsFor${que.id}`}
          value='b'
          onChange={(e) => handleAnsChange(e, que.id)}
        />
        {que.optB}
      </p>
      <p className='m-0 bg-secondary p-3'>
        <input
          className='form-check-input me-3'
          type='radio'
          name={`optionsFor${que.id}`}
          value='c'
          onChange={(e) => handleAnsChange(e, que.id)}
        />
        {que.optC}
      </p>
      <p className='m-0 bg-secondary p-3'>
        <input
          className='form-check-input me-3'
          type='radio'
          name={`optionsFor${que.id}`}
          value='d'
          onChange={(e) => handleAnsChange(e, que.id)}
        />
        {que.optD}
      </p>
    </div>
  ));

export default QuestionsList;
