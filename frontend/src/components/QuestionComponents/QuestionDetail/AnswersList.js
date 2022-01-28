import React from "react";
import { Link } from "react-router-dom";

const AnswersList = ({ answersList }) => (
  <div className='list-group'>
    {answersList.map((x, i) => (
      <div key={i} className='list-group-item my-1 bg-dark'>
        <div className='d-flex'>
          <Link
            to={`/profile/${x.user.username}`}
            className='d-block styledFont'>
            <img
              className='rounded-circle m-3'
              style={{ width: "50px", height: "50px" }}
              src={x.user.photo}
              alt='profile-pic'
            />
            {x.user.username}
          </Link>
        </div>
        <div className='container ps-5 ms-5'>
          <div className='text-revert'>{x.answer}</div>
        </div>
      </div>
    ))}
  </div>
);

export default AnswersList;
