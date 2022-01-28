import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ALL_QUES_QUERY } from "../../utils/query";
import { CREATE_QUESTION_MUTATION } from "../../utils/mutation";
import client from "../../utils/apollo";
import LoadingComponent from "../UtilityComponents/LoadingComponent";

const LoadQuestionsList = ({ questionList }) =>
  questionList.map((x, i) => (
    <div className='bg-black my-4 p-3 py-5 rounded' key={i}>
      <header className='d-flex'>
        <Link to={`/profile/${x.user.username}`} className='d-block styledFont'>
          <img
            className='rounded-circle m-3'
            style={{ width: "75px", height: "75px" }}
            src={x.user.photo}
            alt='profile-pic'
          />
          {x.user.username}
        </Link>
      </header>
      <section className='mt-0 mx-3'>
        <p className='text-justify'>{x.question}</p>
        <div className='alert bg-dark' role='alert'>
          <Link to={`/question/${x.id}`}>
            {x.countAnswers === 1 ? "1 answer" : x.countAnswers + " answers"}
          </Link>
        </div>
      </section>
    </div>
  ));

const Question = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .mutate({
        mutation: CREATE_QUESTION_MUTATION,
        variables: { question },
      })
      .then((res) => {
        setQuestionList((original) => [
          res.data.createQuestion.question,
          ...original,
        ]);
        setQuestion("");
        setMsg({ text: "Question uploaded", color: "success" });
      })
      .catch((err) =>
        setMsg({ text: "Something went wrong", color: "danger" })
      );
  };

  useEffect(() => {
    document.title = "QnA";
    client
      .query({ query: ALL_QUES_QUERY })
      .then((res) => {
        res.data.listQuesAll && setQuestionList(res.data.listQuesAll);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, []);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container mt-5'>
      <button
        className='styledButton m-0 my-3'
        type='button'
        style={{ width: "225px" }}
        data-bs-toggle='collapse'
        data-bs-target='#questionBox'
        aria-expanded='false'
        aria-controls='questionBox'>
        Post a question
      </button>
      <div className='d-flex justify-content-center'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
      </div>
      <div className='collapse mb-3 bg-black p-3 rounded' id='questionBox'>
        <form onSubmit={handleSubmit}>
          <div className='form-floating mb-3'>
            <textarea
              className='form-control bg-transparent text-revert border-secondary'
              style={{ height: "200px" }}
              id='floatingTextarea'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <label
              htmlFor='floatingTextarea'
              className='text-skyblue fw-bolder'>
              Question
            </label>
          </div>
          <button className='btn btn-dark d-block mt-3'>Post</button>
        </form>
      </div>
      {questionList.length !== 0 ? (
        <LoadQuestionsList questionList={questionList} />
      ) : (
        <div className='text-center mt-5'>
          <p className='styledFont text-revert'>No questions</p>
        </div>
      )}
    </div>
  );
};

export default Question;
