import React from "react";

const LoadQuestions = ({
  questions,
  removeQuestion,
  handleChange,
  handleCorrectOptChange,
}) =>
  questions.map((que, i) => (
    <div className='my-2 bg-dark p-5 rounded' key={i}>
      <div className='input-group mb-5'>
        <span className='input-group-text bg-secondary'>Question {i + 1}.</span>
        <textarea
          className='form-control border-secondary bg-transparent rounded-end'
          name='question'
          value={que.question}
          onChange={(e) => handleChange(e, i)}
        />
      </div>

      <div className='input-group mb-3'>
        <span className='input-group-text bg-secondary' id='basic-addon1'>
          Option A
        </span>
        <input
          type='text'
          className='form-control border-secondary'
          name='optA'
          value={que.optA}
          onChange={(e) => handleChange(e, i)}
        />
        <span className='input-group-text bg-secondary'>
          <input
            className='form-check-input mt-0 ms-2'
            type='radio'
            name={`correctOpt${i}`}
            value='a'
            checked={que.correctOpt === "a"}
            onChange={(e) => handleCorrectOptChange(e, i)}
          />
        </span>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text bg-secondary' id='basic-addon2'>
          Option B
        </span>
        <input
          type='text'
          className='form-control border-secondary'
          name='optB'
          value={que.optB}
          onChange={(e) => handleChange(e, i)}
        />
        <span className='input-group-text bg-secondary'>
          <input
            className='form-check-input mt-0 ms-2'
            type='radio'
            name={`correctOpt${i}`}
            value='b'
            checked={que.correctOpt === "b"}
            onChange={(e) => handleCorrectOptChange(e, i)}
          />
        </span>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text bg-secondary' id='basic-addon3'>
          Option C
        </span>
        <input
          type='text'
          className='form-control border-secondary'
          name='optC'
          value={que.optC}
          onChange={(e) => handleChange(e, i)}
        />
        <span className='input-group-text bg-secondary'>
          <input
            className='form-check-input mt-0 ms-2'
            type='radio'
            name={`correctOpt${i}`}
            value='c'
            checked={que.correctOpt === "c"}
            onChange={(e) => handleCorrectOptChange(e, i)}
          />
        </span>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text bg-secondary' id='basic-addon4'>
          Option D
        </span>
        <input
          type='text'
          className='form-control border-secondary'
          name='optD'
          value={que.optD}
          onChange={(e) => handleChange(e, i)}
        />
        <span className='input-group-text bg-secondary'>
          <input
            className='form-check-input mt-0 ms-2'
            type='radio'
            name={`correctOpt${i}`}
            value='d'
            checked={que.correctOpt === "d"}
            onChange={(e) => handleCorrectOptChange(e, i)}
          />
        </span>
      </div>
      <div className='w-100 text-end'>
        <button
          className='btn btn-outline-danger'
          onClick={() => removeQuestion(i)}>
          <i className='bi bi-trash-fill fs-5' />
        </button>
      </div>
    </div>
  ));

export default LoadQuestions;
